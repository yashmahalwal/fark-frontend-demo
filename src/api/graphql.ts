import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { User, Order, Product } from '@/types/models';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

// Queries
export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      email
      name
      status
      description
      metadata
      tags
      paymentMethod {
        ... on CreditCard {
          type
          last4
        }
        ... on DebitCard {
          type
          bank
        }
        ... on PayPal {
          email
        }
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      name
      status
      description
      metadata
      tags
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      userId
      productIds
      status
      total
      discountCode
      shippingAddress {
        street
        city
        zipCode
        country
      }
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      category
      inStock
      specifications {
        key
        value
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser(
    $email: String!
    $name: String!
    $status: UserStatus!
    $description: String
    $metadata: JSON
    $tags: [String!]!
    $paymentMethod: PaymentMethod!
  ) {
    createUser(
      email: $email
      name: $name
      status: $status
      description: $description
      metadata: $metadata
      tags: $tags
      paymentMethod: $paymentMethod
    ) {
      id
      email
      name
      status
    }
  }
`;

export { client as graphqlClient };

