const userService = require('../services/user.service');

class UserController {
  async getAll(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({ status: 'success', payload: users });
    } catch (error) {
      res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.status(200).json({ status: 'success', payload: user });
    } catch (error) {
      res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
  }

  async create(req, res) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({ status: 'success', payload: user });
    } catch (error) {
      res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
  }

  async update(req, res) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.status(200).json({ status: 'success', payload: user });
    } catch (error) {
      res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await userService.deleteUser(req.params.id);
      res.status(200).json({ status: 'success', message: 'Usuario eliminado correctamente' });
    } catch (error) {
      res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
  }
}

module.exports = new UserController();
