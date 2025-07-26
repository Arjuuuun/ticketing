import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects"; // import the Subjects enum\

interface Event {
    subject: Subjects; // the subject of the event
    data: any; // the data of the event
}


export abstract class Publisher<T extends Event>{
    abstract subject: T["subject"]; // the subject to publish to
    private client: Stan; // the NATS client

    constructor (client: Stan){
        this.client = client; // initialize the client
    }

    publish(data: T["data"]) {
        return new Promise<void>((resolve,reject)=> {
            this.client.publish(this.subject, JSON.stringify(data), (err)=> {
                if(err){
                    return reject(err);
                }
                console.log(`event published to subject ${this.subject}`);
                resolve();
            });

        })
        
    }

}