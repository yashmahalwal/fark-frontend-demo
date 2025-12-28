# Fark Frontend Demo

Frontend application that uses REST, GraphQL, and gRPC APIs from the backend. Built for testing Fark.ai's frontend impact detection.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Apollo Client** for GraphQL
- **Fetch API** for REST
- **gRPC** (mock implementation - browser limitation)

## Project Structure

```
src/
├── api/
│   ├── rest.ts          # REST API client
│   ├── graphql.ts       # GraphQL client & queries
│   └── grpc.ts          # gRPC client (mock)
├── components/
│   ├── RestUserComponent.tsx      # Uses REST API
│   ├── GraphQLUserComponent.tsx   # Uses GraphQL
│   ├── GrpcUserComponent.tsx      # Uses gRPC
│   ├── ProductsComponent.tsx      # Uses REST & GraphQL
│   └── OrderComponent.tsx         # Uses REST & GraphQL
├── types/
│   └── models.ts        # Shared TypeScript types
├── App.tsx              # Main app component
└── main.tsx             # Entry point
```

## Setup

```bash
npm install
npm run dev
```

The app will run on `http://localhost:5173`

## API Usage

### REST API
- **Client**: `src/api/rest.ts`
- **Component**: `RestUserComponent`
- **Endpoints**: `/api/users/:id`, `/api/orders/:id`, `/api/products`

### GraphQL API
- **Client**: `src/api/graphql.ts` (Apollo Client)
- **Component**: `GraphQLUserComponent`
- **Endpoint**: `/graphql`
- **Queries**: `GET_USER`, `GET_USERS`, `GET_ORDER`, `GET_PRODUCTS`
- **Mutations**: `CREATE_USER`

### gRPC API
- **Client**: `src/api/grpc.ts` (mock - browser limitation)
- **Component**: `GrpcUserComponent`
- **Note**: gRPC doesn't work directly in browsers. This is a mock implementation that references API fields for Fark.ai testing.

## Features

The frontend uses all three API interfaces and references:
- **User fields**: `email`, `name`, `status`, `description`, `metadata`, `tags`, `paymentMethod`
- **Order fields**: `userId`, `productIds`, `status`, `total`, `discountCode`, `shippingAddress`
- **Product fields**: `name`, `price`, `category`, `inStock`, `specifications`
- **Enums**: `UserStatus`, `OrderStatus`
- **Union types**: `PaymentMethod` (CreditCard, DebitCard, PayPal)

## Testing with Fark.ai

When the backend introduces breaking changes (field renames, enum changes, etc.), Fark.ai's frontend impact finder will:
1. Search this codebase for references to changed API fields
2. Identify impacted files and line numbers
3. Determine severity and suggest fixes

## Development

```bash
# Type checking
npm run typecheck

# Build
npm run build

# Preview production build
npm run preview
```

## Notes

- The backend must be running on `localhost:3000` (REST/GraphQL) and `localhost:50051` (gRPC)
- gRPC client is mocked due to browser limitations - it still references API fields for testing
- All components use the shared types from `src/types/models.ts` which match the backend

