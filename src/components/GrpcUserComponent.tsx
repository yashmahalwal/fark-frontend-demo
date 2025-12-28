import { useState } from 'react';
import { grpcApi } from '@/api/grpc';
import { User } from '@/types/models';

export function GrpcUserComponent() {
  const [userId, setUserId] = useState<string>('1');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedUser = await grpcApi.getUser(parseInt(userId));
      setUser(fetchedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h2>gRPC API - User</h2>
      <div>
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID"
        />
        <button onClick={fetchUser} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch User'}
        </button>
      </div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {user && (
        <div style={{ marginTop: '10px' }}>
          <h3>User Details:</h3>
          <p>ID: {user.id}</p>
          <p>Email: {user.email}</p>
          <p>Name: {user.name}</p>
          <p>Status: {user.status}</p>
          <p>Description: {user.description || 'N/A'}</p>
          <p>Tags: {user.tags.join(', ')}</p>
          <p>Payment Method: {user.paymentMethod}</p>
        </div>
      )}
    </div>
  );
}

