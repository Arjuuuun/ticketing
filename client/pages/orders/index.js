


const OrderIndex = ({ orders }) => {
    console.log(orders,"orders in OrderIndex");
  const safeOrders = Array.isArray(orders) ? orders : [];
  return (
    <div>
      <h1>My Orders</h1>
      <ul>
        {safeOrders.map(order => (
          <li key={order.id}>
            {order.ticket.title} - ${order.ticket.price} - Status: {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
};



export default OrderIndex;
OrderIndex.getInitialProps = async (context, client) => {
    const { data } = await client.get('/api/orders');
    console.log(data,"datadatadatadata")
    return { orders: data.orders };
}