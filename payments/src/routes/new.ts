import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/order';
import { BadRequestError, NotFoundError, orderStatus, requireAuth, validateRequest } from '@garagenew/common';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post("/api/payments",
    requireAuth,
    [
        body('token')
            .not().isEmpty()
            .withMessage('Token is required'),
        body('orderId')
            .not().isEmpty()
            .withMessage('Order ID is required'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        console.log("llllllllllllllllllllllllllllllllll")
        const { token, orderId } = req.body;
        const order = await Order.findById(orderId);
        if (!order) {
            throw new NotFoundError();
        }
        if (order.userId !== req.currentUser!.id) {
            throw new Error('Not authorized to make payment for this order');
        }

        if (order.status === orderStatus.Cancelled) {
            throw new BadRequestError('Cannot pay for a cancelled order');
        }

        const charge = await stripe.charges.create({
            amount: order.price * 100,
            currency: "usd",
            source: token,
            description: `Payment for order ${orderId}`
        })

        const payment = Payment.build({
            orderId,
            stripeId: charge.id
        });

        await payment.save();

        new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        });


        res.send({ id: payment.id });
    })


export { router as createChargeRouter };