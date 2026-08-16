const { Schema, model } = require('mongoose');
const { ORDER_STATUS, ORDER_PRIORITY } = require('../constants');

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },
    priority: {
      type: String,
      enum: Object.values(ORDER_PRIORITY),
      default: ORDER_PRIORITY.MEDIUM,
    },
    address: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = model('Order', orderSchema);
