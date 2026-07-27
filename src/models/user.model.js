const { Schema, model } = require('mongoose');
const { ROLES } = require('../constants');

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
  },
  { timestamps: true }
);

module.exports = model('User', userSchema);
