import React from 'react';
import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const OrderShow = ({order, currentUser}) => {

    const [timeLeft, setTimeLeft] = useState(0);

    const [doRequest, errors] = useRequest({
        url: `/api/paymentss`,
        method: 'post',
        body: { orderId: order.id, },
        onSuccess: (payment) => Router.push('/orders'),
    });

    useEffect(() => {
        const findTimeLeft = () => { 
            const msLeft = new Date(order.expiresAt) - new Date();
            const secondsLeft = Math.round(msLeft / 1000);
            setTimeLeft(secondsLeft);
        }
        findTimeLeft();
       const timerId =  setInterval(findTimeLeft, 1000);
       return () => {
           clearInterval(timerId);
       }
    },[])

    return (
        <div>
        <h1>Order Details</h1>
        <p>Order ID: {order.id}</p>
        <p>Ticket Title: {order.ticket.title}</p>
        <p>Price: ${order.ticket.price}</p>
        <div>
            <p>Order Status: {order.status}</p>

            {timeLeft <= 0 ? <p className="text-danger">Order has expired!</p> : <p>Time Remaining: {timeLeft} seconds</p>}
        </div>
        <StripeCheckout email={currentUser.email} token={({id})=>{doRequest({ token: id })}} stripeKey='pk_test_51RnZb1EONBVa1lNRI8jPe3D2HbtUBiSWFqfdxNHH0YH8TyzWri7jWAn5mS2GkPhhpSmx9MIdU7GgWLsjBJD3vFsN0040elSqPX' amount={order.ticket.price * 100}></StripeCheckout>
        {errors}
        </div>
    );
}

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    console.log('orderId in getInitialProps:', orderId);

    const { data } = await client.get(`/api/orders/${orderId}`);
    return { order: data };
}

export default OrderShow;