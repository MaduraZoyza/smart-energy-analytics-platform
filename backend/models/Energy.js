const mongoose = require('mongoose');

const energySchema = new mongoose.Schema({
  timestamp: { type: String, required: true },
  zone: { type: String, required: true },
  energy_kwh: { type: Number, required: true }
});

module.exports = mongoose.model('Energy', energySchema);
