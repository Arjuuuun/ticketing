import mongoose from "mongoose";
import { Order, orderStatus } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";


interface TicketAttrs {
    title: string;
    price: number;
    id: string;
    // userId: string;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
    // userId: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event:{id:string, version:number}) : Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret:any) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1 // we want the previous version
    });
};
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id, // mongoose will automatically create an _id field if not provided
        title: attrs.title,
        price: attrs.price,
    });
};

// make sure the ticket is not already reserved
// run query to look at all orders and find an order where the ticket is the ticket we fetched and order status is not cancelled or complete
ticketSchema.methods.isReserved = async function () {
    //this === the ticket document that we just called 'isReserved' on
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                orderStatus.Created,
                orderStatus.AwaitingPayment,
                orderStatus.Complete
            ]
        }
    });
    return !!existingOrder;
}

export const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);
