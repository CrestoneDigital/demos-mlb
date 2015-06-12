MlbMap = function (settings,color) {
    this.settings = settings;
    this.layerPtr = null;
    this.sql = new cartodb.SQL({
        user: settings.user
    });
    this.cartoCssTpl= "#mlb_salaries{ marker-fill-opacity: 0.9; marker-line-color: #FFF; marker-line-width: 0.8; marker-line-opacity: 1; marker-placement: point; marker-multi-policy: largest; marker-type: ellipse; marker-fill: #136400; marker-allow-overlap: true; marker-clip: false; } #mlb_salaries [ avg_sal <= 235295219] { marker-width: 25.0; } #mlb_salaries [ avg_sal <= 127896250] { marker-width: 23.3; } #mlb_salaries [ avg_sal <= 106460833] { marker-width: 21.7; } #mlb_salaries [ avg_sal <= 94085000] { marker-width: 20.0; } #mlb_salaries [ avg_sal <= 87003192] { marker-width: 18.3; } #mlb_salaries [ avg_sal <= 78909448] { marker-width: 16.7;} #mlb_salaries [ avg_sal <= 70795921] { marker-width: 15.0; } #mlb_salaries [ avg_sal <= 60916225] { marker-width: 13.3; } #mlb_salaries [ avg_sal <= 53585000] { marker-width: 11.7; } #mlb_salaries [ avg_sal <= 42118042] { marker-width: 10.0;}";
    
    this.sqlTpl = "SELECT t.name,t.yearid, FLOOR(avg(t.salary)) as avg_sal, s.cartodb_id, s.the_geom_webmercator FROM mlb_salaries t, mlb_stadiums s WHERE t.name = s.team and yearid={{year}} group by t.name,s.cartodb_id, s.the_geom_webmercator,t.yearID order by avg_sal desc";

    this.cartoCssTpl=this.cartoCssTpl.replace('#136400', color);
};
// get year range
MlbMap.prototype.getYearRanges = function (cb) {
    var q = "SELECT min(yearId),max(yearID) FROM mlb_teams";
    this.sql.execute(q).done(function (data) {
        l = []
        data.rows.forEach(function (r) {
            console.log(r);
            l.push(r.yearID)
        });
        if (cb) {
            cb(null, data.rows);
        }
    });

}
//data for team salaries by year ascending order
MlbMap.prototype.getTeamSalaries = function (team, cb) {
    var q = "SELECT name,yearid,avg(salary) from mlb_salaries "
    q += "WHERE name = '" + team + "'";
    q += " group by yearid, name order by yearid asc"
    console.log(q);
    this.sql.execute(q).done(function (data) {
        l = []
        data.rows.forEach(function (r) {
            console.log(r);
            l.push(r.avg)
        });
        if (cb) cb(null, data.rows);
    });

}
//get team's wins for selected year
MlbMap.prototype.getTeamWins = function (team, year, cb) {
    var q = "select avg(w) from mlb_teams "
    q += "WHERE name = '" + team + "'";
    q += " and yearid = "+year;
    q += " group by yearid, name"
    console.log(q);
    this.sql.execute(q).done(function (data) {
        l = []
        data.rows.forEach(function (r) {
            console.log(r);
            l.push(r.avg)
        });
        if (cb) cb(null, data.rows);
    });

}
//get money spent per win for selcted team/year
MlbMap.prototype.getMoneyPerWin = function (team, year, cb) {
    var q = "SELECT avg(s.salary/t.w) as avg  "
    q += "FROM mlb_teams t, mlb_salaries s "
    q += "WHERE t.name = s.name and s.yearid=t.yearid and t.name= '" + team + "'";
    q += " and t.yearid = "+year;
    //q += " group by t.name, t.yearid"
    console.log(q);
    this.sql.execute(q).done(function (data) {
        data.rows.forEach(function (r) {
            console.log(r);
        });
        if (cb) cb(null, data.rows);
    });

}
//get average attendence per game for selected team/year
MlbMap.prototype.getAttPerGame = function (team, year, cb) {
    var q = "select FLOOR(avg(attendance)/81) as avg From mlb_teams  "
    q += "WHERE name= '" + team + "'";
    q += " and yearid = "+year;
    console.log(q);
    this.sql.execute(q).done(function (data) {
        data.rows.forEach(function (r) {
            console.log(r);
        });
        if (cb) cb(null, data.rows);
    });

}
//get mlb average salary
MlbMap.prototype.getMlbAvgSalary = function (cb) {
    var q = "SELECT yearid,FLOOR(avg(salary)) as avg from mlb_salaries group by yearid order by yearid asc"
    console.log(q);
    this.sql.execute(q).done(function (data) {
        data.rows.forEach(function (r) {
            console.log(r);
        });
        if (cb) cb(null, data.rows);
    });

}
//create new map for salaries
MlbMap.prototype.updateMap = function(year){
    this.layerPtr.set({
                sql: this.sqlTpl.replace('{{year}}', year),
                cartocss: this.cartoCssTpl
            });
}

MlbMap.prototype.createMap = function (year, mapName, callback) {
    var self = this;
    cartodb.createVis(mapName, 'https://crestonedigital.cartodb.com/api/v2_1/viz/75edbb9c-0ee5-11e5-8ef9-0e9d821ea90d/viz.json', {
            shareable: false,
            title: false,
            description: false,
            search: false,
            tiles_loader: true,
            center: [35, -94],
            scrollwheel: false,
            zoom: 3,
            cartodb_logo: false
        })
        .done(function (vis, layers) {
            // layer 0 is the base layer, layer 1 is cartodb layer
            // setInteraction is disabled by default
            layers[1].setInteraction(true);
            self.layerPtr = layers[1].getSubLayer(0);
           
            //this.layerPtr.setSQL(sql);
            self.layerPtr.set({
                sql: self.sqlTpl.replace('{{year}}', year),
                cartocss: self.cartoCssTpl
            });
            //console.log(sql);

            //console.log(sql);
            layers[1].on('featureOver', function (e, latlng, pos, data) {
                // cartodb.log.log(e, latlng, pos, data);
            });
            layers[1].on('featureClick', function (e, latlng, pos, data) {
                console.log(e, latlng, pos, data);
                self.trigger('featureClick', data);

            });
             if (callback) {
            callback(vis);
        }
          

        })
        .error(function (err) {
            console.log(err);
        });
}


$.EventEmitter.extend(MlbMap);