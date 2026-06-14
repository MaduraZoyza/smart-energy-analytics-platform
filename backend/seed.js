const connectDB = require('./db');
const Energy = require('./models/Energy');
const fs = require('fs');
const csv = require('csv-parser');

const seedDB = async () => {
  await connectDB();
  await Energy.deleteMany({});
  console.log('Cleared existing data');

  const records = [];

  fs.createReadStream('./data/energy.csv')
    .pipe(csv())
    .on('data', (row) => {
      records.push({
        timestamp: row.timestamp,
        zone: row.zone,
        energy_kwh: parseFloat(row.energy_kwh)
      });
    })
    .on('end', async () => {
      await Energy.insertMany(records);
      console.log(`Inserted ${records.length} records into MongoDB`);
      process.exit(0);
    });
};

seedDB();
