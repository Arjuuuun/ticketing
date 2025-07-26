import express, { Request, Response } from 'express';
import { BadRequestError, NotFoundError, requireAuth, validateRequest } from '@garagenew/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { orderStatus } from '@garagenew/common';
import { OrderCreatedPublisher } from '../events/publisher/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';


const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 5 * 60; // 5 minutes

router.post('/api/orders',
  requireAuth,
  [
    body('ticketId').not().isEmpty().custom((input) => {
      return mongoose.Types.ObjectId.isValid(input);
    }).withMessage('Ticket ID must be a valid MongoDB ID')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // find the tocket the user is trying to order in the database
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if(!ticket) {
      throw new NotFoundError();
    }

    // make sure the ticket is not already reserved
    // run query to look at all orders and find an order where the ticket is the ticket we fetched and order status is not cancelled or complete
    const existingOrder = await ticket.isReserved();

    if(existingOrder) {
      throw new BadRequestError('Ticket is already reserved');
    }
    //calculate the expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: orderStatus.Created,
      expiresAt: expiration,
      ticket
    });
    await order.save();

    //Publish an event saying that an order was created

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      userId: order.userId,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price
      }
    });

    res.send({ message: 'Order created successfully!' ,data: order });
  });

export { router as newOrderRouter };