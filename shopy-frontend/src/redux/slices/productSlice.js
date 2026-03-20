import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ── Get All Products ──────────────────────────────────
export const getProducts = createAsyncThunk(
  'products/getAll',
  async (params, thunkAPI) => {
    try {
      const { data } = await api.get('/products', { params });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to get products'
      );
    }
  }
);

// ── Get Single Product ────────────────────────────────
export const getProductById = createAsyncThunk(
  'products/getById',
  async (id, thunkAPI) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to get product'
      );
    }
  }
);

// ── Create Product ────────────────────────────────────
export const createProduct = createAsyncThunk(
  'products/create',
  async (productData, thunkAPI) => {
    try {
      const { data } = await api.post('/products', productData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to create product'
      );
    }
  }
);

// ── Update Product ────────────────────────────────────
export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, productData }, thunkAPI) => {
    try {
      const { data } = await api.put(`/products/${id}`, productData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update product'
      );
    }
  }
);

// ── Delete Product ────────────────────────────────────
export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to delete product'
      );
    }
  }
);

// ── Add Review ────────────────────────────────────────
export const addReview = createAsyncThunk(
  'products/addReview',
  async ({ productId, reviewData }, thunkAPI) => {
    try {
      const { data } = await api.post(`/reviews/${productId}`, reviewData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to add review'
      );
    }
  }
);

// ── Product Slice ─────────────────────────────────────
const productSlice = createSlice({
  name: 'products',
  initialState: {
    products:       [],
    product:        null,
    count:          0,
    loading:        false,
    error:          null,
    success:        false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearProduct: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Products
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading  = false;
        state.products = action.payload.products;
        state.count    = action.payload.count;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })
      // Get Single Product
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading  = false;
        state.success  = true;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })
      // Update Product
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading  = false;
        state.success  = true;
        const index    = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      // Delete Product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading  = false;
        state.success  = true;
        state.products = state.products.filter(
          (p) => p._id !== action.payload
        );
      })
      // Add Review
      .addCase(addReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(addReview.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });
  },
});

export const { clearError, clearSuccess, clearProduct } = productSlice.actions;
export default productSlice.reducer;