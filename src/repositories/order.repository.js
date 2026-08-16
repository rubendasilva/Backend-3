const OrderModel = require('../models/order.model');

class OrderRepository {
  async getAll(filters = {}) {
    return OrderModel.find(filters).select('-__v').lean();
  }

  async getById(id) {
    return OrderModel.findById(id).select('-__v').lean();
  }

  async create(orderData) {
    const order = new OrderModel(orderData);
    return order.save();
  }

  async insertMany(ordersData) {
    return OrderModel.insertMany(ordersData);
  }

  async update(id, updateData) {
    return OrderModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .select('-__v')
      .lean();
  }

  async delete(id) {
    return OrderModel.findByIdAndDelete(id).lean();
  }
}

module.exports = new OrderRepository();
