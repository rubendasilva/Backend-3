const mockService = require('../services/mock.service');

const DEFAULT_QTY = 5;
const DEFAULT_SEED_QTY = 10;
const MAX_QTY = 200;

function parseQty(rawQty, defaultQty) {
  if (rawQty === undefined) return defaultQty;

  const qty = Number(rawQty);
  if (!Number.isInteger(qty) || qty <= 0) {
    const error = new Error('El parámetro "qty" debe ser un número entero positivo');
    error.status = 400;
    throw error;
  }

  return Math.min(qty, MAX_QTY);
}

class MockController {
  async getUsers(req, res) {
    try {
      const qty = parseQty(req.query.qty, DEFAULT_QTY);
      const payload = mockService.generateUsers(qty);
      res.status(200).json(payload);
    } catch (error) {
      res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
  }

  async getRepartidores(req, res) {
    try {
      const qty = parseQty(req.query.qty, DEFAULT_QTY);
      const payload = mockService.generateRepartidores(qty);
      res.status(200).json(payload);
    } catch (error) {
      res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
  }

  async getOrders(req, res) {
    try {
      const qty = parseQty(req.query.qty, DEFAULT_QTY);
      const payload = mockService.generateOrders(qty);
      res.status(200).json(payload);
    } catch (error) {
      res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
  }

  async getDeliveries(req, res) {
    try {
      const qty = parseQty(req.query.qty, DEFAULT_QTY);
      const payload = mockService.generateDeliveries(qty);
      res.status(200).json(payload);
    } catch (error) {
      res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
  }

  async seed(req, res) {
    try {
      const qty = parseQty(req.query.qty, DEFAULT_SEED_QTY);
      const entity = req.query.entity || 'users';
      const result = await mockService.seed(entity, qty);
      res.status(201).json(result);
    } catch (error) {
      res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
  }
}

module.exports = new MockController();
