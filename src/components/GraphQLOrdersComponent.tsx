import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CircularProgress,
  Alert,
  Chip,
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
  AlertTitle,
} from '@mui/material';
import { Refresh, Edit, Delete, Add } from '@mui/icons-material';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ORDERS, CREATE_ORDER, UPDATE_ORDER, DELETE_ORDER } from '@/api/graphql';
import { OrderStatus, Address } from '@/types/models';
import { useRefresh } from '@/contexts/RefreshContext';

export function GraphQLOrdersComponent() {
  const { registerOrdersRefresh } = useRefresh();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    userId: '1',
    productIds: [] as string[],
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

  const { data, loading, error, refetch } = useQuery(GET_ORDERS);
  const [createOrder, { loading: creating, error: createError }] = useMutation(CREATE_ORDER, {
    refetchQueries: [{ query: GET_ORDERS }],
  });
  const [updateOrder, { loading: updating, error: updateError }] = useMutation(UPDATE_ORDER, {
    refetchQueries: [{ query: GET_ORDERS }],
  });
  const [deleteOrderMutation, { loading: deleting, error: deleteError }] = useMutation(DELETE_ORDER, {
    refetchQueries: [{ query: GET_ORDERS }],
  });

  useEffect(() => {
    registerOrdersRefresh(() => {
      refetch();
    });
  }, [registerOrdersRefresh, refetch]);

  const handleOpenCreate = () => {
    setEditingOrder(null);
    setFormData({
      userId: '1',
      productIds: [],
      status: OrderStatus.CREATED,
      total: 0,
      discountCode: '',
      shippingAddress: { street: '', city: '', zipCode: '', country: '' },
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (order: any) => {
    setEditingOrder(order);
    setFormData({
      userId: order.userId.toString(),
      productIds: order.productIds.map((id: any) => id.toString()),
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
    try {
      const variables = {
        ...(editingOrder && { id: editingOrder.id }),
        userId: formData.userId,
        productIds: formData.productIds,
        status: formData.status,
        total: formData.total,
        discountCode: formData.discountCode || undefined,
        shippingAddress: formData.shippingAddress,
      };

      if (editingOrder) {
        await updateOrder({ variables });
      } else {
        await createOrder({ variables });
      }
      handleCloseDialog();
    } catch (err: any) {
      console.error('Failed to save order:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    
    try {
      await deleteOrderMutation({ variables: { id } });
    } catch (err: any) {
      console.error('Failed to delete order:', err);
    }
  };

  const orders = data?.orders || [];
  const isLoading = loading || creating || updating || deleting;
  const mutationError = createError || updateError || deleteError;

  return (
    <Card elevation={2}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Orders - GraphQL API</Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => refetch()}
              disabled={isLoading}
              sx={{ mr: 1 }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenCreate}
              disabled={isLoading}
            >
              Create Order
            </Button>
          </Box>
        </Box>

        {(error || mutationError) && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => {}}>
            <AlertTitle>GraphQL Error</AlertTitle>
            <Box component="div">
              {(error || mutationError)?.message}
              {((error || mutationError)?.graphQLErrors && (error || mutationError)?.graphQLErrors.length > 0) && (
                <Box sx={{ mt: 1 }}>
                  {(error || mutationError)?.graphQLErrors.map((err: any, idx: number) => (
                    <Box key={idx} sx={{ mt: 0.5 }}>
                      • {err.message}
                      {err.extensions && err.extensions.code && (
                        <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                          ({err.extensions.code})
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
              {((error || mutationError)?.networkError) && (
                <Box sx={{ mt: 1 }}>
                  <strong>Network Error:</strong> {(error || mutationError)?.networkError.message}
                </Box>
              )}
            </Box>
          </Alert>
        )}

        {loading && !orders.length ? (
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
                {orders.map((order: any) => (
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
                        disabled={isLoading}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(order.id)}
                        disabled={isLoading}
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
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Product IDs (comma-separated)"
                value={formData.productIds.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  productIds: e.target.value.split(',').map(id => id.trim()).filter(id => id)
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
            <Button onClick={handleSave} variant="contained" disabled={isLoading}>
              {isLoading ? 'Saving...' : editingOrder ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Card>
  );
}
