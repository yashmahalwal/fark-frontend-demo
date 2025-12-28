import { useState, useEffect } from 'react';
import { restApi } from '@/api/rest';
import { useQuery } from '@apollo/client';
import { graphqlClient, GET_PRODUCTS } from '@/api/graphql';
import { Product } from '@/types/models';

export function ProductsComponent() {
  const [restProducts, setRestProducts] = useState<Product[]>([]);
  const [loadingRest, setLoadingRest] = useState(false);
  const { data: graphqlData, loading: loadingGraphQL } = useQuery(GET_PRODUCTS, {
    client: graphqlClient,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingRest(true);
      try {
        const products = await restApi.getProducts();
        setRestProducts(products);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoadingRest(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h2>Products</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h3>REST API Products</h3>
          {loadingRest ? (
            <div>Loading...</div>
          ) : (
            <ul>
              {restProducts.map((product) => (
                <li key={product.id}>
                  {product.name} - ${product.price} ({product.category})
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3>GraphQL Products</h3>
          {loadingGraphQL ? (
            <div>Loading...</div>
          ) : (
            <ul>
              {graphqlData?.products?.map((product: Product) => (
                <li key={product.id}>
                  {product.name} - ${product.price} ({product.category})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

