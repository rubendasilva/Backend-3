const { faker } = require('@faker-js/faker');
const { DELIVERY_STATUS } = require('../../constants');

/**
 * Genera una entrega falsa.
 * @param {Object} params
 * @param {Object|string} params.order - Pedido asociado: ObjectId real o
 *   pedido mock embebido.
 * @param {Object|string} params.repartidor - Repartidor asignado: ObjectId
 *   real o repartidor mock embebido.
 */
function generateDelivery({ order, repartidor }) {
  return {
    order,
    repartidor,
    status: faker.helpers.arrayElement(Object.values(DELIVERY_STATUS)),
    estimatedTime: faker.number.int({ min: 15, max: 120 }),
  };
}

module.exports = { generateDelivery };
