const path = require('path');
const http = require('http');
const express = require('express');
const helmet = require('helmet');
const billsRoute = require('./bill.route');

const app = express();

// Handle exceptions
process.on("uncaughtException", (error) => {
    console.log(error.message, error);
});
process.on("unhandledRejection", (error) => {
    throw error;
});

// Configure express
const PORT = process.env.PORT || 3000;
app.set('port', PORT);
app.use(express.urlencoded({extended: true}));
app.use(helmet());

// Set routes
app.use('/api/bills', billsRoute);
app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname,'template','index.html')); 
});

// Create and start server
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log('Server is ready...');
});