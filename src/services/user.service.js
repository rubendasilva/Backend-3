const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');
const { ROLES } = require('../constants');

class UserService {
  async getAllUsers() {
    return userRepository.getAll();
  }

  async getUserById(id) {
    const user = await userRepository.getById(id);

    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      throw error;
    }

    return user;
  }

  async createUser(data) {
    const { firstName, lastName, email, password } = data;

    if (!firstName || !lastName || !email || !password) {
      const error = new Error('firstName, lastName, email y password son obligatorios');
      error.status = 400;
      throw error;
    }

    const existingUser = await userRepository.getByEmail(email);
    if (existingUser) {
      const error = new Error('Ya existe un usuario registrado con ese email');
      error.status = 409;
      throw error;
    }

    // Regla de negocio: el password nunca se guarda en texto plano
    const hashedPassword = await bcrypt.hash(password, 10);

    // Regla de negocio: nadie puede auto-asignarse ADMIN desde el registro público
    const role = data.role === ROLES.ADMIN ? ROLES.ADMIN : ROLES.USER;

    const newUser = await userRepository.create({
      ...data,
      password: hashedPassword,
      role,
    });

    const userObject = newUser.toObject();
    delete userObject.password;
    return userObject;
  }

  async updateUser(id, data) {
    await this.getUserById(id); // valida que exista, si no lanza 404

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    // Un usuario no puede cambiar su propio rol vía update genérico
    delete data.role;

    return userRepository.update(id, data);
  }

  async deleteUser(id) {
    await this.getUserById(id); // valida que exista, si no lanza 404
    return userRepository.delete(id);
  }
}

module.exports = new UserService();
