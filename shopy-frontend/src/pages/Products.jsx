import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { getProducts } from '../redux/slices/productSlice'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import api from '../services/api'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'

const Products = () => {
  const dispatch = useDispatch()
  const { products, loading, count } = useSelector((state) => state.products)
  const [searchParams, setSearchParams] = useSearchParams()

  const [filters, setFilters] = useState({
    keyword:  searchParams.get('keyword') || '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy:   '',
  })

  const [categories,  setCategories]  = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [catsLoaded,  setCatsLoaded]  = useState(false)

  // ── Step 1a: Fetch categories ONCE on mount ────────────
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories')
        setCategories(data)
      } catch (error) {
        console.error('Failed to fetch categories', error)
      } finally {
        setCatsLoaded(true)
      }
    }
    fetchCategories()
  }, []) // fetch only once — categories are static

  // ── Step 1b: Sync keyword + resolve categoryName from URL ──
  useEffect(() => {
    if (!catsLoaded) return

    // Sync keyword (fixes Navbar search when already on /products)
    const keyword = searchParams.get('keyword')
    if (keyword !== null) {
      setFilters((prev) => ({ ...prev, keyword }))
    }

    // Resolve categoryName → category ID
    const categoryName = searchParams.get('categoryName')
    if (categoryName && categories.length > 0) {
      const matched = categories.find(
        (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
      )
      if (matched) {
        setFilters((prev) => ({ ...prev, category: matched._id }))
      }
    }
  }, [catsLoaded, searchParams, categories]) // re-run when user navigates from Home

  // ── Step 2: Fetch products ONLY after categories are resolved ──
  useEffect(() => {
    if (!catsLoaded) return // Wait — don't fetch until category ID is known

    const params = {}
    if (filters.keyword)  params.keyword  = filters.keyword
    if (filters.category) params.category = filters.category
    if (filters.minPrice) params.minPrice = filters.minPrice
    if (filters.maxPrice) params.maxPrice = filters.maxPrice
    if (filters.sortBy)   params.sortBy   = filters.sortBy

    dispatch(getProducts(params))
  }, [dispatch, filters, catsLoaded])

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const clearFilters = () => {
    setFilters({
      keyword:  '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy:   '',
    })
    setSearchParams({})
  }

  const sortOptions = [
    { value: '',           label: 'Default' },
    { value: 'price_asc',  label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'newest',     label: 'Newest First' },
    { value: 'rating',     label: 'Top Rated' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Products</h1>
          <p className="text-gray-500 text-sm mt-1">
            {count} products found
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors md:hidden"
        >
          <FiFilter size={16} />
          Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">

        {/* ── Sidebar Filters ────────────────────────── */}
        <aside className={`md:w-64 shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-20">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-800">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
              >
                <FiX size={14} /> Clear All
              </button>
            </div>

            {/* Search */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <FiSearch
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="keyword"
                  value={filters.keyword}
                  onChange={handleFilterChange}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Category */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full py-2 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="w-full py-2 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="w-full py-2 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Sort By */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="w-full py-2 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* ── Products Grid ──────────────────────────── */}
        <div className="flex-1">
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your filters or search term
              </p>
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products