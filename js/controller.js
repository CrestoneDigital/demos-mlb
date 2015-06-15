$(function () {

    // Left Map
    var m = new MlbMap({
        user: 'crestonedigital'
    }, '#B81609');

    // Right Map
    var p = new MlbMap({
        user: 'crestonedigital'
    }, '#3E7BB6');

    //draw polar area graph1
    var polarGraph1 = new PolarGraph();
    polarGraph1.render("polar1");

    //draw polar area graph2
    var polarGraph2 = new PolarGraph();
    polarGraph2.render("polar2");

    //Declarations     
    var graph = new LineGraph(undefined, undefined);
    var currentTeam1 = undefined;
    var currentTeam2 = undefined;

    graph = null;
    globalAvgSalary = null;
    
    previousTeam1=null;
    previousTeam2=null;
    
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

                        m.getTeamSalaries(currentTeam1, function (err, data) {
                            if (err) {} else {
                                if (currentTeam1 !== undefined) {
                                    graph.refreshData(data, 1);
                                }
                            }
                            m.getTeamSalaries(currentTeam2, function (err, data) {
                                if (err) {} else {
                                    //Create new html canvas elements
                                    $(lineChart).replaceWith('<canvas id="lineChart"></canvas>');
                                    if (currentTeam2 !== undefined) {
                                        graph.refreshData(data, 2);
                                    }
                                    graph.render("lineChart");

                                    //Re-render polar graphs
                                    $('#polar1').replaceWith('<canvas id="polar1"></canvas>');
                                    $('#polar2').replaceWith('<canvas id="polar2"></canvas>');
                                    
                                    m.getTeamWins(currentTeam1, graph.year1, function (err, data) {
                                        if (currentTeam1 !== undefined) {
                                            console.log('Left Graph Slider release '+data)
                                            polarGraph1.refreshData(data, 0);
                                        }
                                            polarGraph1.render('polar1');
                                        
                                        p.getTeamWins(currentTeam2, graph.year2, function (err, data) {
                                            if (currentTeam2 !== undefined) {
                                                console.log('Right Graph Slider release' +data);
                                                polarGraph2.refreshData(data, 0);
                                            }
                                            polarGraph2.render('polar2');
                                        })
                                    })
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
                graph.refreshData(data, 0);
                graph.render("lineChart");

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
                    $('#team1').removeClass(previousTeam1);
                    currentTeam1=data.name;
                    $('#team1').html(currentTeam1);
                    $('#team1').addClass(data.name.toLowerCase().replace(/\ /g, '-'));
                    previousTeam1=data.name.toLowerCase().replace(/\ /g, '-');
                    m.getTeamSalaries(data.name, function (err, data) {
                        if (err) {} else {
                            console.log(data);
                            graph.refreshData(data, 1);

                            m.getTeamWins(currentTeam1, graph.year1, function (err, data) {
                                if (err) {} else {
                                    console.log("Left Map click "+data);
                                    polarGraph1.refreshData(data, 0)

                                    m.getMoneyPerWin(currentTeam1, graph.year1, function (err, data) {
                                        if (err) {} else {
                                            //Create new html canvas element for polar data
                                            $('#polar1').replaceWith('<canvas id="polar1"></canvas>');
                                            //Draw polar graph on new canvas element
                                            polarGraph1.render('polar1');


                                            m.getMlbAvgSalary(function (err, data) {
                                                if (err) {} else {
                                                    graph.refreshData(data, 0);
                                                    //Create new html canvas element for linechart
                                                    $(lineChart).replaceWith('<canvas id="lineChart"></canvas>');
                                                    //Draw map on new canvas element for linechart
                                                    graph.render("lineChart");

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
                    $('#team2').removeClass(previousTeam2);
                    currentTeam2=data.name;
                    $('#team2').html(currentTeam2);
                    $('#team2').addClass(data.name.toLowerCase().replace(/\ /g, '-'));
                    previousTeam2=data.name.toLowerCase().replace(/\ /g, '-');
                    p.getTeamSalaries(data.name, function (err, data) {
                        if (err) {} else {
                            //Create new html canvas element
                            $(lineChart).replaceWith('<canvas id="lineChart"></canvas>');
                            //Draw map on new canvas element
                            graph.refreshData(data, 2);
//getTeamWins has an error with toronto and also needs to return 0 instead of undefined if the year doesn't exist (nationals)
                            p.getTeamWins(currentTeam2, graph.year2, function (err, data) {
                                if (err) {} else {
                                    console.log('right click'+data);
                                    polarGraph2.refreshData(data, 0)

                                    p.getMoneyPerWin(currentTeam2, graph.year2, function (err, data) {
                                        if (err) {} else {
                                            //Create new html canvas element for polar data
                                            $('#polar2').replaceWith('<canvas id="polar2"></canvas>');
                                            //Draw polar graph on new canvas element
                                            polarGraph2.render('polar2');

                                            p.getMlbAvgSalary(function (err, data) {
                                                if (err) {} else {
                                                    graph.refreshData(data, 0);
                                                    //Create new html canvas element for linechart
                                                    $(lineChart).replaceWith('<canvas id="lineChart"></canvas>');
                                                    //Draw map on new canvas element for linechart
                                                    graph.render("lineChart");


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