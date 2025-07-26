import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

const stan = nats.connect("ticketing",randomBytes(4).toString("hex"),{
    url: "nats://localhost:4222"
})


stan.on("connect", async() => {
    console.log("publisher connected to NATS streaming server");
    // const data = JSON.stringify({
    //     id: "123",
    //     title: "concert",
    //     price: 20
    // });
    // stan.publish("ticket:created", data, () => {
    //     console.log("event published");
    // });
    
    const publisher = new TicketCreatedPublisher(stan);
    try {
         await publisher.publish({
        id: "123",
        title: "concert",
        price: 800
    })

    }catch (err) {
       console.error("Error publishing event", err);
    }
   

})   // this function will be executed after the client has successfully connected to the net streaming server.