const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Load CSV data into memory
let energyData = [];

function loadData() {
  energyData = [];
  fs.createReadStream('./data/energy.csv')
    .pipe(csv())
    .on('data', (row) => {
      energyData.push({
        timestamp: row.timestamp,
        zone: row.zone,
        energy_kwh: parseFloat(row.energy_kwh)
      });
    })
    .on('end', () => {
      console.log(`Loaded ${energyData.length} records from CSV`);
    });
}

loadData();

// ROUTE 1: GET /energy — return all data
app.get('/energy', (req, res) => {
  res.json(energyData);
});

// ROUTE 2: GET /energy/zone — return totals per zone
app.get('/energy/zone', (req, res) => {
  const zoneTotals = {};
  energyData.forEach(record => {
    if (!zoneTotals[record.zone]) {
      zoneTotals[record.zone] = 0;
    }
    zoneTotals[record.zone] += record.energy_kwh;
  });
  const result = Object.entries(zoneTotals).map(([zone, total]) => ({
    zone,
    total_kwh: parseFloat(total.toFixed(2))
  }));
  res.json(result);
});

// ROUTE 3: GET /energy/daily — return totals per hour
app.get('/energy/daily', (req, res) => {
  const hourlyTotals = {};
  energyData.forEach(record => {
    const hour = record.timestamp;
    if (!hourlyTotals[hour]) {
      hourlyTotals[hour] = 0;
    }
    hourlyTotals[hour] += record.energy_kwh;
  });
  const result = Object.entries(hourlyTotals).map(([timestamp, total]) => ({
    timestamp,
    total_kwh: parseFloat(total.toFixed(2))
  }));
  res.json(result);
});

// Start server
app.listen(PORT, () => {
  console.log(`Smart Energy Backend running at http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log('  GET /energy');
  console.log('  GET /energy/zone');
  console.log('  GET /energy/daily');
});
