import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Card,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  AlertTitle,
} from '@mui/material';
import { Refresh, Edit, Delete, Add } from '@mui/icons-material';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCTS, CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT } from '@/api/graphql';
import { Product } from '@/types/models';
import { useRefresh } from '@/contexts/RefreshContext';

export function GraphQLProductsComponent() {
  const { registerProductsRefresh } = useRefresh();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: '',
    inStock: true,
    specifications: [] as any[],
  });

  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS);
  const [createProduct, { loading: creating, error: createError }] = useMutation(CREATE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  });
  const [updateProduct, { loading: updating, error: updateError }] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  });
  const [deleteProductMutation, { loading: deleting, error: deleteError }] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  });

  useEffect(() => {
    registerProductsRefresh(() => {
      refetch();
    });
  }, [registerProductsRefresh, refetch]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: 0,
      category: '',
      inStock: true,
      specifications: [],
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      inStock: product.inStock,
      specifications: product.specifications,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
  };

  const handleSave = async () => {
    try {
      const variables = {
        ...(editingProduct && { id: editingProduct.id }),
        name: formData.name,
        price: formData.price,
        category: formData.category,
        inStock: formData.inStock,
        specifications: formData.specifications,
      };

      if (editingProduct) {
        await updateProduct({ variables });
      } else {
        await createProduct({ variables });
      }
      handleCloseDialog();
    } catch (err: any) {
      console.error('Failed to save product:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await deleteProductMutation({ variables: { id } });
    } catch (err: any) {
      console.error('Failed to delete product:', err);
    }
  };

  const products = data?.products || [];
  const isLoading = loading || creating || updating || deleting;
  const mutationError = createError || updateError || deleteError;

  return (
    <Card elevation={2}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Products - GraphQL API</Typography>
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
              Create Product
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

        {loading && !products.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Stock</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product: Product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <Chip
                        label={product.inStock ? 'In Stock' : 'Out of Stock'}
                        color={product.inStock ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEdit(product)}
                        disabled={isLoading}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(product.id.toString())}
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
          <DialogTitle>{editingProduct ? 'Edit Product' : 'Create Product'}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                fullWidth
                required
              />
              <TextField
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                fullWidth
                required
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  />
                }
                label="In Stock"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" disabled={isLoading}>
              {isLoading ? 'Saving...' : editingProduct ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Card>
  );
}
