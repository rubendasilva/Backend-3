const { faker } = require('@faker-js/faker');
const { ORDER_STATUS, ORDER_PRIORITY } = require('../../constants');

/**
 * Genera un pedido falso.
 * @param {Object} params
 * @param {Object|string} params.user - Usuario dueño del pedido: puede ser un
 *   ObjectId real (para persistir) o un objeto embebido de usuario mock (para
 *   una respuesta sin persistir, simulando cómo se vería populado).
 * @param {Array} params.products - Productos del pedido: ids reales o
 *   productos mock embebidos.
 */
function generateOrder({ user, products }) {
  return {
    user,
    products,
    total: Number(faker.commerce.price({ min: 1000, max: 100000 })),
    status: faker.helpers.arrayElement(Object.values(ORDER_STATUS)),
    priority: faker.helpers.arrayElement(Object.values(ORDER_PRIORITY)),
    address: faker.location.streetAddress(),
  };
}

module.exports = { generateOrder };
