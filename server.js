const express = require('express');
const request = require('request');
const mongoose = require('mongoose');
const moment = require('moment');
let bodyParser = require('body-parser');
let rp = require('request-promise');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// DATABASE
mongoose.connect('mongodb://teamnutella:G#6RerAV3tam@ds127034.mlab.com:27034/heroku_qg6dbqvh');

// MODELS
var Nutella     = require('./app/models/nutella');
var Member     = require('./app/models/member');
var Stats     = require('./app/models/stats');

// FUNCTIONS
var stats     = require('./app/functions/stats');

const key = '8f0224df-8487-486a-9e37-1e38a888ef99';
const endpoint = "https://battlefieldtracker.com/bf1/";

// ROUTES
var router = express.Router();

/* NUTELLA */
router.route('/nutella')
  .post(function(req, res) {
    let nut = new Nutella();
  
    nut.name = req.body.psnname;
    nut.position = req.body.position;

    // save the member
    nut.save(function(err) {
      if (err){res.send(err);}      
      res.json({ message: 'Member created!' });
    });
  })

  .get(function(req, res) {
    Nutella.find(function(err, response) {
      if (err) {
        res.send(err);
      }    
    
      res.json(response);
    });
  });

/* SPECIFY MEMBER */
router.route('/member/:name')
  .get(function(req, res){
  
    var options = {
      basic: {
        method: 'GET',
        url: `${endpoint}api/Stats/BasicStats?platform=2&displayName=${req.params.name}`,
        headers: {
          'TRN-Api-Key': key
        }
      },
      detailed: {
        method: 'GET',
        url: `${endpoint}api/Stats/DetailedStats?platform=2&displayName=${req.params.name}`,
        headers: {
          'TRN-Api-Key': key
        }
      }
    }
    
    var user = [];
    
    var basic = rp(options.basic).then(function(response){
      user.push(stats.basic(response));
    });
  
    var detailed = rp(options.detailed).then(function(response){
       user.push(stats.detailed(response));
    });
  
    Promise.all([basic, detailed]).then(function(results) {
      res.json(user);
    });
  });

router.route('/cron')
  .get(function(req, res){
    var query = Nutella.find({});
    query.exec(function (err, nutellas) {
      if(nutellas.length){
        
        (async function loop() {
          for(let i = 0; i < nutellas.length; i++) {
              
            var options = {
              method: 'GET',
              url: `${endpoint}api/Stats/BasicStats?platform=2&displayName=${nutellas[i].name}`,
              headers: {
                'TRN-Api-Key': key
              }
            }
              
            await 
              rp(options).then(function(response){
                var server = JSON.parse(response);
                if(server.successful){
                  let data = stats.basic(response);
                  let userStats = new Stats();
                  userStats.date = moment(new Date()).format("YYYY/MM/DD");
                  userStats.user.userId = nutellas[i]._id;
                  userStats.user.name = nutellas[i].name;
                  userStats.user.kills = data.stats.kills;
                  userStats.user.deaths = data.stats.deaths;
                  
                  userStats.save(function(err) {
                    if (err){res.send(err);}      
                  });
                  
                }
              }).catch(function(err){
                
              });
              
              if(i == (nutellas.length - 1)){

                res.json('stats created');

              }
            }
        })();
      }      
    });
  });

router.route('/cron/delete')
  .get(function(req, res){
    var deleteDates = moment(new Date()).subtract(5, 'd');
  
    var remove = Stats.remove({ "date" : deleteDates });
    remove.exec();
    res.json('stats removed');
  });


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api', router);

var port = process.env.PORT || 8080;
app.listen(port);