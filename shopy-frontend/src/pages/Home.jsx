import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../redux/slices/productSlice'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import {
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiHeadphones,
  FiArrowRight,
  FiStar,
} from 'react-icons/fi'

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { products, loading } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch])

  const featuredProducts = products.slice(0, 8)

  const features = [
    {
      icon: <FiTruck size={28} />,
      title: 'Free Delivery',
      desc: 'Free shipping on orders over $50',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: <FiShield size={28} />,
      title: 'Secure Payment',
      desc: '100% secure payment guaranteed',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: <FiHeadphones size={28} />,
      title: '24/7 Support',
      desc: 'Dedicated support anytime',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: <FiStar size={28} />,
      title: 'Best Quality',
      desc: 'Top quality products only',
      color: 'bg-yellow-100 text-yellow-600',
    },
  ]

  const categories = [
    { name: 'Electronics',   emoji: '📱', color: 'bg-blue-50   border-blue-200' },
    { name: 'Clothing',      emoji: '👕', color: 'bg-pink-50   border-pink-200' },
    { name: 'Books',         emoji: '📚', color: 'bg-yellow-50 border-yellow-200' },
    { name: 'Sports',        emoji: '⚽', color: 'bg-green-50  border-green-200' },
    { name: 'Home & Kitchen',emoji: '🏠', color: 'bg-orange-50 border-orange-200' },
    { name: 'Gaming',        emoji: '🎮', color: 'bg-purple-50 border-purple-200' },
    { name: 'Beauty',        emoji: '💄', color: 'bg-red-50    border-red-200' },
    { name: 'Laptops',       emoji: '💻', color: 'bg-indigo-50 border-indigo-200' },
  ]

  return (
    <div>
      {/* ── Hero Section ──────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FiStar size={16} />
              Trusted by 10,000+ customers
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Shop Smarter,
              <span className="text-yellow-400"> Live Better</span>
            </h1>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Discover thousands of products across 30 categories. Quality guaranteed, prices unbeatable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/products')}
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
              >
                <FiShoppingBag size={20} />
                Shop Now
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 rounded-2xl transition-colors"
              >
                Join Free
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-white border-opacity-20">
              {[
                { number: '76+',  label: 'Products' },
                { number: '30+',  label: 'Categories' },
                { number: '10K+', label: 'Customers' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-bold text-yellow-400">{stat.number}</div>
                  <div className="text-blue-200 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ──────────────────────────── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className={`${feature.color} p-4 rounded-2xl mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories Section ────────────────────────── */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Shop by Category</h2>
              <p className="text-gray-500 text-sm mt-1">Explore our wide range of categories</p>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All <FiArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
  {categories.map((cat) => (
    <button
      key={cat.name}
      onClick={() => navigate(`/products?categoryName=${cat.name}`)}
      className={`${cat.color} border rounded-2xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all`}
    >
      <span className="text-3xl">{cat.emoji}</span>
      <span className="text-xs font-medium text-gray-700 text-center leading-tight">
        {cat.name}
      </span>
    </button>
  ))}
</div>

        </div>
      </section>

      {/* ── Featured Products ─────────────────────────── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
              <p className="text-gray-500 text-sm mt-1">Handpicked products just for you</p>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All <FiArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Banner Section ────────────────────────────── */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 text-white text-center">
            <h2 className="text-3xl font-bold mb-3">Ready to Start Shopping?</h2>
            <p className="text-blue-100 mb-6">
              Join thousands of happy customers and find your perfect products today!
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-2xl transition-colors inline-flex items-center gap-2"
            >
              Browse All Products
              <FiArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
