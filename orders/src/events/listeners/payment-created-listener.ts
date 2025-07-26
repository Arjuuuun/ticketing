import { Listener, orderStatus, PaymentCreatedEvent, Subjects } from "@garagenew/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class PaymentCreatedlistener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
        const { id, orderId, stripeId } = data;

        // Create a new payment in the database
        const order =  await Order.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        order.set({ status: orderStatus.Complete });
        await order.save();

        // Acknowledge the message
        msg.ack();
    }
}