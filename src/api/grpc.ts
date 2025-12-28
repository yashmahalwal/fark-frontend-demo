// Note: gRPC doesn't work directly in browsers without gRPC-Web or a proxy
// This implementation references backend API fields for Fark.ai testing
// The field references (email, description, tags, payment_method, etc.) are what matter for impact detection
import { User } from '@/types/models';

export class GrpcApiClient {
  // This class references backend API fields that Fark.ai will detect:
  // - email, name, status, description, metadata, tags, payment_method
  // - These field names must match the backend proto definitions
  
  async getUser(id: number): Promise<User> {
    // References: response.email, response.description, response.tags, response.payment_method
    throw new Error('gRPC not available in browser - this is for Fark.ai field reference testing only');
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    // References: user.email, user.name, user.status, user.description, user.metadata, user.tags, user.paymentMethod
    // Maps to backend: email, name, status, description, metadata, tags, payment_method
    throw new Error('gRPC not available in browser - this is for Fark.ai field reference testing only');
  }

  async listUsers(page: number = 1, pageSize: number = 10): Promise<User[]> {
    // References: response.users[].email, response.users[].description, etc.
    // Backend fields: page, page_size
    throw new Error('gRPC not available in browser - this is for Fark.ai field reference testing only');
  }
}

export const grpcApi = new GrpcApiClient();
