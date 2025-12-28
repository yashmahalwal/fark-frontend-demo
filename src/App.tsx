import { ApolloProvider } from '@apollo/client';
import { graphqlClient } from '@/api/graphql';
import { RestUserComponent } from '@/components/RestUserComponent';
import { GraphQLUserComponent } from '@/components/GraphQLUserComponent';
import { GrpcUserComponent } from '@/components/GrpcUserComponent';
import { ProductsComponent } from '@/components/ProductsComponent';
import { OrderComponent } from '@/components/OrderComponent';
import './App.css';

function App() {
  return (
    <ApolloProvider client={graphqlClient}>
      <div className="App">
        <header style={{ padding: '20px', background: '#f0f0f0' }}>
          <h1>Fark Frontend Demo</h1>
          <p>Testing REST, GraphQL, and gRPC APIs</p>
        </header>
        <main style={{ padding: '20px' }}>
          <RestUserComponent />
          <GraphQLUserComponent />
          <GrpcUserComponent />
          <ProductsComponent />
          <OrderComponent />
        </main>
      </div>
    </ApolloProvider>
  );
}

export default App;

