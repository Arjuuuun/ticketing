import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";



export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated; // the subject to listen to
    queueGroupName = "listenerQueueGroup"; // the name of the queue group to join

    onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
        console.log(`Ticket created event received: ${data.id}, Title: ${data.title}, Price: ${data.price}`);
        msg.ack(); // acknowledge the message
    }
}