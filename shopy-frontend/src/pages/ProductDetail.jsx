import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getProductById, addReview, clearSuccess } from '../redux/slices/productSlice'
import { addToCart } from '../redux/slices/cartSlice'
import Loader from '../components/Loader'
import {
  FiShoppingCart,
  FiStar,
  FiArrowLeft,
  FiPackage,
  FiCheck,
} from 'react-icons/fi'

const ProductDetail = () => {
  const { id }     = useParams()
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const { product, loading, success } = useSelector((state) => state.products)
  const { user }   = useSelector((state) => state.auth)

  const [quantity, setQuantity]   = useState(1)
  const [rating,   setRating]     = useState(5)
  const [comment,  setComment]    = useState('')
  const [reviews,  setReviews]    = useState([])

  useEffect(() => {
    dispatch(getProductById(id))
  }, [dispatch, id])

  useEffect(() => {
    if (success) {
      toast.success('Review added successfully!')
      dispatch(clearSuccess())
      dispatch(getProductById(id))
      setComment('')
      setRating(5)
    }
  }, [success])

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add to cart!')
      navigate('/login')
      return
    }
    try {
      await dispatch(addToCart({ productId: product._id, quantity })).unwrap()
      toast.success(`${product.name} added to cart! 🛒`)
    } catch (error) {
      toast.error(error)
    }
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to add a review!')
      navigate('/login')
      return
    }
    if (!comment.trim()) {
      toast.error('Please write a comment!')
      return
    }
    dispatch(addReview({ productId: id, reviewData: { rating, comment } }))
  }

  if (loading) return <Loader />

  if (!product) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Product not found</p>
    </div>
  )

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
      >
        <FiArrowLeft size={20} />
        Back to Products
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

          {/* Product Image */}
          <div className="bg-gray-50 flex items-center justify-center p-12 min-h-80">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="max-h-80 object-contain"
              />
            ) : (
              <div className="text-gray-300 flex flex-col items-center gap-4">
                <FiShoppingCart size={80} />
                <p className="text-gray-400">No image available</p>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-8">
            {/* Category */}
            <p className="text-blue-600 text-sm font-medium uppercase tracking-wide mb-2">
              {product.category?.name}
            </p>

            {/* Name */}
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    size={18}
                    className={
                      star <= Math.round(product.ratings)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.ratings > 0
                  ? `${product.ratings.toFixed(1)} (${product.numReviews} reviews)`
                  : 'No reviews yet'}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                ${product.discountPrice || product.price}
              </span>
              {product.discountPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    ${product.price}
                  </span>
                  <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded-full">
                    -{discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              {product.stock > 0 ? (
                <>
                  <FiCheck size={18} className="text-green-500" />
                  <span className="text-green-600 text-sm font-medium">
                    In Stock ({product.stock} available)
                  </span>
                </>
              ) : (
                <>
                  <FiPackage size={18} className="text-red-500" />
                  <span className="text-red-500 text-sm font-medium">
                    Out of Stock
                  </span>
                </>
              )}
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <label className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-gray-800 font-medium border-x border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-4 rounded-2xl transition-colors flex items-center justify-center gap-3 text-lg"
            >
              <FiShoppingCart size={22} />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            {/* Seller */}
            <p className="text-xs text-gray-400 mt-4 text-center">
              Sold by: {product.seller?.name || 'Shopy'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Reviews Section ───────────────────────────── */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Customer Reviews
        </h2>

        {/* Add Review Form */}
        {user && (
          <form onSubmit={handleReviewSubmit} className="mb-8 p-6 bg-gray-50 rounded-2xl">
            <h3 className="font-semibold text-gray-700 mb-4">Write a Review</h3>

            {/* Star Rating */}
            <div className="flex items-center gap-2 mb-4">
              <label className="text-sm text-gray-600">Rating:</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <FiStar
                      size={24}
                      className={
                        star <= rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={4}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 resize-none mb-4"
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-xl transition-colors text-sm"
            >
              Submit Review
            </button>
          </form>
        )}

        {/* Reviews List */}
        {product.numReviews === 0 ? (
          <div className="text-center py-10">
            <div className="text-5xl mb-3">⭐</div>
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-500 text-sm">
              Reviews will appear here after submission.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
