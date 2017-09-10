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
    }
      
      return userData;
    }
}