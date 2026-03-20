const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
        price:    { type: Number, required: true },
      },
    ],
    shippingAddress: {
      street:  { type: String, required: true },
      city:    { type: String, required: true },
      state:   { type: String, required: true },
      country: { type: String, required: true },
      zip:     { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'cod', 'paypal'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
    },
    totalPrice:    { type: Number, required: true },
    paidAt:        { type: Date },
    deliveredAt:   { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);