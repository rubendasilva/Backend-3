require('dotenv').config();

/**
 * Lista de variables de entorno sin las cuales la app no puede arrancar.
 * Si agregás una nueva variable obligatoria, sumala acá.
 */
const REQUIRED_ENV_VARS = ['PORT', 'MONGODB_URI', 'NODE_ENV'];

function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `❌ Faltan variables de entorno obligatorias: ${missing.join(', ')}. ` +
        `Revisá tu archivo .env (podés basarte en .env.example) antes de levantar el servidor.`
    );
  }
}

validateEnv();

/**
 * Único punto de acceso a process.env en todo el proyecto.
 * Ningún otro archivo debería leer process.env directamente.
 */
const config = Object.freeze({
  port: process.env.PORT,
  mongoUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV,
});

module.exports = config;
