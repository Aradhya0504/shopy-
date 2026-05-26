const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Cart   = require('../models/cart.js');

// ── @desc    Create a Stripe PaymentIntent
// ── @route   POST /api/payment/create-intent
// ── @access  Private
const createPaymentIntent = async (req, res) => {
  try {
    // Get user's cart to calculate the amount
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: '❌ Your cart is empty' });
    }

    // Match the same totals shown in the frontend
    const shipping = cart.totalPrice > 50 ? 0 : 9.99;
    const tax      = cart.totalPrice * 0.1;
    const total    = cart.totalPrice + shipping + tax;

    // Stripe requires amount in smallest currency unit (cents for USD)
    const amountInCents = Math.round(total * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount:   amountInCents,
      currency: 'usd',
      metadata: { userId: req.user._id.toString() },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPaymentIntent };
