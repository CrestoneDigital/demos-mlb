$(function () {
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
              
              //Create new html canvas element
              $(lineChart).replaceWith('<canvas id="lineChart"></canvas>');
              //Truncate data to appropriate years
              lineData.datasets[0].data=graph.cutData();
              //Draw map on new canvas element
              graph.drawGraph("lineChart");
              
              //Add code to make the maps switch to appropriate years

          }

      })
        // Create Graph Object        
        graph = new GraphInput(data[0].min, data[0].max);

        //Get starting data for entire league
        m.getMlbAvgSalary(function (err, data) {
            if (err) {} else {
                console.log(data);
                lineData.datasets[0].data = graph.getData(data);

                //draw salary graph
                graph.drawGraph("lineChart");

                //Draw Maps
                m.createMap(graph.year1, 'map', function (viz) {
                    var map1 = viz;
                    m.createMap(graph.year2, 'map1', function (viz) {
                        var map2 = viz;
                        map1.getNativeMap().sync(map2.getNativeMap());
                        map2.getNativeMap().sync(map1.getNativeMap());

                        //Map Click Function
                        m.on('featureClick', function (data) {
                            console.log('click', data.name);
                            m.getTeamSalaries(data.name, function (err, data) {
                                if (err) {} else {
                                    console.log('click2', data);
                                    lineData.datasets[0].data = graph.getData(data);
                                    //Create new html canvas element
                                    $(lineChart).replaceWith('<canvas id="lineChart"></canvas>');
                                    //Draw map on new canvas element
                                    graph.drawGraph("lineChart");

                                }
                            })
                        });
                    })
                });
            }
        })
    })

})