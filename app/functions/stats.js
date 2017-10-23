module.exports = {
    basic: function(response) {
      let userData = {};

      let serverData = JSON.parse(response);
      let data = serverData.result;

      userData.rank = {
        level: data.rank.number,
        progress: {
          current: data.rankProgress.current,
          total: data.rankProgress.total
        },
        image: data.rank.imageUrl.replace('[BB_PREFIX]', serverData.bbPrefix)
      };

      userData.stats = {
        kills: data.kills,
        deaths: data.deaths,
        roundsPlayed: (data.wins + data.losses),
        wins: data.wins,
        losses: data.losses,
        timePlayed: data.timePlayed
      };
      
      return userData;
    },
  
    detailed: function(response) {
      let userData = {};

      let serverData = JSON.parse(response);
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
            kills: null,
            score: null,
            time: null,
          },
          medic: {
            kills: null,
            score: null,
            time: null,
          },
          scout: {
            kills: null,
            score: null,
            time: null,
          },
          support: {
            kills: null,
            score: null,
            time: null,
          },
          cavalry: {
            kills: null,
            score: null,
            time: null,
          },
          tanker: {
            kills: null,
            score: null,
            time: null,
          },
          pilot: {
            kills: null,
            score: null,
            time: null,
          }
        }
      }
      
      for(var i = 0; i < data.kitStats.length; i++) {
        switch(data.kitStats[i].prettyName) {
          case 'ASSAULT': 
            userData.detailed.classes.assault.kills = data.kitStats[i].kills;
            userData.detailed.classes.assault.score = data.kitStats[i].score;
            userData.detailed.classes.assault.time = data.kitStats[i].secondsAs;
          break;
          case 'SUPPORT': 
            userData.detailed.classes.support.kills = data.kitStats[i].kills;
            userData.detailed.classes.support.score = data.kitStats[i].score;
            userData.detailed.classes.support.time = data.kitStats[i].secondsAs;
          break;
          case 'MEDIC': 
            userData.detailed.classes.medic.kills = data.kitStats[i].kills;
            userData.detailed.classes.medic.score = data.kitStats[i].score;
            userData.detailed.classes.medic.time = data.kitStats[i].secondsAs;
          break;
          case 'SCOUT': 
            userData.detailed.classes.scout.kills = data.kitStats[i].kills;
            userData.detailed.classes.scout.score = data.kitStats[i].score;
            userData.detailed.classes.scout.time = data.kitStats[i].secondsAs;
          break;
          case 'PILOT': 
            userData.detailed.classes.pilot.kills = data.kitStats[i].kills;
            userData.detailed.classes.pilot.score = data.kitStats[i].score;
            userData.detailed.classes.pilot.time = data.kitStats[i].secondsAs;
          break;
          case 'TANKER': 
            userData.detailed.classes.tanker.kills = data.kitStats[i].kills;
            userData.detailed.classes.tanker.score = data.kitStats[i].score;
            userData.detailed.classes.tanker.time = data.kitStats[i].secondsAs;
          break;
          case 'CAVALRY': 
            userData.detailed.classes.cavalry.kills = data.kitStats[i].kills;
            userData.detailed.classes.cavalry.score = data.kitStats[i].score;
            userData.detailed.classes.cavalry.time = data.kitStats[i].secondsAs;
          break;
        }
      }
      
      return userData;
    }
}