import { Subjects } from "./subjects";

export interface TicketCreatedEvent {
    subject: Subjects.TicketCreated; // the subject of the event
    data: {
        id: string; // unique identifier for the ticket
        title: string; // title of the ticket
        price: number; // price of the ticket
    };
}