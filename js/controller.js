$(function () {

    // Left Map
    m = new MlbMap({
        user: 'crestonedigital'
    }, '#B81609');

    // Right Map
    p = new MlbMap({
        user: 'crestonedigital'
    }, '#3E7BB6');

    //draw polar area graph1
    polarGraph1 = new PolarGraph();
    polarGraph1.drawPolarGraph("polar1");

    //draw polar area graph2
    polarGraph2 = new PolarGraph();
    polarGraph2.drawPolarGraph("polar2");

    //Declarations     
    var graph = new GraphInput(undefined, undefined);
    globalAvgColor = "#859494";
    currentTeam1=undefined;
    currentTeam2=undefined;

    // Create new slider
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
            //Function fires on release of slider
            onFinish: function (data) {
                graph.year1 = data.fromNumber;
                graph.year2 = data.toNumber;
                //Re-render Maps
                m.updateMap(graph.year1);
                p.updateMap(graph.year2);
                $('.year1').html(graph.year1);
                $('.year2').html(graph.year2);

                //Re-render line Graph
                m.getMlbAvgSalary(function (err, data) {
                    if (err) {} else {
                        console.log(data);
                        graph.refreshData(data, 0);

                        //Get team1 name

                        m.getTeamSalaries(currentTeam1, function (err, data) {
                            if (err) {} else {
                                graph.refreshData(data, 1);
                            }
                            m.getTeamSalaries(currentTeam2, function (err, data) {
                                if (err) {} else {
                                    //Create new html canvas element
                                    $(lineChart).replaceWith('<canvas id="lineChart"></canvas>');
                                    graph.render(data, "lineChart", 2);
                                }
                            })
                        })
                    }
                });
            }
        })

        // Pass year range to graph object      
        graph.year1 = data[0].min;
        graph.year2 = data[0].max;

        //Render original lineGraph
        m.getMlbAvgSalary(function (err, data) {
            if (err) {} else {

                //draw salary graph
                graph.render(data, "lineChart", 0);

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
                    currentTeam1=data.name;
                    $('#team1').html(currentTeam1);
                    $('#team1').addClass(data.name.toLowerCase().replace(/\ /g, '-'));
                    m.getTeamSalaries(data.name, function (err, data) {
                        if (err) {} else {
                            graph.refreshData(data, 1);

                            m.getTeamWins(currentTeam1, graph.year1, function (err, data) {
                                if (err) {} else {
                                    //update polar data[1]

                                    polarGraph1.polarData[0].value = polarGraph1.dataUpdate(data)

                                    m.getMoneyPerWin(currentTeam1, graph.year1, function (err, data) {
                                        if (err) {} else {
                                            console.log(data);
                                            polarGraph2.polarData[0].value = polarGraph2.dataUpdate(data)
                                                //Create new html canvas element for polar data
                                            $('#polar1').replaceWith('<canvas id="polar1"></canvas>');
                                            $('#polar2').replaceWith('<canvas id="polar2"></canvas>');
                                            //Draw polar graph on new canvas element
                                            polarGraph1.drawPolarGraph('polar1');
                                            polarGraph2.drawPolarGraph('polar2');

                                            m.getMlbAvgSalary(function (err, data) {
                                                if (err) {} else {
                                                    console.log(data);
                                                    //Create new html canvas element for linechart
                                                    $(lineChart).replaceWith('<canvas id="lineChart"></canvas>');
                                                    //Draw map on new canvas element for linechart
                                                    graph.render(data, "lineChart", 0);

                                                }
                                            })
                                        }
                                    })

                                }
                            })

                        }
                    })
                });
                //Right Map onclick functions
                p.on('featureClick', function (data) {
                    currentTeam2=data.name;
                    $('#team2').html(currentTeam2);
                    $('#team2').addClass(data.name.toLowerCase().replace(/\ /g, '-'));
                    p.getTeamSalaries(data.name, function (err, data) {
                        if (err) {} else {
                            //Create new html canvas element
                            $(lineChart).replaceWith('<canvas id="lineChart"></canvas>');
                            //Draw map on new canvas element
                            graph.refreshData(data, 2);

                            p.getTeamWins(currentTeam2, graph.year1, function (err, data) {
                                if (err) {} else {
                                    //update polar data[2]
                                    polarGraph1.polarData[2].value = polarGraph1.dataUpdate(data)

                                    p.getMoneyPerWin(currentTeam2, graph.year2, function (err, data) {
                                        if (err) {} else {
                                            console.log(data);
                                            polarGraph2.polarData[2].value = polarGraph2.dataUpdate(data)
                                                //Create ne html canvas element
                                            $('#polar1').replaceWith('<canvas id="polar1"></canvas>');
                                            $('#polar2').replaceWith('<canvas id="polar2"></canvas>');
                                            //Draw polar graph on new canvas element
                                            polarGraph1.drawPolarGraph('polar1');
                                            polarGraph2.drawPolarGraph('polar2');

                                            p.getMlbAvgSalary(function (err, data) {
                                                if (err) {} else {
                                                    console.log(data);
                                                    //Create new html canvas element for linechart
                                                    $(lineChart).replaceWith('<canvas id="lineChart"></canvas>');
                                                    //Draw map on new canvas element for linechart
                                                    graph.render(data, "lineChart", 0);

                                                }
                                            })

                                        }
                                    })
                                }
                            })

                        }
                    })
                });
            }
        })
    })
})