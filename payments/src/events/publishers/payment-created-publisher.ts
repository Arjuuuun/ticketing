import { Subjects, Publisher, PaymentCreatedEvent } from "@garagenew/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
