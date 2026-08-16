/**
 * Roles de usuario disponibles en la plataforma.
 * Usar siempre ROLES.ADMIN / ROLES.USER en vez de strings sueltos.
 */
const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  USER: 'USER',
  REPARTIDOR: 'REPARTIDOR',
});

/**
 * Estados posibles de un producto en el catálogo.
 */
const PRODUCT_STATUS = Object.freeze({
  AVAILABLE: 'AVAILABLE',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  DISCONTINUED: 'DISCONTINUED',
});

/**
 * Estados posibles de un pedido (Order).
 */
const ORDER_STATUS = Object.freeze({
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
});

/**
 * Prioridades posibles de un pedido (Order).
 */
const ORDER_PRIORITY = Object.freeze({
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
});

/**
 * Estados posibles de una entrega (Delivery).
 */
const DELIVERY_STATUS = Object.freeze({
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
});

module.exports = { ROLES, PRODUCT_STATUS, ORDER_STATUS, ORDER_PRIORITY, DELIVERY_STATUS };
