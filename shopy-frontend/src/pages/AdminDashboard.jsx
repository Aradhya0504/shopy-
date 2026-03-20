import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getAllOrders, updateOrderStatus } from '../redux/slices/orderSlice'
import api from '../services/api'
import Loader from '../components/Loader'
import {
  FiUsers,
  FiPackage,
  FiShoppingBag,
  FiDollarSign,
  FiEdit2,
  FiCheck,
  FiX,
  FiTrendingUp,
} from 'react-icons/fi'

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const { orders, loading } = useSelector((state) => state.orders)

  const [stats,        setStats]        = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [activeTab,    setActiveTab]    = useState('overview')
  const [users,        setUsers]        = useState([])
  const [editingOrder, setEditingOrder] = useState(null)
  const [newStatus,    setNewStatus]    = useState('')

  useEffect(() => {
    fetchStats()
    dispatch(getAllOrders())
  }, [dispatch])

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats')
      setStats(data)
      setUsers(data.recentUsers || [])
    } catch (error) {
      toast.error('Failed to load stats')
    } finally {
      setStatsLoading(false)
    }
  }

  const fetchAllUsers = async () => {
    try {
      const { data } = await api.get('/admin/users')
      setUsers(data)
    } catch (error) {
      toast.error('Failed to load users')
    }
  }

  useEffect(() => {
    if (activeTab === 'users') fetchAllUsers()
  }, [activeTab])

  const handleUpdateOrderStatus = async (orderId) => {
    if (!newStatus) return
    try {
      await dispatch(updateOrderStatus({
        id: orderId,
        orderData: { orderStatus: newStatus }
      })).unwrap()
      toast.success('Order status updated!')
      setEditingOrder(null)
      setNewStatus('')
    } catch (error) {
      toast.error(error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'bg-yellow-100 text-yellow-700'
      case 'shipped':    return 'bg-blue-100   text-blue-700'
      case 'delivered':  return 'bg-green-100  text-green-700'
      case 'cancelled':  return 'bg-red-100    text-red-700'
      default:           return 'bg-gray-100   text-gray-700'
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':    return 'bg-purple-100 text-purple-700'
      case 'seller':   return 'bg-blue-100   text-blue-700'
      default:         return 'bg-green-100  text-green-700'
    }
  }

  if (statsLoading) return <Loader />

  const statCards = [
    {
      title:  'Total Users',
      value:  stats?.totalUsers      || 0,
      icon:   <FiUsers      size={24} />,
      color:  'bg-blue-500',
      light:  'bg-blue-50 text-blue-600',
    },
    {
      title:  'Total Products',
      value:  stats?.totalProducts   || 0,
      icon:   <FiShoppingBag size={24} />,
      color:  'bg-green-500',
      light:  'bg-green-50 text-green-600',
    },
    {
      title:  'Total Orders',
      value:  stats?.totalOrders     || 0,
      icon:   <FiPackage    size={24} />,
      color:  'bg-purple-500',
      light:  'bg-purple-50 text-purple-600',
    },
    {
      title:  'Total Revenue',
      value:  `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`,
      icon:   <FiDollarSign size={24} />,
      color:  'bg-yellow-500',
      light:  'bg-yellow-50 text-yellow-600',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your store from one place
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {['overview', 'orders', 'users'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ───────────────────────────────── */}
      {activeTab === 'overview' && (
        <div>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
              >
                <div className={`${card.light} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
                  {card.icon}
                </div>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                <p className="text-sm text-gray-500 mt-1">{card.title}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <FiTrendingUp size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Order ID</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Customer</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Total</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Status</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders?.map((order) => (
                    <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-2 font-mono text-gray-600">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3 px-2 text-gray-700">
                        {order.user?.name || 'Unknown'}
                      </td>
                      <td className="py-3 px-2 font-semibold text-gray-800">
                        ${order.totalPrice?.toFixed(2)}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <FiUsers size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">Recent Users</h2>
            </div>
            <div className="space-y-3">
              {stats?.recentUsers?.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50"
                >
                  <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Orders Tab ─────────────────────────────────── */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">All Orders</h2>
          {loading ? <Loader /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Order ID</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Customer</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Total</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Payment</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Status</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-2 font-mono text-gray-600">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3 px-2 text-gray-700">
                        {order.user?.name || 'Unknown'}
                      </td>
                      <td className="py-3 px-2 font-semibold">
                        ${order.totalPrice?.toFixed(2)}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-xs font-medium capitalize ${
                          order.paymentStatus === 'paid'
                            ? 'text-green-600'
                            : 'text-yellow-600'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        {editingOrder === order._id ? (
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                          >
                            <option value="">Select</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        {editingOrder === order._id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateOrderStatus(order._id)}
                              className="text-green-600 hover:text-green-700 p-1"
                            >
                              <FiCheck size={16} />
                            </button>
                            <button
                              onClick={() => { setEditingOrder(null); setNewStatus('') }}
                              className="text-red-500 hover:text-red-600 p-1"
                            >
                              <FiX size={16} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingOrder(order._id)
                              setNewStatus(order.orderStatus)
                            }}
                            className="text-blue-600 hover:text-blue-700 p-1"
                          >
                            <FiEdit2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Users Tab ──────────────────────────────────── */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">All Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">User</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Email</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Role</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-600">{user.email}</td>
                    <td className="py-3 px-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-xs font-medium ${user.isActive ? 'text-green-600' : 'text-red-500'}`}>
                        {user.isActive ? '● Active' : '● Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard