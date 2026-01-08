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
import { Order, OrderStatus, Address } from '@/types/models';
import { useRefresh } from '@/contexts/RefreshContext';

export function RestOrdersComponent() {
  const queryClient = useQueryClient();
  const { refreshOrders } = useRefresh();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    userId: 1,
    productIds: [] as number[],
    status: OrderStatus.CREATED,
    total: 0,
    discountCode: '',
    shippingAddress: {
      street: '',
      city: '',
      zipCode: '',
      country: '',
    } as Address,
  });

  const { data: orders = [], isLoading, error, refetch } = useQuery({
    queryKey: ['orders', 'rest'],
    queryFn: () => restApi.getOrders(),
  });

  const createMutation = useMutation({
    mutationFn: (order: Omit<Order, 'id'>) => restApi.createOrder(order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'rest'] });
      refreshOrders();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, order }: { id: number; order: Omit<Order, 'id'> }) => restApi.updateOrder(id, order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'rest'] });
      refreshOrders();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => restApi.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'rest'] });
      refreshOrders();
    },
  });

  const handleOpenCreate = () => {
    setEditingOrder(null);
    setFormData({
      userId: 1,
      productIds: [],
      status: OrderStatus.CREATED,
      total: 0,
      discountCode: '',
      shippingAddress: { street: '', city: '', zipCode: '', country: '' },
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      userId: order.userId,
      productIds: order.productIds,
      status: order.status,
      total: order.total,
      discountCode: order.discountCode || '',
      shippingAddress: order.shippingAddress,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingOrder(null);
  };

  const handleSave = async () => {
    if (editingOrder) {
      updateMutation.mutate({ id: editingOrder.id, order: formData });
    } else {
      createMutation.mutate(formData);
    }
    handleCloseDialog();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    deleteMutation.mutate(id);
  };

  const isLoadingAny = isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <Card elevation={2}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Orders - REST API</Typography>
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
              Create Order
            </Button>
          </Box>
        </Box>

        {(error || createMutation.error || updateMutation.error || deleteMutation.error) && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => {}}>
            {(error as Error)?.message || createMutation.error?.message || updateMutation.error?.message || deleteMutation.error?.message}
          </Alert>
        )}

        {isLoading && !orders.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>User ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Product IDs</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Shipping Address</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.userId}</TableCell>
                    <TableCell>
                      <Chip label={order.status} size="small" />
                    </TableCell>
                    <TableCell>${order.total}</TableCell>
                    <TableCell>{order.productIds.join(', ')}</TableCell>
                    <TableCell>
                      {order.shippingAddress.street}, {order.shippingAddress.city}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEdit(order)}
                        disabled={isLoadingAny}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(order.id)}
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
          <DialogTitle>{editingOrder ? 'Edit Order' : 'Create Order'}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="User ID"
                type="number"
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: parseInt(e.target.value) || 1 })}
                fullWidth
                required
              />
              <TextField
                label="Product IDs (comma-separated)"
                value={formData.productIds.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  productIds: e.target.value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
                })}
                fullWidth
                required
                placeholder="1, 2, 3"
              />
              <TextField
                select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as OrderStatus })}
                fullWidth
                required
              >
                {Object.values(OrderStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Total"
                type="number"
                value={formData.total}
                onChange={(e) => setFormData({ ...formData, total: parseFloat(e.target.value) || 0 })}
                fullWidth
                required
              />
              <TextField
                label="Discount Code"
                value={formData.discountCode}
                onChange={(e) => setFormData({ ...formData, discountCode: e.target.value })}
                fullWidth
              />
              <TextField
                label="Street"
                value={formData.shippingAddress.street}
                onChange={(e) => setFormData({
                  ...formData,
                  shippingAddress: { ...formData.shippingAddress, street: e.target.value }
                })}
                fullWidth
              />
              <TextField
                label="City"
                value={formData.shippingAddress.city}
                onChange={(e) => setFormData({
                  ...formData,
                  shippingAddress: { ...formData.shippingAddress, city: e.target.value }
                })}
                fullWidth
              />
              <TextField
                label="Zip Code"
                value={formData.shippingAddress.zipCode}
                onChange={(e) => setFormData({
                  ...formData,
                  shippingAddress: { ...formData.shippingAddress, zipCode: e.target.value }
                })}
                fullWidth
              />
              <TextField
                label="Country"
                value={formData.shippingAddress.country}
                onChange={(e) => setFormData({
                  ...formData,
                  shippingAddress: { ...formData.shippingAddress, country: e.target.value }
                })}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" disabled={isLoadingAny}>
              {isLoadingAny ? 'Saving...' : editingOrder ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Card>
  );
}




