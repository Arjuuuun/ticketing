import {Publisher , OrderCancelledEvent, Subjects} from "@garagenew/common";


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
