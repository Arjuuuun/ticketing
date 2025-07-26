import {Publisher , OrderCreatedEvent, Subjects} from "@garagenew/common";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;


}
