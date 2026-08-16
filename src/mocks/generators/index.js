const { generateUser, generateRepartidor } = require('./user.generator');
const { generateProduct } = require('./product.generator');
const { generateOrder } = require('./order.generator');
const { generateDelivery } = require('./delivery.generator');

module.exports = {
  generateUser,
  generateRepartidor,
  generateProduct,
  generateOrder,
  generateDelivery,
};
