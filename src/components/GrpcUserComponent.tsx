import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
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
    <Card elevation={2}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Users - gRPC API</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="User ID"
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            size="small"
          />
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchUser}
            disabled={loading}
          >
            Fetch User
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : user ? (
          <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>User Details</Typography>
            <Typography><strong>ID:</strong> {user.id}</Typography>
            <Typography><strong>Email:</strong> {user.email}</Typography>
            <Typography><strong>Name:</strong> {user.name}</Typography>
            <Typography><strong>Status:</strong> {user.status}</Typography>
            <Typography><strong>Description:</strong> {user.description || 'N/A'}</Typography>
            <Typography><strong>Tags:</strong> {user.tags.join(', ') || 'None'}</Typography>
            <Typography><strong>Payment Method:</strong> {user.paymentMethod}</Typography>
          </Box>
        ) : (
          <Typography color="text.secondary">Enter a user ID and click Fetch User</Typography>
        )}

        <Alert severity="info" sx={{ mt: 3 }}>
          Note: gRPC client is mocked for browser compatibility. This component references API fields for Fark.ai testing.
        </Alert>
      </Box>
    </Card>
  );
}
