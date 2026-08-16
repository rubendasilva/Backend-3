const { Router } = require('express');
const mockController = require('../controllers/mock.controller');

const router = Router();

// GET: devuelven datos simulados SIN guardarlos en la base
router.get('/users', mockController.getUsers);
router.get('/repartidores', mockController.getRepartidores);
router.get('/orders', mockController.getOrders);
router.get('/deliveries', mockController.getDeliveries);

// POST: genera e INSERTA registros de prueba en MongoDB
// Query params: ?qty=10&entity=users|repartidores|orders|deliveries
router.post('/seed', mockController.seed);

module.exports = router;
