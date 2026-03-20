import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMyOrders } from '../redux/slices/orderSlice'
import Loader from '../components/Loader'
import {
  FiPackage,
  FiShoppingBag,
  FiClock,
  FiCheck,
  FiTruck,
  FiX,
} from 'react-icons/fi'

const Orders = () => {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { orders, loading } = useSelector((state) => state.orders)

  useEffect(() => {
    dispatch(getMyOrders())
  }, [dispatch])

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'bg-yellow-100 text-yellow-700'
      case 'shipped':    return 'bg-blue-100   text-blue-700'
      case 'delivered':  return 'bg-green-100  text-green-700'
      case 'cancelled':  return 'bg-red-100    text-red-700'
      default:           return 'bg-gray-100   text-gray-700'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing': return <FiClock  size={14} />
      case 'shipped':    return <FiTruck  size={14} />
      case 'delivered':  return <FiCheck  size={14} />
      case 'cancelled':  return <FiX      size={14} />
      default:           return <FiPackage size={14} />
    }
  }

  const getPaymentColor = (status) => {
    switch (status) {
      case 'paid':    return 'text-green-600'
      case 'pending': return 'text-yellow-600'
      case 'failed':  return 'text-red-600'
      default:        return 'text-gray-600'
    }
  }

  if (loading) return <Loader />

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
        <p className="text-gray-500 text-sm mt-1">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
        </p>
      </div>

      {orders.length === 0 ? (
        /* Empty Orders */
        <div className="text-center py-20">
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiPackage size={40} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No orders yet!
          </h2>
          <p className="text-gray-500 mb-6">
            Start shopping to see your orders here
          </p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-2xl transition-colors inline-flex items-center gap-2"
          >
            <FiShoppingBag size={18} />
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Order ID</p>
                  <p className="font-mono text-sm font-medium text-gray-700">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Placed On</p>
                  <p className="text-sm text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Payment</p>
                  <p className={`text-sm font-medium capitalize ${getPaymentColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </p>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium capitalize ${getStatusColor(order.orderStatus)}`}>
                    {getStatusIcon(order.orderStatus)}
                    {order.orderStatus}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">Total</p>
                  <p className="text-lg font-bold text-blue-600">
                    ${order.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4"
                  >
                    <div className="bg-gray-50 rounded-xl w-14 h-14 flex items-center justify-center shrink-0">
                      {item.product?.images?.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product?.name}
                          className="w-12 h-12 object-contain"
                        />
                      ) : (
                        <FiShoppingBag size={24} className="text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {item.product?.name || 'Product'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} × ${item.price}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Shipping Address</p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.street}, {order.shippingAddress.city},
                  {order.shippingAddress.state}, {order.shippingAddress.country} -
                  {order.shippingAddress.zip}
                </p>
              </div>

              {/* Order Timeline */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  {['processing', 'shipped', 'delivered'].map((status, i) => (
                    <div key={status} className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        order.orderStatus === 'cancelled'
                          ? 'bg-gray-100 text-gray-400'
                          : ['processing', 'shipped', 'delivered'].indexOf(order.orderStatus) >= i
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-400'
                      }`}>
                        {i + 1}
                      </div>
                      <span className="text-xs text-gray-500 capitalize">{status}</span>
                      {i < 2 && (
                        <div className={`h-0.5 w-8 ${
                          ['processing', 'shipped', 'delivered'].indexOf(order.orderStatus) > i
                            ? 'bg-blue-600'
                            : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                  {order.orderStatus === 'cancelled' && (
                    <span className="text-xs text-red-500 font-medium ml-2">
                      Order Cancelled
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
