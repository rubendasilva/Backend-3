const DeliveryModel = require('../models/delivery.model');

class DeliveryRepository {
  async getAll(filters = {}) {
    return DeliveryModel.find(filters).select('-__v').lean();
  }

  async getById(id) {
    return DeliveryModel.findById(id).select('-__v').lean();
  }

  async create(deliveryData) {
    const delivery = new DeliveryModel(deliveryData);
    return delivery.save();
  }

  async insertMany(deliveriesData) {
    return DeliveryModel.insertMany(deliveriesData);
  }

  async update(id, updateData) {
    return DeliveryModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .select('-__v')
      .lean();
  }

  async delete(id) {
    return DeliveryModel.findByIdAndDelete(id).lean();
  }
}

module.exports = new DeliveryRepository();
