import {Publisher, Subjects, TicketUpdatedEvent} from "@garagenew/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
      subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}

