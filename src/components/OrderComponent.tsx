import { useState } from 'react';
import { restApi } from '@/api/rest';
import { useQuery } from '@apollo/client';
import { graphqlClient, GET_ORDER } from '@/api/graphql';
import { Order } from '@/types/models';

export function OrderComponent() {
  const [orderId, setOrderId] = useState<string>('1');
  const [restOrder, setRestOrder] = useState<Order | null>(null);
  const [loadingRest, setLoadingRest] = useState(false);
  const { data: graphqlData, loading: loadingGraphQL } = useQuery(GET_ORDER, {
    variables: { id: orderId },
    client: graphqlClient,
    skip: !orderId,
  });

  const fetchRestOrder = async () => {
    setLoadingRest(true);
    try {
      const order = await restApi.getOrder(parseInt(orderId));
      setRestOrder(order);
    } catch (err) {
      console.error('Failed to fetch order:', err);
    } finally {
      setLoadingRest(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h2>Order</h2>
      <div>
        <input
          type="number"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Order ID"
        />
        <button onClick={fetchRestOrder} disabled={loadingRest}>
          {loadingRest ? 'Loading...' : 'Fetch REST Order'}
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div>
          <h3>REST API Order</h3>
          {loadingRest ? (
            <div>Loading...</div>
          ) : restOrder ? (
            <div>
              <p>ID: {restOrder.id}</p>
              <p>User ID: {restOrder.userId}</p>
              <p>Status: {restOrder.status}</p>
              <p>Total: ${restOrder.total}</p>
              <p>Product IDs: {restOrder.productIds.join(', ')}</p>
              <p>Shipping Address: {restOrder.shippingAddress.street}, {restOrder.shippingAddress.city}, {restOrder.shippingAddress.zipCode}</p>
            </div>
          ) : (
            <div>No order data</div>
          )}
        </div>
        <div>
          <h3>GraphQL Order</h3>
          {loadingGraphQL ? (
            <div>Loading...</div>
          ) : graphqlData?.order ? (
            <div>
              <p>ID: {graphqlData.order.id}</p>
              <p>User ID: {graphqlData.order.userId}</p>
              <p>Status: {graphqlData.order.status}</p>
              <p>Total: ${graphqlData.order.total}</p>
              <p>Product IDs: {graphqlData.order.productIds.join(', ')}</p>
              <p>Shipping Address: {graphqlData.order.shippingAddress.street}, {graphqlData.order.shippingAddress.city}, {graphqlData.order.shippingAddress.zipCode}</p>
            </div>
          ) : (
            <div>No order data</div>
          )}
        </div>
      </div>
    </div>
  );
}

