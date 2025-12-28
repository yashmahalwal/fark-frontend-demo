import { User, Order, Product } from '@/types/models';

const API_BASE_URL = 'http://localhost:3000/api';

export class RestApiClient {
  async getUser(id: number): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    return response.json();
  }

  async createUser(user: Omit<User, 'id'>): Promise<{ id: number }> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }
    return response.json();
  }

  async getOrder(id: number): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.statusText}`);
    }
    return response.json();
  }

  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    return response.json();
  }
}

export const restApi = new RestApiClient();

