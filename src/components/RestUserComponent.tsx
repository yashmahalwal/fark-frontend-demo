import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  Card,
} from '@mui/material';
import { Edit, Delete, Add, Refresh } from '@mui/icons-material';
import { restApi } from '@/api/rest';
import { User, UserStatus, PaymentMethod } from '@/types/models';
import { useRefresh } from '@/contexts/RefreshContext';

export function RestUserComponent() {
  const queryClient = useQueryClient();
  const { refreshUsers } = useRefresh();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    status: UserStatus.ACTIVE,
    description: '',
    tags: '',
    paymentMethod: 'CREDIT_CARD' as PaymentMethod,
  });

  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ['users', 'rest'],
    queryFn: () => restApi.getUsers(),
  });

  const createMutation = useMutation({
    mutationFn: (user: Omit<User, 'id'>) => restApi.createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'rest'] });
      refreshUsers(); // Trigger GraphQL refresh
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, user }: { id: number; user: Omit<User, 'id'> }) => restApi.updateUser(id, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'rest'] });
      refreshUsers(); // Trigger GraphQL refresh
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => restApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'rest'] });
      refreshUsers(); // Trigger GraphQL refresh
    },
  });

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      name: '',
      status: UserStatus.ACTIVE,
      description: '',
      tags: '',
      paymentMethod: 'CREDIT_CARD' as PaymentMethod,
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      name: user.name,
      status: user.status,
      description: user.description || '',
      tags: user.tags.join(', '),
      paymentMethod: user.paymentMethod,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  const handleSave = async () => {
    const userData = {
      email: formData.email,
      name: formData.name,
      status: formData.status,
      description: formData.description || null,
      metadata: {},
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      paymentMethod: formData.paymentMethod,
    };

    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, user: userData });
    } else {
      createMutation.mutate(userData);
    }
    handleCloseDialog();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    deleteMutation.mutate(id);
  };

  const isLoadingAny = isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <Card elevation={2}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Users - REST API</Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => refetch()}
              disabled={isLoadingAny}
              sx={{ mr: 1 }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenCreate}
              disabled={isLoadingAny}
            >
              Create User
            </Button>
          </Box>
        </Box>

        {(error || createMutation.error || updateMutation.error || deleteMutation.error) && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => {}}>
            {(error as Error)?.message || createMutation.error?.message || updateMutation.error?.message || deleteMutation.error?.message}
          </Alert>
        )}

        {isLoading && !users.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Payment Method</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tags</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={
                          user.status === UserStatus.ACTIVE
                            ? 'success'
                            : user.status === UserStatus.INACTIVE
                            ? 'default'
                            : 'warning'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{user.paymentMethod}</TableCell>
                    <TableCell>{user.tags.join(', ') || 'None'}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEdit(user)}
                        disabled={isLoadingAny}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(user.id)}
                        disabled={isLoadingAny}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{editingUser ? 'Edit User' : 'Create User'}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
              />
              <TextField
                select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                fullWidth
                required
              >
                {Object.values(UserStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                multiline
                rows={2}
              />
              <TextField
                label="Tags (comma-separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                fullWidth
                placeholder="tag1, tag2, tag3"
              />
              <TextField
                select
                label="Payment Method"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                fullWidth
                required
              >
                <MenuItem value="CREDIT_CARD">CREDIT_CARD</MenuItem>
                <MenuItem value="DEBIT_CARD">DEBIT_CARD</MenuItem>
                <MenuItem value="PAYPAL">PAYPAL</MenuItem>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" disabled={isLoadingAny}>
              {isLoadingAny ? 'Saving...' : editingUser ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Card>
  );
}
