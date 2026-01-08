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
      body: JSON.stringify({
        email: user.email,
        name: user.name,
        status: user.status, // UserStatus enum value (string)
        description: user.description,
        metadata: user.metadata,
        tags: user.tags,
        paymentMethod: user.paymentMethod, // PaymentMethod type (string)
      }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `Failed to create user: ${response.statusText}`);
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

  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    return response.json();
  }

  async updateUser(id: number, user: Omit<User, 'id'>): Promise<{ id: number; message: string }> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        name: user.name,
        status: user.status,
        description: user.description,
        metadata: user.metadata,
        tags: user.tags,
        paymentMethod: user.paymentMethod,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `Failed to update user: ${response.statusText}`);
    }
    return response.json();
  }

  async deleteUser(id: number): Promise<{ id: number; message: string }> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `Failed to delete user: ${response.statusText}`);
    }
    return response.json();
  }

  // Orders CRUD
  async getOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders`);
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }
    return response.json();
  }

  async createOrder(order: Omit<Order, 'id'>): Promise<{ id: number }> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: order.userId,
        productIds: order.productIds,
        status: order.status,
        total: order.total,
        discountCode: order.discountCode,
        shippingAddress: order.shippingAddress,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `Failed to create order: ${response.statusText}`);
    }
    return response.json();
  }

  async updateOrder(id: number, order: Omit<Order, 'id'>): Promise<{ id: number; message: string }> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: order.userId,
        productIds: order.productIds,
        status: order.status,
        total: order.total,
        discountCode: order.discountCode,
        shippingAddress: order.shippingAddress,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `Failed to update order: ${response.statusText}`);
    }
    return response.json();
  }

  async deleteOrder(id: number): Promise<{ id: number; message: string }> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `Failed to delete order: ${response.statusText}`);
    }
    return response.json();
  }

  // Products CRUD
  async createProduct(product: Omit<Product, 'id'>): Promise<{ id: number }> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: product.name,
        price: product.price,
        category: product.category,
        inStock: product.inStock,
        specifications: product.specifications,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `Failed to create product: ${response.statusText}`);
    }
    return response.json();
  }

  async updateProduct(id: number, product: Omit<Product, 'id'>): Promise<{ id: number; message: string }> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: product.name,
        price: product.price,
        category: product.category,
        inStock: product.inStock,
        specifications: product.specifications,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `Failed to update product: ${response.statusText}`);
    }
    return response.json();
  }

  async deleteProduct(id: number): Promise<{ id: number; message: string }> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `Failed to delete product: ${response.statusText}`);
    }
    return response.json();
  }
}

export const restApi = new RestApiClient();

