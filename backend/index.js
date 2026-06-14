const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const Energy = require('./models/Energy');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

connectDB();

// ROUTE 1: GET /energy — return all data
app.get('/energy', async (req, res) => {
  const data = await Energy.find({});
  res.json(data);
});

// ROUTE 2: GET /energy/zone — return totals per zone
app.get('/energy/zone', async (req, res) => {
  const data = await Energy.find({});
  const zoneTotals = {};
  data.forEach(record => {
    if (!zoneTotals[record.zone]) zoneTotals[record.zone] = 0;
    zoneTotals[record.zone] += record.energy_kwh;
  });
  const result = Object.entries(zoneTotals).map(([zone, total]) => ({
    zone,
    total_kwh: parseFloat(total.toFixed(2))
  }));
  res.json(result);
});

// ROUTE 3: GET /energy/daily — return totals per timestamp
app.get('/energy/daily', async (req, res) => {
  const data = await Energy.find({});
  const hourlyTotals = {};
  data.forEach(record => {
    if (!hourlyTotals[record.timestamp]) hourlyTotals[record.timestamp] = 0;
    hourlyTotals[record.timestamp] += record.energy_kwh;
  });
  const result = Object.entries(hourlyTotals).map(([timestamp, total]) => ({
    timestamp,
    total_kwh: parseFloat(total.toFixed(2))
  }));
  res.json(result);
});

// ROUTE 4: GET /energy/summary — return key stats
app.get('/energy/summary', async (req, res) => {
  const data = await Energy.find({});
  const total = data.reduce((sum, r) => sum + r.energy_kwh, 0);
  const average = total / data.length;

  const zoneTotals = {};
  data.forEach(record => {
    if (!zoneTotals[record.zone]) zoneTotals[record.zone] = 0;
    zoneTotals[record.zone] += record.energy_kwh;
  });

  const peakZone = Object.entries(zoneTotals).sort((a, b) => b[1] - a[1])[0];

  res.json({
    total_kwh: parseFloat(total.toFixed(2)),
    average_kwh_per_record: parseFloat(average.toFixed(2)),
    total_records: data.length,
    peak_zone: peakZone[0],
    peak_zone_kwh: parseFloat(peakZone[1].toFixed(2)),
    zones: Object.entries(zoneTotals).map(([zone, total]) => ({
      zone,
      total_kwh: parseFloat(total.toFixed(2))
    }))
  });
});

app.listen(PORT, () => {
  console.log(`Smart Energy Backend running at http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log('  GET /energy');
  console.log('  GET /energy/zone');
  console.log('  GET /energy/daily');
  console.log('  GET /energy/summary');
});
