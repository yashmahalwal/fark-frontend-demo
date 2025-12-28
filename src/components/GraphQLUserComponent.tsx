import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { graphqlClient, GET_USER, GET_USERS, CREATE_USER } from '@/api/graphql';
import { UserStatus } from '@/types/models';

export function GraphQLUserComponent() {
  const [userId, setUserId] = useState<string>('1');
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: userId },
    client: graphqlClient,
    skip: !userId,
  });

  const [createUser, { loading: creating }] = useMutation(CREATE_USER, {
    client: graphqlClient,
    refetchQueries: [{ query: GET_USERS }],
  });

  const handleCreateUser = async () => {
    try {
      await createUser({
        variables: {
          email: 'test@example.com',
          name: 'Test User',
          status: UserStatus.ACTIVE,
          description: 'Test description',
          metadata: { key: 'value' },
          tags: ['tag1', 'tag2'],
          paymentMethod: {
            __typename: 'CreditCard',
            type: 'Visa',
            last4: '1234',
          },
        },
      });
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h2>GraphQL API - User</h2>
      <div>
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID"
        />
      </div>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
      {data?.user && (
        <div style={{ marginTop: '10px' }}>
          <h3>User Details:</h3>
          <p>ID: {data.user.id}</p>
          <p>Email: {data.user.email}</p>
          <p>Name: {data.user.name}</p>
          <p>Status: {data.user.status}</p>
          <p>Description: {data.user.description || 'N/A'}</p>
          <p>Tags: {data.user.tags?.join(', ')}</p>
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleCreateUser} disabled={creating}>
          {creating ? 'Creating...' : 'Create Test User'}
        </button>
      </div>
    </div>
  );
}

