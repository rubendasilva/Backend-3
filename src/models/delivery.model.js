const { Schema, model } = require('mongoose');
const { DELIVERY_STATUS } = require('../constants');

const deliverySchema = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    repartidor: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    status: {
      type: String,
      enum: Object.values(DELIVERY_STATUS),
      default: DELIVERY_STATUS.ASSIGNED,
    },
    estimatedTime: { type: Number, min: 0 }, // minutos
  },
  { timestamps: true }
);

module.exports = model('Delivery', deliverySchema);
