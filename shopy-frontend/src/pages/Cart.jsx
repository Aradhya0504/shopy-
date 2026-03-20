import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../redux/slices/cartSlice'
import Loader from '../components/Loader'
import {
  FiTrash2,
  FiShoppingBag,
  FiArrowLeft,
  FiShoppingCart,
} from 'react-icons/fi'

const Cart = () => {
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const { items, totalPrice, loading } = useSelector((state) => state.cart)

  useEffect(() => {
    dispatch(getCart())
  }, [dispatch])

  const handleQuantityChange = async (itemId, quantity) => {
    if (quantity < 1) return
    try {
      await dispatch(updateCartItem({ itemId, quantity })).unwrap()
    } catch (error) {
      toast.error(error)
    }
  }

  const handleRemove = async (itemId) => {
    try {
      await dispatch(removeFromCart(itemId)).unwrap()
      toast.success('Item removed from cart!')
    } catch (error) {
      toast.error(error)
    }
  }

  const handleClearCart = async () => {
    try {
      await dispatch(clearCart()).unwrap()
      toast.success('Cart cleared!')
    } catch (error) {
      toast.error(error)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
          <p className="text-gray-500 text-sm mt-1">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 text-sm transition-colors"
        >
          <FiArrowLeft size={16} />
          Continue Shopping
        </button>
      </div>

      {items.length === 0 ? (
        /* Empty Cart */
        <div className="text-center py-20">
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiShoppingCart size={40} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Your cart is empty!
          </h2>
          <p className="text-gray-500 mb-6">
            Add some products to get started
          </p>
          <Link
            to="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-2xl transition-colors inline-flex items-center gap-2"
          >
            <FiShoppingBag size={18} />
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Cart Items ─────────────────────────────── */}
          <div className="flex-1">
            {/* Clear Cart Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={handleClearCart}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm transition-colors"
              >
                <FiTrash2 size={16} />
                Clear Cart
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row items-center gap-4"
                >
                  {/* Product Image */}
                  <div className="bg-gray-50 rounded-xl w-24 h-24 flex items-center justify-center shrink-0">
                    {item.product?.images?.length > 0 ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product?.name}
                        className="w-20 h-20 object-contain"
                      />
                    ) : (
                      <FiShoppingCart size={32} className="text-gray-300" />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {item.product?.name}
                    </h3>
                    <p className="text-blue-600 font-bold text-lg">
                      ${item.price}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-gray-800 font-medium border-x border-gray-200 min-w-12 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-xl"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ── Order Summary ──────────────────────────── */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-20">
              <h2 className="text-lg font-bold text-gray-800 mb-5">
                Order Summary
              </h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">
                    {totalPrice > 50 ? 'FREE' : '$9.99'}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (10%)</span>
                  <span>${(totalPrice * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-blue-600 text-lg">
                    ${(totalPrice + (totalPrice > 50 ? 0 : 9.99) + totalPrice * 0.1).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Free Shipping Note */}
              {totalPrice < 50 && (
                <div className="bg-blue-50 rounded-xl p-3 mb-5 text-xs text-blue-600">
                  Add ${(50 - totalPrice).toFixed(2)} more for FREE shipping! 🚚
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
              >
                <FiShoppingBag size={20} />
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="block text-center text-sm text-gray-500 hover:text-blue-600 mt-4 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
