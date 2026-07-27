/**
 * Roles de usuario disponibles en la plataforma.
 * Usar siempre ROLES.ADMIN / ROLES.USER en vez de strings sueltos.
 */
const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  USER: 'USER',
});

/**
 * Estados posibles de un producto en el catálogo.
 */
const PRODUCT_STATUS = Object.freeze({
  AVAILABLE: 'AVAILABLE',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  DISCONTINUED: 'DISCONTINUED',
});

module.exports = { ROLES, PRODUCT_STATUS };
