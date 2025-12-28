// Shared types matching backend
export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
}

export enum OrderStatus {
  CREATED = "CREATED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
}

export type PaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "PAYPAL";

export interface User {
  id: number;
  email: string;
  name: string;
  status: UserStatus;
  description: string | null;
  metadata: Record<string, any>;
  tags: string[];
  paymentMethod: PaymentMethod;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  specifications: ProductSpec[];
}

export interface ProductSpec {
  key: string;
  value: string;
}

export interface Order {
  id: number;
  userId: number;
  productIds: number[];
  status: OrderStatus;
  total: number;
  discountCode: string | null;
  shippingAddress: Address;
}

export interface Address {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

