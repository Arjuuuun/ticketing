import React from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const TicketShow = ({ticket}) => {

    const [doRequest, errors] = useRequest({
        url: `/api/orders`,
        method: "post",
        body: {
            ticketId: ticket.id
        },
        onSuccess: (order) =>{ 
            console.log( "Order created successfully:", order);
            Router.push('/orders/[orderId]', `/orders/${order.data.id}`);}
    });

    return (
        <div>
            <h1>Ticket Show Page</h1>
            <h2>{ticket.title}</h2>
            <p>{ticket.description}</p>
            <p>Price: ${ticket.price}</p>
            {errors}
            <button onClick={(event) =>doRequest()} className="btn btn-primary">Buy Ticket</button>
        </div>
    )
}

TicketShow.getInitialProps = async (context, client) => 
    {
        const { ticketId } = context.query;
        const { data } = await client.get(`/api/tickets/${ticketId}`);
        return { ticket: data };
    }

export default TicketShow;