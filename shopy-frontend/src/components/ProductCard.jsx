import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { addToCart } from '../redux/slices/cartSlice'
import { FiShoppingCart, FiStar, FiEye } from 'react-icons/fi'

const ProductCard = ({ product }) => {
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const { user }   = useSelector((state) => state.auth)

  const handleAddToCart = async (e) => {
    e.stopPropagation()
    if (!user) {
      toast.error('Please login to add to cart!')
      navigate('/login')
      return
    }
    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap()
      toast.success('Added to cart! 🛒')
    } catch (error) {
      toast.error(error)
    }
  }

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0

  return (
    <div
      onClick={() => navigate(`/products/${product._id}`)}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden bg-gray-100 h-52">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <FiShoppingCart size={48} />
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </div>
        )}

        {/* Out of Stock Badge */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">
          {product.category?.name}
        </p>

        {/* Name */}
        <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Ratings */}
        <div className="flex items-center gap-1 mb-3">
          <FiStar className="text-yellow-400 fill-yellow-400" size={14} />
          <span className="text-sm text-gray-600">
            {product.ratings > 0 ? product.ratings.toFixed(1) : 'No reviews'}
          </span>
          {product.numReviews > 0 && (
            <span className="text-xs text-gray-400">({product.numReviews})</span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-gray-900">
            ${product.discountPrice || product.price}
          </span>
          {product.discountPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${product.price}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-medium py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <FiShoppingCart size={16} />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/products/${product._id}`)
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-xl transition-colors"
          >
            <FiEye size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard