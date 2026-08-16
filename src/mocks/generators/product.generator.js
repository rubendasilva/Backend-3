const { faker } = require('@faker-js/faker');
const { PRODUCT_STATUS } = require('../../constants');

/**
 * Genera un producto falso con la misma forma que el modelo real de Product.
 */
function generateProduct() {
  const stock = faker.number.int({ min: 0, max: 50 });

  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: Number(faker.commerce.price({ min: 500, max: 20000 })),
    stock,
    category: faker.commerce.department(),
    status: stock > 0 ? PRODUCT_STATUS.AVAILABLE : PRODUCT_STATUS.OUT_OF_STOCK,
  };
}

module.exports = { generateProduct };
