import { NotAuthorizedError, NotFoundError, requireAuth } from '@garagenew/common';
import express, { Request, Response } from 'express';
import { Order, orderStatus } from '../models/order';
import { OrderCancelledPublisher } from '../events/publisher/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';


const router = express.Router();

router.patch('/api/orders/:orderId', requireAuth, async(req: Request, res: Response) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId).populate("ticket");
  if (!order) {
    throw new NotFoundError();

  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  order.status = orderStatus.Cancelled;
  await order.save();
  //publish event saying it is cancelled

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id,
    }
  });

  res.status(204).send(order);
});

export { router as deleteorderRouter };