import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { createOrder } from '../redux/slices/orderSlice'
import { clearCart } from '../redux/slices/cartSlice'
import api from '../services/api'
import {
  FiMapPin,
  FiCreditCard,
  FiTruck,
  FiCheck,
  FiShoppingBag,
  FiLock,
} from 'react-icons/fi'

// ── Load Stripe once (outside component to avoid re-creation) ──
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

// ── Card Element Styling ──────────────────────────────
const cardElementOptions = {
  style: {
    base: {
      fontSize:    '14px',
      color:       '#374151',
      fontFamily:  'inherit',
      '::placeholder': { color: '#9CA3AF' },
    },
    invalid: { color: '#EF4444' },
  },
}

// ─────────────────────────────────────────────────────
// Inner component — has access to Stripe hooks
// ─────────────────────────────────────────────────────
const CheckoutForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const stripe   = useStripe()
  const elements = useElements()

  const { items, totalPrice } = useSelector((state) => state.cart)
  const { loading }           = useSelector((state) => state.orders)

  const [step, setStep] = useState(1)
  const [stripeLoading, setStripeLoading] = useState(false)

  const [shippingAddress, setShippingAddress] = useState({
    street:  '',
    city:    '',
    state:   '',
    country: '',
    zip:     '',
  })

  const [paymentMethod, setPaymentMethod] = useState('cod')

  const handleShippingChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value })
  }

  const handleShippingSubmit = (e) => {
    e.preventDefault()
    const { street, city, state, country, zip } = shippingAddress
    if (!street || !city || !state || !country || !zip) {
      toast.error('Please fill all address fields!')
      return
    }
    setStep(2)
  }

  const handlePlaceOrder = async () => {
    try {
      if (paymentMethod === 'stripe') {
        // ── Stripe Payment Flow ──────────────────────
        if (!stripe || !elements) {
          toast.error('Stripe is not loaded yet. Please try again.')
          return
        }

        setStripeLoading(true)

        // Step 1 — Ask backend to create a PaymentIntent
        const { data } = await api.post('/payment/create-intent')
        const { clientSecret } = data

        // Step 2 — Confirm card payment with Stripe
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        })

        setStripeLoading(false)

        if (error) {
          toast.error(error.message)
          return
        }

        if (paymentIntent.status !== 'succeeded') {
          toast.error('Payment was not completed. Please try again.')
          return
        }

        // Step 3 — Create order with paid status
        await dispatch(createOrder({
          shippingAddress,
          paymentMethod,
          paymentStatus: 'paid',
        })).unwrap()

      } else {
        // ── COD / PayPal — create order directly ────
        await dispatch(createOrder({ shippingAddress, paymentMethod })).unwrap()
      }

      dispatch(clearCart())
      toast.success('Order placed successfully! 🎉')
      navigate('/orders')
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(typeof error === 'string' ? error : error?.message || 'Something went wrong')
    }
  }

  const shipping = totalPrice > 50 ? 0 : 9.99
  const tax      = totalPrice * 0.1
  const total    = totalPrice + shipping + tax
  const isPlacingOrder = loading || stripeLoading

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-8">
        {[
          { num: 1, label: 'Shipping' },
          { num: 2, label: 'Payment' },
          { num: 3, label: 'Review' },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              ${step >= s.num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}
            `}>
              {step > s.num ? <FiCheck size={16} /> : s.num}
            </div>
            <span className={`text-sm font-medium ${step >= s.num ? 'text-blue-600' : 'text-gray-400'}`}>
              {s.label}
            </span>
            {i < 2 && (
              <div className={`flex-1 h-0.5 w-12 ${step > s.num ? 'bg-blue-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* ── Left Side ─────────────────────────────── */}
        <div className="flex-1">

          {/* ── Step 1 — Shipping ───────────────────── */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                  <FiMapPin size={20} />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Shipping Address</h2>
              </div>

              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text" name="street" value={shippingAddress.street}
                    onChange={handleShippingChange} placeholder="123 Main Street"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input type="text" name="city" value={shippingAddress.city}
                      onChange={handleShippingChange} placeholder="Mumbai"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input type="text" name="state" value={shippingAddress.state}
                      onChange={handleShippingChange} placeholder="Maharashtra"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input type="text" name="country" value={shippingAddress.country}
                      onChange={handleShippingChange} placeholder="India"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input type="text" name="zip" value={shippingAddress.zip}
                      onChange={handleShippingChange} placeholder="400001"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-2xl transition-colors mt-2"
                >
                  Continue to Payment
                </button>
              </form>
            </div>
          )}

          {/* ── Step 2 — Payment ─────────────────────
               NOTE: always rendered (not conditional) when
               paymentMethod === 'stripe' so CardElement stays
               mounted and is accessible in step 3            */}
          <div className={step !== 2 ? 'hidden' : ''}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                  <FiCreditCard size={20} />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Payment Method</h2>
              </div>

              {/* Payment Method Options */}
              <div className="space-y-3 mb-6">
                {[
                  { value: 'cod',    label: 'Cash on Delivery',  icon: '💵', desc: 'Pay when you receive' },
                  { value: 'stripe', label: 'Credit / Debit Card', icon: '💳', desc: 'Secure Stripe payment' },
                  { value: 'paypal', label: 'PayPal',            icon: '🅿️', desc: 'Pay with PayPal' },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                      paymentMethod === method.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio" name="paymentMethod" value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="hidden"
                    />
                    <span className="text-2xl">{method.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{method.label}</p>
                      <p className="text-xs text-gray-500">{method.desc}</p>
                    </div>
                    {paymentMethod === method.value && (
                      <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center">
                        <FiCheck size={14} />
                      </div>
                    )}
                  </label>
                ))}
              </div>

              {/* ── Stripe Card Form ─────────────────── */}
              {paymentMethod === 'stripe' && (
                <div className="mb-6 p-4 border border-gray-200 rounded-2xl bg-gray-50">
                  <div className="flex items-center gap-2 mb-3">
                    <FiLock size={14} className="text-green-600" />
                    <p className="text-sm font-medium text-gray-700">
                      Card Details
                    </p>
                    <span className="ml-auto text-xs text-gray-400 flex items-center gap-1">
                      🔒 Secured by Stripe
                    </span>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
                    <CardElement options={cardElementOptions} />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Test card: <span className="font-mono">4242 4242 4242 4242</span> · Any future date · Any CVC
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-200 text-gray-600 font-medium py-3 rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-2xl transition-colors"
                >
                  Review Order
                </button>
              </div>
            </div>
          </div>

          {/* ── Step 3 — Review ─────────────────────── */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                  <FiShoppingBag size={20} />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Review Order</h2>
              </div>

              {/* Shipping Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiMapPin size={16} className="text-blue-600" />
                  <h3 className="font-medium text-gray-700 text-sm">Shipping Address</h3>
                </div>
                <p className="text-sm text-gray-600">
                  {shippingAddress.street}, {shippingAddress.city},&nbsp;
                  {shippingAddress.state}, {shippingAddress.country} - {shippingAddress.zip}
                </p>
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <FiCreditCard size={16} className="text-blue-600" />
                  <h3 className="font-medium text-gray-700 text-sm">Payment Method</h3>
                </div>
                <p className="text-sm text-gray-600 capitalize">
                  {paymentMethod === 'cod'    && 'Cash on Delivery'}
                  {paymentMethod === 'stripe' && '💳 Credit / Debit Card (Stripe)'}
                  {paymentMethod === 'paypal' && '🅿️ PayPal'}
                </p>
              </div>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <div className="bg-gray-100 rounded-lg w-12 h-12 flex items-center justify-center shrink-0">
                      <FiShoppingBag size={20} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.product?.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border border-gray-200 text-gray-600 font-medium py-3 rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2"
                >
                  {isPlacingOrder ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {stripeLoading ? 'Processing Payment...' : 'Placing Order...'}
                    </>
                  ) : (
                    <>
                      <FiCheck size={18} />
                      {paymentMethod === 'stripe' ? 'Pay & Place Order' : 'Place Order'}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Order Summary Sidebar ──────────────────── */}
        <div className="lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-20">
            <h2 className="font-bold text-gray-800 mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate flex-1 mr-2">
                    {item.product?.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-gray-800 shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? 'FREE' : `$${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-800">
                <span>Total</span>
                <span className="text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl p-3">
              <FiTruck size={14} className="text-blue-500 shrink-0" />
              Estimated delivery: 3-5 business days
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────
// Outer component — wraps CheckoutForm with Stripe context
// ─────────────────────────────────────────────────────
const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}

export default Checkout
