import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Edit, Delete, Add, Refresh } from '@mui/icons-material';
import { restApi } from '@/api/rest';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '@/api/graphql';
import { Product, ProductSpec } from '@/types/models';

export function ProductsComponent() {
  const [restProducts, setRestProducts] = useState<Product[]>([]);
  const [loadingRest, setLoadingRest] = useState(false);
  const [errorRest, setErrorRest] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: '',
    inStock: true,
    specifications: [] as ProductSpec[],
  });
  const { data: graphqlData, loading: loadingGraphQL, error: errorGraphQL, refetch: refetchGraphQL } = useQuery(GET_PRODUCTS);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoadingRest(true);
    setErrorRest(null);
    try {
      const products = await restApi.getProducts();
      setRestProducts(products);
    } catch (err) {
      setErrorRest(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoadingRest(false);
    }
  };

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
    setLoadingRest(true);
    setErrorRest(null);
    try {
      if (editingProduct) {
        await restApi.updateProduct(editingProduct.id, formData);
      } else {
        await restApi.createProduct(formData);
      }
      handleCloseDialog();
      fetchProducts();
    } catch (err) {
      setErrorRest(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setLoadingRest(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    setLoadingRest(true);
    setErrorRest(null);
    try {
      await restApi.deleteProduct(id);
      fetchProducts();
    } catch (err) {
      setErrorRest(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setLoadingRest(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Products</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenCreate}
          disabled={loadingRest}
        >
          Create Product
        </Button>
      </Box>

      {errorRest && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorRest(null)}>
          {errorRest}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">REST API Products</Typography>
                <IconButton onClick={fetchProducts} disabled={loadingRest} size="small">
                  <Refresh />
                </IconButton>
              </Box>
              {loadingRest && !restProducts.length ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {restProducts.map((product) => (
                        <TableRow key={product.id}>
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
                              disabled={loadingRest}
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(product.id)}
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">GraphQL Products</Typography>
                <IconButton onClick={() => refetchGraphQL()} disabled={loadingGraphQL} size="small">
                  <Refresh />
                </IconButton>
              </Box>
              {errorGraphQL && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorGraphQL.message}
                </Alert>
              )}
              {loadingGraphQL ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Stock</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {graphqlData?.products?.map((product: Product) => (
                        <TableRow key={product.id}>
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
          <Button onClick={handleSave} variant="contained" disabled={loadingRest}>
            {loadingRest ? 'Saving...' : editingProduct ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
