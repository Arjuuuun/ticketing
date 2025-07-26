import { Listener, OrderCancelledEvent, Subjects } from "@garagenew/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName; // unique identifier for the queue group

    async onMessage(data: OrderCancelledEvent["data"], msg: Message){
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket) {
            throw new Error("Ticket not found");
        }
        ticket.set({
            orderId: undefined // clear the orderId to mark the ticket as available again
        });
        await ticket.save(); // save the updated ticket
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        });
        msg.ack();
    }
}