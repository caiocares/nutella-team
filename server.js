const express = require('express');
const battlefieldStats = require('battlefield-stats-express');
const app = express();
 
// Get or use your key from https://battlefieldtracker.com/site-api` 
const bfs = battlefieldStats('8f0224df-8487-486a-9e37-1e38a888ef99');

var port = process.env.PORT || 8080;        // set our port
 
app.use('/api', bfs)
app.listen(port);