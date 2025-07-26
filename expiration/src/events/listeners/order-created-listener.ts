import { Listener, OrderCreatedEvent, Subjects } from '@garagenew/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    console.log('Adding job to expiration queue:', data.id);
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("waiting this amny ms", delay)
    await expirationQueue.add({ orderId: data.id }, {
      delay
    });
    console.log('Job added');


    msg.ack();
  }
}