const productService = require('../services/product.service');

class ProductController {
  async getAll(req, res) {
    try {
      const products = await productService.getAllProducts(req.query);
      res.status(200).json({ status: 'success', payload: products });
    } catch (error) {
      res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const product = await productService.getProductById(req.params.id);
      res.status(200).json({ status: 'success', payload: product });
    } catch (error) {
      res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
  }

  async create(req, res) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json({ status: 'success', payload: product });
    } catch (error) {
      res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
  }

  async update(req, res) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      res.status(200).json({ status: 'success', payload: product });
    } catch (error) {
      res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await productService.deleteProduct(req.params.id);
      res.status(200).json({ status: 'success', message: 'Producto eliminado correctamente' });
    } catch (error) {
      res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
  }
}

module.exports = new ProductController();
