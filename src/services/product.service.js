const productRepository = require('../repositories/product.repository');
const { PRODUCT_STATUS } = require('../constants');

class ProductService {
  async getAllProducts(queryParams = {}) {
    const filters = {};
    if (queryParams.category) filters.category = queryParams.category;
    if (queryParams.status) filters.status = queryParams.status;

    const products = await productRepository.getAll(filters);

    // Regla de negocio: los productos discontinuados nunca se listan públicamente
    return products.filter((product) => product.status !== PRODUCT_STATUS.DISCONTINUED);
  }

  async getProductById(id) {
    const product = await productRepository.getById(id);

    if (!product) {
      const error = new Error('Producto no encontrado');
      error.status = 404;
      throw error;
    }

    return product;
  }

  async createProduct(data) {
    const { title, price, stock, category, description } = data;

    if (!title || price === undefined || !category || !description) {
      const error = new Error('title, description, price y category son obligatorios');
      error.status = 400;
      throw error;
    }

    if (price < 0) {
      const error = new Error('El precio no puede ser negativo');
      error.status = 400;
      throw error;
    }

    // Regla de negocio: el estado inicial se calcula a partir del stock
    const status = stock > 0 ? PRODUCT_STATUS.AVAILABLE : PRODUCT_STATUS.OUT_OF_STOCK;

    return productRepository.create({ ...data, status });
  }

  async updateProduct(id, data) {
    await this.getProductById(id); // valida que exista, si no lanza 404

    // Regla de negocio: si se actualiza el stock, recalculamos el estado
    if (data.stock !== undefined) {
      data.status = data.stock > 0 ? PRODUCT_STATUS.AVAILABLE : PRODUCT_STATUS.OUT_OF_STOCK;
    }

    return productRepository.update(id, data);
  }

  async deleteProduct(id) {
    await this.getProductById(id); // valida que exista, si no lanza 404
    return productRepository.delete(id);
  }
}

module.exports = new ProductService();
