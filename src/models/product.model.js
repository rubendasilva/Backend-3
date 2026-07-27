const { Schema, model } = require('mongoose');
const { PRODUCT_STATUS } = require('../constants');

const productSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    category: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: Object.values(PRODUCT_STATUS),
      default: PRODUCT_STATUS.AVAILABLE,
    },
  },
  { timestamps: true }
);

module.exports = model('Product', productSchema);
