$(function () {
    m = new MlbMap({
        user: 'crestonedigital'
    }, '#B81609');

    p = new MlbMap({
        user: 'crestonedigital'
    }, '#3E7BB6');

    //draw polar area graph1
    polarGraph1 = new PolarGraph();
    polarGraph1.drawPolarGraph("polar1");

    //draw polar area graph2
    polarGraph2 = new PolarGraph();
    polarGraph2.drawPolarGraph("polar2");


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
                    graph.year1 = data.fromNumber;
                    graph.year2 = data.toNumber;

                    //Create new html canvas element
                    $(lineChart).replaceWith('<canvas id="lineChart"></canvas>');
                    //Truncate data to appropriate years
                    lineData.datasets[0].data = graph.cutData();
                    //Draw map on new canvas element
                    graph.drawGraph("lineChart");
                    m.updateMap(graph.year1);
                    p.updateMap(graph.year2);


                }

            })
            // Create Graph Object        
        graph = new GraphInput(data[0].min, data[0].max);

        //Get starting data for entire league
        m.getMlbAvgSalary(function (err, data) {
            if (err) {} else {
                lineData.datasets[1].data = graph.getData(data);

                //draw salary graph
                graph.drawGraph("lineChart");

                //Draw Maps
                m.createMap(graph.year1, 'map', function (viz) {
                    var map1 = viz;
                    p.createMap(graph.year2, 'map1', function (viz) {
                        var map2 = viz;
                        map1.getNativeMap().sync(map2.getNativeMap());
                        map2.getNativeMap().sync(map1.getNativeMap());
                    })
                });

                //Left map onclick function
                m.on('featureClick', function (data) {
                    m.getTeamSalaries(data.name, function (err, data) {
                        if (err) {} else {
                            console.log(data);
                            lineData.datasets[0].data = graph.getData(data);
                            //Create new html canvas element for linechart
                            $(lineChart).replaceWith('<canvas id="lineChart"></canvas>');
                            //Draw map on new canvas element for linechart
                            graph.drawGraph("lineChart");
                            
                            m.getTeamWins(data[0].name, graph.year1, function (err, data) {
                                if (err) {} else {
                                    //update polar data[1]
                                    polarGraph1.dataUpdate1(data)
                                    //Create new html canvas element for linechart
                                    $('#polar1').replaceWith('<canvas id="polar1"></canvas>');
                                    //Draw polar graph on new canvas element
                                    polarGraph1.drawPolarGraph('polar1');


                                }
                            })

                        }
                    })
                });
                //Right Map onclick functions
                p.on('featureClick', function (data) {
                    p.getTeamSalaries(data.name, function (err, data) {
                        if (err) {} else {
                            lineData.datasets[0].data = graph.getData(data);
                            //Create new html canvas element
                            $(lineChart).replaceWith('<canvas id="lineChart"></canvas>');
                            //Draw map on new canvas element
                            graph.drawGraph("lineChart");

                            p.getTeamWins(data[0].name, graph.year1, function (err, data) {
                                if (err) {} else {
                                    //update polar data[2]
                                    polarGraph1.dataUpdate2(data)
                                    //Create new html canvas element for linechart
                                    $('#polar1').replaceWith('<canvas id="polar1"></canvas>');
                                    //Draw polar graph on new canvas element
                                    polarGraph1.drawPolarGraph('polar1');


                                }
                            })

                        }
                    })
                });
            }
        })
    })
})