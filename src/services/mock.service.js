const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const userRepository = require('../repositories/user.repository');
const productRepository = require('../repositories/product.repository');
const orderRepository = require('../repositories/order.repository');
const deliveryRepository = require('../repositories/delivery.repository');

const {
  generateUser,
  generateRepartidor,
  generateProduct,
  generateOrder,
  generateDelivery,
} = require('../mocks/generators');

const { ROLES } = require('../constants');

const DEFAULT_QTY = 5;
const MAX_QTY = 200;

class MockService {
  // ============================================================
  // GENERACIÓN EN MEMORIA (no toca la base de datos)
  // ============================================================

  generateUsers(qty = DEFAULT_QTY) {
    return Array.from({ length: qty }, () => generateUser());
  }

  generateRepartidores(qty = DEFAULT_QTY) {
    return Array.from({ length: qty }, () => generateRepartidor());
  }

  generateOrders(qty = DEFAULT_QTY) {
    return Array.from({ length: qty }, () => {
      const user = generateUser();
      const products = this._generateProductBatch();
      return generateOrder({ user, products });
    });
  }

  generateDeliveries(qty = DEFAULT_QTY) {
    return Array.from({ length: qty }, () => {
      const order = generateOrder({ user: generateUser(), products: this._generateProductBatch() });
      const repartidor = generateRepartidor();
      return generateDelivery({ order, repartidor });
    });
  }

  _generateProductBatch() {
    const count = faker.number.int({ min: 1, max: 3 });
    return Array.from({ length: count }, () => generateProduct());
  }

  // ============================================================
  // SEED: genera y persiste en MongoDB usando los Repositories reales
  // ============================================================

  async seed(entity, qty = DEFAULT_QTY) {
    switch (entity) {
      case 'users':
      case 'usuarios':
        return this._seedUsers(qty);
      case 'repartidores':
        return this._seedRepartidores(qty);
      case 'orders':
      case 'pedidos':
        return this._seedOrders(qty);
      case 'deliveries':
      case 'entregas':
        return this._seedDeliveries(qty);
      default: {
        const error = new Error(
          `Entidad "${entity}" inválida. Usá: users, repartidores, orders o deliveries.`
        );
        error.status = 400;
        throw error;
      }
    }
  }

  async _seedUsers(qty) {
    const users = await this._withHashedPasswords(this.generateUsers(qty));
    const inserted = await userRepository.insertMany(users);
    return { insertados: inserted.length, coleccion: 'usuarios' };
  }

  async _seedRepartidores(qty) {
    const repartidores = await this._withHashedPasswords(this.generateRepartidores(qty));
    const inserted = await userRepository.insertMany(repartidores);
    return { insertados: inserted.length, coleccion: 'repartidores' };
  }

  async _seedOrders(qty) {
    const users = await this._ensureUsers();
    const products = await this._ensureProducts();

    const orders = Array.from({ length: qty }, () => {
      const user = faker.helpers.arrayElement(users);
      const orderProducts = faker.helpers.arrayElements(products, {
        min: 1,
        max: Math.min(3, products.length),
      });

      return generateOrder({
        user: user._id,
        products: orderProducts.map((product) => product._id),
      });
    });

    const inserted = await orderRepository.insertMany(orders);
    return { insertados: inserted.length, coleccion: 'pedidos' };
  }

  async _seedDeliveries(qty) {
    const orders = await this._ensureOrders();
    const repartidores = await this._ensureRepartidores();

    const deliveries = Array.from({ length: qty }, () => {
      const order = faker.helpers.arrayElement(orders);
      const repartidor = faker.helpers.arrayElement(repartidores);
      return generateDelivery({ order: order._id, repartidor: repartidor._id });
    });

    const inserted = await deliveryRepository.insertMany(deliveries);
    return { insertados: inserted.length, coleccion: 'entregas' };
  }

  // ============================================================
  // Helpers: aseguran que existan datos reales para armar relaciones válidas
  // ============================================================

  async _withHashedPasswords(users) {
    return Promise.all(
      users.map(async (user) => ({ ...user, password: await bcrypt.hash(user.password, 10) }))
    );
  }

  async _ensureUsers(minCount = 3) {
    let users = await userRepository.getAll({ role: ROLES.USER });
    if (users.length < minCount) {
      await this._seedUsers(minCount - users.length);
      users = await userRepository.getAll({ role: ROLES.USER });
    }
    return users;
  }

  async _ensureRepartidores(minCount = 2) {
    let repartidores = await userRepository.getAll({ role: ROLES.REPARTIDOR });
    if (repartidores.length < minCount) {
      await this._seedRepartidores(minCount - repartidores.length);
      repartidores = await userRepository.getAll({ role: ROLES.REPARTIDOR });
    }
    return repartidores;
  }

  async _ensureProducts(minCount = 3) {
    let products = await productRepository.getAll();
    if (products.length < minCount) {
      const fallbackProducts = Array.from({ length: minCount - products.length }, () =>
        generateProduct()
      );
      await productRepository.insertMany(fallbackProducts);
      products = await productRepository.getAll();
    }
    return products;
  }

  async _ensureOrders(minCount = 3) {
    let orders = await orderRepository.getAll();
    if (orders.length < minCount) {
      await this._seedOrders(minCount - orders.length);
      orders = await orderRepository.getAll();
    }
    return orders;
  }
}

module.exports = new MockService();
