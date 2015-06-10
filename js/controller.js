$(function () {
    var ob1 = {
        avg: 90,
        name: "j"
    };
    var ob2 = {
        avg: 150,
        name: "l"
    };
    var ob3 = {
        avg: 80,
        name: "k"
    };
    var ob4 = {
        avg: 400
    }
    var ob5 = {
        avg: 600
    }
    var ob6 = {
        avg: 24
    }
    var ob7 = {
        avg: 78
    }
    var ob8 = {
        avg: 204
    }
    var ob9 = {
        avg: 589
    }
    var oba = {
        avg: 500
    }
    var obb = {
        avg: 400
    }
    var obc = {
        avg: 350
    }
    var obd = {
        avg: 300
    }
    var obe = {
        avg: 275
    }
    var obf = {
        avg: 365
    }
    var obg = {
        avg: 498
    }
    testObject = [ob1, ob2, ob3, ob3, ob4, ob5, ob6, ob7, ob8, ob9, oba, obb, obc, obd, obe, obf, obg];
    var year1, year2;

    m = new MlbMap({
        user: 'crestonedigital'
    });





    //Create new slider
    m.getYearRanges(function (err, data) {
            $(slide).ionRangeSlider({
                type: "double",
                min: data[0].min,
                max: data[0].max,
                from: data[0].min,
                to: data[0].max,
                min_interval: 1,
                grid: true,
                grid_snap: true,
                onFinish: function (data) {
                    console.log(data);
                    graph.year1 = data.fromNumber;
                    graph.year2 = data.toNumber;
                    //draw salary graph
                    graph.drawGraph("lineChart");
                }

            })


            graph = new GraphInput(data[0].min, data[0].max);
        
        //Input year ranges
    
    //Getthis data inputted from the range function from Andrew
    //Find labels for salary graph
    lineData.labels = graph.getLabels();

    //Get data for appropriate team
    lineData.datasets[0].data = graph.getData(testObject); //Get this data handed in from Andrew

    //draw salary graph
    graph.drawGraph("lineChart");
    })
    //Draw Maps
    m.createMap(2000, 'map', function (viz) {
        var map1 = viz;
        m.createMap(2014, 'map1', function (viz) {
            var map2 = viz;
            map1.getNativeMap().sync(map2.getNativeMap());
            map2.getNativeMap().sync(map1.getNativeMap());
        })
    });

    m.on('featureClick', function (data) {
        console.log('click', data);
    });

});