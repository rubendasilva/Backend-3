const UserModel = require('../models/user.model');

class UserRepository {
  async getAll() {
    // Nunca exponemos el password ni el __v por defecto
    return UserModel.find().select('-password -__v').lean();
  }

  async getById(id) {
    return UserModel.findById(id).select('-password -__v').lean();
  }

  async getByEmail(email) {
    // Acá sí devolvemos el password: lo necesita el Service para validar login
    return UserModel.findOne({ email }).lean();
  }

  async create(userData) {
    const user = new UserModel(userData);
    return user.save();
  }

  async insertMany(usersData) {
    return UserModel.insertMany(usersData);
  }

  async update(id, updateData) {
    return UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .select('-password -__v')
      .lean();
  }

  async delete(id) {
    return UserModel.findByIdAndDelete(id).lean();
  }
}

module.exports = new UserRepository();
