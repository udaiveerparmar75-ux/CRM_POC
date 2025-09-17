const express = require('express');
const routes = require('./routes');
const mongoRoutes = require('./routes/mongodb');
const db = require('./config/mysql');
const connectMongoDB = require('./config/mongodb');

const app = express();
const port = 3000;

// Connect to MongoDB
connectMongoDB();

//Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the routes
app.use('/', routes);
app.use('/', mongoRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});