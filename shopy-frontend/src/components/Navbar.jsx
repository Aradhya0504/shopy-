import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { logout } from '../redux/slices/authSlice'
import {
  FiShoppingCart,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiSearch,
  FiPackage,
  FiSettings,
} from 'react-icons/fi'

const Navbar = () => {
  const dispatch        = useDispatch()
  const navigate        = useNavigate()
  const { user }        = useSelector((state) => state.auth)
  const { items }       = useSelector((state) => state.cart)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully!')
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/products?keyword=${searchTerm}`)
      setSearchTerm('')
      setMenuOpen(false) // close mobile menu after search
    }
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg">
              S
            </div>
            <span className="text-xl font-bold text-gray-800">Shopy</span>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
              >
                <FiSearch size={18} />
              </button>
            </div>
          </form>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/products"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              Products
            </Link>

            {/* Cart */}
            {user && (
              <Link to="/cart" className="relative">
                <FiShoppingCart
                  size={22}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {items.length}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {user ? (
              <div className="flex items-center gap-3">
                {/* Admin Link */}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
                  >
                    <FiSettings size={16} />
                    Admin
                  </Link>
                )}

                {/* Orders */}
                <Link
                  to="/orders"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <FiPackage size={20} />
                </Link>

                {/* Profile */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <FiUser size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">
                    {user.name?.split(' ')[0]}
                  </span>
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <FiLogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-600"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <FiSearch size={18} />
                </button>
              </div>
            </form>

            {/* Mobile Links */}
            <div className="flex flex-col gap-3">
              <Link
                to="/products"
                onClick={() => setMenuOpen(false)}
                className="text-gray-600 text-sm font-medium"
              >
                Products
              </Link>
              {user ? (
                <>
                  <Link
                    to="/cart"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-600 text-sm font-medium flex items-center gap-2"
                  >
                    <FiShoppingCart size={16} />
                    Cart {items.length > 0 && `(${items.length})`}
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-600 text-sm font-medium"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-600 text-sm font-medium"
                  >
                    Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="text-purple-600 text-sm font-medium"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false) }}
                    className="text-red-500 text-sm font-medium text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-600 text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="text-blue-600 text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
