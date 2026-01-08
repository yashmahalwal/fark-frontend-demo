import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
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
} from '@mui/material';
import { Refresh, Edit, Delete, Add } from '@mui/icons-material';
import { restApi } from '@/api/rest';
import { useQuery } from '@apollo/client';
import { GET_ORDER } from '@/api/graphql';
import { Order, OrderStatus, Address } from '@/types/models';

export function OrderComponent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingRest, setLoadingRest] = useState(false);
  const [errorRest, setErrorRest] = useState<string | null>(null);
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
  const [orderId, setOrderId] = useState<string>('1');
  const { data: graphqlData, loading: loadingGraphQL, error: errorGraphQL, refetch: refetchGraphQL } = useQuery(GET_ORDER, {
    variables: { id: orderId },
    skip: !orderId,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoadingRest(true);
    setErrorRest(null);
    try {
      const fetchedOrders = await restApi.getOrders();
      setOrders(fetchedOrders);
    } catch (err) {
      setErrorRest(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoadingRest(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingOrder(null);
    setFormData({
      userId: 1,
      productIds: [],
      status: OrderStatus.CREATED,
      total: 0,
      discountCode: '',
      shippingAddress: {
        street: '',
        city: '',
        zipCode: '',
        country: '',
      },
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
    setLoadingRest(true);
    setErrorRest(null);
    try {
      if (editingOrder) {
        await restApi.updateOrder(editingOrder.id, formData);
      } else {
        await restApi.createOrder(formData);
      }
      handleCloseDialog();
      fetchOrders();
    } catch (err) {
      setErrorRest(err instanceof Error ? err.message : 'Failed to save order');
    } finally {
      setLoadingRest(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    
    setLoadingRest(true);
    setErrorRest(null);
    try {
      await restApi.deleteOrder(id);
      fetchOrders();
    } catch (err) {
      setErrorRest(err instanceof Error ? err.message : 'Failed to delete order');
    } finally {
      setLoadingRest(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Orders</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenCreate}
          disabled={loadingRest}
        >
          Create Order
        </Button>
      </Box>

      {errorRest && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorRest(null)}>
          {errorRest}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">REST API Orders</Typography>
                <IconButton onClick={fetchOrders} disabled={loadingRest} size="small">
                  <Refresh />
                </IconButton>
              </Box>
              {loadingRest && !orders.length ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>User ID</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Product IDs</TableCell>
                        <TableCell>Shipping Address</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
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
                              disabled={loadingRest}
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(order.id)}
                              disabled={loadingRest}
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
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Order ID"
                  type="number"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  size="small"
                />
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={() => refetchGraphQL()}
                  disabled={loadingGraphQL}
                >
                  Fetch GraphQL
                </Button>
              </Box>
              <Typography variant="h6" gutterBottom>GraphQL Order</Typography>
              {errorGraphQL && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorGraphQL.message}
                </Alert>
              )}
              {loadingGraphQL ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : graphqlData?.order ? (
                <Box>
                  <Typography><strong>ID:</strong> {graphqlData.order.id}</Typography>
                  <Typography><strong>User ID:</strong> {graphqlData.order.userId}</Typography>
                  <Typography><strong>Status:</strong>
                    <Chip label={graphqlData.order.status} size="small" sx={{ ml: 1 }} />
                  </Typography>
                  <Typography><strong>Total:</strong> ${graphqlData.order.total}</Typography>
                  <Typography><strong>Product IDs:</strong> {graphqlData.order.productIds.join(', ')}</Typography>
                  <Typography><strong>Shipping Address:</strong> {graphqlData.order.shippingAddress.street}, {graphqlData.order.shippingAddress.city}, {graphqlData.order.shippingAddress.zipCode}</Typography>
                </Box>
              ) : (
                <Typography color="text.secondary">No order data</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
          <Button onClick={handleSave} variant="contained" disabled={loadingRest}>
            {loadingRest ? 'Saving...' : editingOrder ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
