const ProductModel = require('../models/product.model');

/**
 * ProductRepository: único lugar del proyecto que importa/usa Mongoose
 * para la entidad Product. No contiene lógica de negocio, solo acceso a datos.
 */
class ProductRepository {
  async getAll(filters = {}) {
    // Encapsula proyección por defecto: nunca exponemos el __v de Mongoose
    return ProductModel.find(filters).select('-__v').lean();
  }

  async getById(id) {
    return ProductModel.findById(id).select('-__v').lean();
  }

  async getByStatus(status) {
    return ProductModel.find({ status }).select('-__v').lean();
  }

  async create(productData) {
    const product = new ProductModel(productData);
    return product.save();
  }

  async update(id, updateData) {
    return ProductModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .select('-__v')
      .lean();
  }

  async delete(id) {
    return ProductModel.findByIdAndDelete(id).lean();
  }
}

// Exportamos una única instancia (singleton) para reutilizar en toda la app
module.exports = new ProductRepository();
