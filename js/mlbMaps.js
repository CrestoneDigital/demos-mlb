MlbMap = function (settings) {
    this.settings = settings;
    this.sql = new cartodb.SQL({
        user: settings.user
    });

};

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

MlbMap.prototype.createMap = function (year, mapName, callback) {
    var self = this;
    cartodb.createVis(mapName, 'https://crestonedigital.cartodb.com/api/v2_1/viz/75edbb9c-0ee5-11e5-8ef9-0e9d821ea90d/viz.json', {
            shareable: false,
            title: false,
            description: false,
            search: false,
            tiles_loader: true,
            center: [39, -94],
            scrollwheel: false,
            zoom: 3
        })
        .done(function (vis, layers) {
            // layer 0 is the base layer, layer 1 is cartodb layer
            // setInteraction is disabled by default
            layers[1].setInteraction(true);
            layerptr = layers[1];
            var sql = "SELECT t.name,t.yearid, avg(t.salary) as avg_sal, s.cartodb_id, s.the_geom_webmercator FROM mlb_salaries t, mlb_stadiums s WHERE t.name = s.team and yearid=" + year + " group by t.name,s.cartodb_id, s.the_geom_webmercator,t.yearID";
            layers[1].getSubLayer(0).setSQL(sql);
            console.log(sql);

            //console.log(sql);
            layers[1].on('featureOver', function (e, latlng, pos, data) {
                // cartodb.log.log(e, latlng, pos, data);
            });
            layers[1].on('featureClick', function (e, latlng, pos, data) {
                console.log(e, latlng, pos, data);
                self.trigger('featureClick', data);

            });

            callback(vis);

        })
        .error(function (err) {
            console.log(err);
        });
}

$.EventEmitter.extend(MlbMap);