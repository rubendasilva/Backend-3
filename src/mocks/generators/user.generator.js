const { faker } = require('@faker-js/faker');
const { ROLES } = require('../../constants');

/**
 * Genera un usuario falso. Por defecto elige un rol entre USER y ADMIN;
 * se puede forzar un rol puntual (por ejemplo REPARTIDOR) pasándolo explícito.
 */
function generateUser(role = faker.helpers.arrayElement([ROLES.USER, ROLES.ADMIN])) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  // Se agrega un sufijo numérico random para minimizar colisiones de email
  // (el modelo User exige email único) al insertar muchos registros de golpe.
  const uniqueSuffix = faker.number.int({ min: 1000, max: 999999 });
  const email = faker.internet
    .email({ firstName, lastName, provider: 'shipnow-mock.test' })
    .toLowerCase()
    .replace('@', `.${uniqueSuffix}@`);

  return {
    firstName,
    lastName,
    email,
    password: faker.internet.password({ length: 10 }),
    role,
  };
}

/**
 * Genera un repartidor: un usuario cuyo único rol válido es ROLES.REPARTIDOR.
 */
function generateRepartidor() {
  return generateUser(ROLES.REPARTIDOR);
}

module.exports = { generateUser, generateRepartidor };
