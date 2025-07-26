import { ExpirationCompleteEvent, Listener, orderStatus, Subjects } from "@garagenew/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publisher/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;

    async onMessage(data:ExpirationCompleteEvent["data"], msg: Message) {
        const order  = await Order.findById(data.orderId).populate('ticket');
        if (!order) {
            throw new Error('Order not found');
        }

        if(order.status === orderStatus.Complete){
            return msg.ack()
        }
        // Mark the order as expired
        order.set({ status: orderStatus.Cancelled });
        await order.save();
        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });
        msg.ack();
    }
}