import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ── Get Cart ──────────────────────────────────────────
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get('/cart');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to get cart'
      );
    }
  }
);

// ── Add to Cart ───────────────────────────────────────
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (cartData, thunkAPI) => {
    try {
      const { data } = await api.post('/cart', cartData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to add to cart'
      );
    }
  }
);

// ── Update Cart Item ──────────────────────────────────
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, thunkAPI) => {
    try {
      const { data } = await api.put(`/cart/${itemId}`, { quantity });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update cart'
      );
    }
  }
);

// ── Remove from Cart ──────────────────────────────────
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, thunkAPI) => {
    try {
      const { data } = await api.delete(`/cart/${itemId}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to remove from cart'
      );
    }
  }
);

// ── Clear Cart ────────────────────────────────────────
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, thunkAPI) => {
    try {
      const { data } = await api.delete('/cart');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to clear cart'
      );
    }
  }
);

// ── Cart Slice ────────────────────────────────────────
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items:      [],
    totalPrice: 0,
    loading:    false,
    error:      null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Cart
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading    = false;
        state.items      = action.payload.items      || [];
        state.totalPrice = action.payload.totalPrice || 0;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading    = false;
        state.items      = action.payload.items      || [];
        state.totalPrice = action.payload.totalPrice || 0;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })
      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading    = false;
        state.items      = action.payload.items      || [];
        state.totalPrice = action.payload.totalPrice || 0;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading    = false;
        state.items      = action.payload.items      || [];
        state.totalPrice = action.payload.totalPrice || 0;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })
      // Clear Cart
      .addCase(clearCart.fulfilled, (state) => {
        state.loading    = false;
        state.items      = [];
        state.totalPrice = 0;
      });
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;
