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

export const GET_ORDERS = gql`
  query GetOrders {
    orders {
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
    $paymentMethod: PaymentMethodInput!
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

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $email: String!
    $name: String!
    $status: UserStatus!
    $description: String
    $metadata: JSON
    $tags: [String!]!
    $paymentMethod: PaymentMethodInput!
  ) {
    updateUser(
      id: $id
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

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!
    $price: Float!
    $category: String!
    $inStock: Boolean!
    $specifications: [ProductSpecInput!]!
  ) {
    createProduct(
      name: $name
      price: $price
      category: $category
      inStock: $inStock
      specifications: $specifications
    ) {
      id
      name
      price
      category
      inStock
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct(
    $id: ID!
    $name: String!
    $price: Float!
    $category: String!
    $inStock: Boolean!
    $specifications: [ProductSpecInput!]!
  ) {
    updateProduct(
      id: $id
      name: $name
      price: $price
      category: $category
      inStock: $inStock
      specifications: $specifications
    ) {
      id
      name
      price
      category
      inStock
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder(
    $userId: ID!
    $productIds: [ID!]!
    $status: OrderStatus!
    $total: Float!
    $discountCode: String
    $shippingAddress: AddressInput!
  ) {
    createOrder(
      userId: $userId
      productIds: $productIds
      status: $status
      total: $total
      discountCode: $discountCode
      shippingAddress: $shippingAddress
    ) {
      id
      userId
      productIds
      status
      total
    }
  }
`;

export const UPDATE_ORDER = gql`
  mutation UpdateOrder(
    $id: ID!
    $userId: ID!
    $productIds: [ID!]!
    $status: OrderStatus!
    $total: Float!
    $discountCode: String
    $shippingAddress: AddressInput!
  ) {
    updateOrder(
      id: $id
      userId: $userId
      productIds: $productIds
      status: $status
      total: $total
      discountCode: $discountCode
      shippingAddress: $shippingAddress
    ) {
      id
      userId
      productIds
      status
      total
    }
  }
`;

export const DELETE_ORDER = gql`
  mutation DeleteOrder($id: ID!) {
    deleteOrder(id: $id)
  }
`;

export { client as graphqlClient };

