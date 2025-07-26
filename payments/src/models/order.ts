import { orderStatus } from "@garagenew/common";
import mongoose, { Document } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";


export interface OrderAttrs {
    id: string;
    version: number;
    userId: string;
    status: orderStatus;
    price: number;
}

export interface OrderDoc extends Document {
    version: number;
    userId: string;
    status: orderStatus;
    price: number;
}


interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    status: { type: String, enum: orderStatus, required: true },
    price: { type: Number, required: true }
}, {
    toJSON: {
        transform(doc, ret:any) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin); //To use the version key to prevent concurrent updates
orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        userId: attrs.userId,
        status: attrs.status,
        price: attrs.price
    });
};

export const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);