const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoClient = require('mongodb').MongoClient;

const app = express();

// Enable cross-origin resource sharing
app.use(cors());

// Parse incoming request bodies as JSON
app.use(bodyParser.json());

// Define routes
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const attendanceRecordRoutes = require('./routes/attendanceRecordRoutes');

// Set up database connection
const url = 'mongodb+srv://dateless:156414@ontime.lb54dsn.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'attendance';
mongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('Failed to connect to database:', err);
    return;
  }
  console.log('Connected to database successfully');
  const db = client.db(dbName);

  // Add routes and start the server here
  studentRoutes(app, db);
  courseRoutes(app, db);
  scheduleRoutes(app, db);
  attendanceRecordRoutes(app, db);
  app.listen(3000, () => console.log('Server listening on port 3000'));
});
