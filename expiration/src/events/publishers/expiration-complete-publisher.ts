import { Subjects, Publisher, ExpirationCompleteEvent } from "@garagenew/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
