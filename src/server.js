const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/env.config');

async function startServer() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✅ Conectado a MongoDB');

    app.listen(config.port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${config.port} [${config.nodeEnv}]`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
}

startServer();
