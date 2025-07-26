import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects"; // import the Subjects enum


interface Event {
  subject: Subjects; // the subject of the event
  data: any; // the data of the event
}


export abstract class Listener<T extends Event> {
    abstract subject: T["subject"]; // the subject to listen to
    abstract queueGroupName: string; // the name of the queue group to join
    private client: Stan;
    abstract onMessage(data: T["data"], msg: Message): void; // the method to handle the message
    protected ackWait = 5 * 1000; // the time to wait for an acknowledgment before considering the message unacknowledged

    constructor (client: Stan) {
        this.client = client;

    }

    subsriptionOptions() {
        return this.client.subscriptionOptions()
            .setDeliverAllAvailable() // deliver all available messages
            .setManualAckMode(true) // enable manual acknowledgment
            .setAckWait(this.ackWait) // set the acknowledgment wait time
            .setDurableName(this.queueGroupName); // set the durable name for the subscription
    }

    listen(){
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subsriptionOptions()
        );

        subscription.on("message", (msg: Message) => {
            console.log(`Message received: ${this.subject} ${msg.getSequence()}, Data: ${msg.getData()}`);
            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg); // call the abstract method to handle the message
        });
    }



    parseMessage(msg: Message) {
        const data = msg.getData();
        if (typeof data === "string") {
            return JSON.parse(data);
        }
        return JSON.parse(data.toString("utf8"));
    }


}