//const express = require('express');
//const battlefieldStats = require('battlefield-stats-express');
//const app = express();
// 
//// Get or use your key from https://battlefieldtracker.com/site-api` 
//const bfs = battlefieldStats('8f0224df-8487-486a-9e37-1e38a888ef99');
//
//var port = process.env.PORT || 8080;
//
//app.use('/api', bfs);
//
//// DATABASE
//var mongoose = require('mongoose');
//mongoose.connect('mongodb://teamnutella:G#6RerAV3tam@ds127034.mlab.com:27034/heroku_qg6dbqvh');
//
//
//
//
//app.get('')
//
//
// 
//
//app.listen(port);
//
//



const express = require('express');
const request = require('request');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const app = express();

const key = '8f0224df-8487-486a-9e37-1e38a888ef99';
const endpoint = "https://battlefieldtracker.com/bf1/";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// DATABASE
mongoose.connect('mongodb://teamnutella:G#6RerAV3tam@ds127034.mlab.com:27034/heroku_qg6dbqvh');

// MODELS

var Nutella     = require('./app/models/nutella');
var Member     = require('./app/models/member');



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
//    console.log(req.params.name);
  
    let userData = {};
  
    
  
    // BASIC STATS
    request({
      method: 'GET',
      url: `${endpoint}api/Stats/BasicStats?platform=2&displayName=${req.params.name}`,
      headers: {
        'TRN-Api-Key': key
      }}, function (error, response, body) {
      
      if(response.statusCode == 200) {
        
        let serverData = JSON.parse(body);
        let data = serverData.result;
      
        userData.rank = {
          level: data.rank.number,
          progress: {
            current: data.rankProgress.current,
            total: data.rankProgress.total
          }
        };
        
        userData.stats = {
          kills: data.kills,
          deaths: data.deaths,
          roundsPlayed: (data.wins + data.losses),
          wins: data.wins,
          losses: data.losses,
          timePlayed: data.timePlayed
        };
        
        // DETAIL STATS
        request({
          method: 'GET',
          url: `${endpoint}api/Stats/DetailedStats?platform=2&displayName=${req.params.name}`,
          headers: {
            'TRN-Api-Key': key
          }}, function (error, response, body) {

          if(response.statusCode == 200) {

            let serverData = JSON.parse(body);
            let data = serverData.result;

            userData.detailed = {
              flagsCaptured: data.flagsCaptured,
              flagsDefended: data.flagsDefended,
              favoriteClass: data.favoriteClass,
              dogtagsTaken: data.dogtagsTaken,
              headShots: data.headShots,
              longestHS: data.longestHeadShot,
              killAssists: data.killAssists,
              heals: data.heals,
              revives: data.revives,
              suppressionAssist: data.suppressionAssist,
              repairs: data.repairs,
              classes: {
                assault: {
                  kills: data.kitStats[0].kills,
                  score: data.kitStats[0].score,
                  time: data.kitStats[0].secondsAs,
                },
                medic: {
                  kills: data.kitStats[1].kills,
                  score: data.kitStats[1].score,
                  time: data.kitStats[1].secondsAs,
                },
                scout: {
                  kills: data.kitStats[2].kills,
                  score: data.kitStats[2].score,
                  time: data.kitStats[2].secondsAs,
                },
                support: {
                  kills: data.kitStats[3].kills,
                  score: data.kitStats[3].score,
                  time: data.kitStats[3].secondsAs,
                },
                cavalry: {
                  kills: data.kitStats[4].kills,
                  score: data.kitStats[4].score,
                  time: data.kitStats[4].secondsAs,
                },
                tanker: {
                  kills: data.kitStats[5].kills,
                  score: data.kitStats[5].score,
                  time: data.kitStats[5].secondsAs,
                },
                pilot: {
                  kills: data.kitStats[6].kills,
                  score: data.kitStats[6].score,
                  time: data.kitStats[6].secondsAs,
                }
              }
            };
          }
          res.json(userData);
        });
        
        
      }
    });
  
    
    
    
  
  });

//router.route('/member/cron')






app.get('/stats/:basic/:name', function(req, res){
  let url = null;
  switch(req.params.basic){
    case 'basic': 
      url = `${endpoint}api/Stats/BasicStats?platform=2&displayName=${req.params.name}`;
      break;
    case 'detailed':
      url = `${endpoint}api/Stats/DetailedStats?platform=2&displayName=${req.params.name}`;
  }
  
  request({
    method: 'GET',
    url: url,
    headers: {
      'TRN-Api-Key': key
    }}, function (error, response, body) {
    
    
    if(response.statusCode == 200) {
      res.json(JSON.parse(body));
      return;
    }
    
    res.json({successful: false});
  });
});


app.use('/api', router);
app.listen(port);