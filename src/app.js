const express = require('express');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'ShipNow API funcionando 🚚' });
});

// Manejo de rutas inexistentes
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Ruta no encontrada' });
});

module.exports = app;
