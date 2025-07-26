import nats from "node-nats-streaming";
import { TicketCreatedListener } from "./events/ticket-created-listener";

const stan = nats.connect("ticketing", "xyz", {
    url: "nats://localhost:4222"
});

stan.on("connect", () => {
    console.log("listener connected to NATS streaming server");

    stan.on("close", () => {
        console.log("NATS connection closed");
        process.exit();
    });

    new TicketCreatedListener(stan).listen(); // create an instance of the listener and start listening


}); // this function will be executed after the client has successfully connected to the NATS streaming server.



process.on("SIGINT", () => stan.close()); // this will close the connection to the NATS streaming server when the process is interrupted (e.g., Ctrl+C)
process.on("SIGTERM", () => stan.close()); // this will close the connection to the NATS streaming server when the process is terminated\






