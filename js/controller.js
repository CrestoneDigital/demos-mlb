$(function () {

    var colorTeam1 = {
        r: 255,
        g: 0,
        b: 0
    };
    var colorTeam2 = {
        r: 0,
        g: 0,
        b: 255
    };

    // Left Map
    var m = new MlbMap({
        user: 'crestonedigital'
    }, 'rgb(' + colorTeam1.r + ',' + colorTeam1.g + ',' + colorTeam1.b + ')', true);

    // Right Map
    var p = new MlbMap({
        user: 'crestonedigital'
    }, 'rgb(' + colorTeam2.r + ',' + colorTeam2.g + ',' + colorTeam2.b + ')', false);

    //Declarations     
    var graph = new LineGraph(undefined, undefined);
    var currentTeam1 = undefined;
    var currentTeam2 = undefined;
    previousTeam1 = null;
    previousTeam2 = null;

    //Render original polar graphs
    var polarGraph1 = new PolarGraph();
    polarGraph1.render("polar1");
    var polarGraph2 = new PolarGraph();
    polarGraph2.render("polar2");
    var polarGraph3 = new PolarGraph("polar3");
    m.getMlbMoneyPerWinYear(2000, function (err, data) {
        if (err) {} else {
            polarGraph3.refreshData(data, 1);
            polarGraph3.polarData[1].label = "Yearly Cost Per Win Average";
            polarGraph3.render("polar3");
        }
    });

    var polarGraph4 = new PolarGraph("polar4");
    m.getMlbMoneyPerWinYear(2014, function (err, data) {
        if (err) {} else {
            polarGraph4.refreshData(data, 1);
            polarGraph4.polarData[1].label = "Yearly Cost Per Win Average";
            polarGraph4.render("polar4");
        }
    });

    //Declarations     
    var graph = new LineGraph(undefined, undefined);
    var currentTeam1 = undefined;
    var currentTeam2 = undefined;

    previousTeam1 = null;
    previousTeam2 = null;

    // Create new slider
    m.getYearRanges(function (err, data) {
        // Pass year range to graph object      
        graph.year1 = data[0].min;
        graph.year2 = data[0].max;
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
                        graph.refreshData(data, 0);
                    }
                })
                m.getTeamSalaries(currentTeam1, function (err, data) {
                    if (err) {} else {
                        if (currentTeam1 !== undefined) {
                            graph.refreshData(data, 1);
                        }
                    }
                })
                m.getTeamSalaries(currentTeam2, function (err, data) {
                    if (err) {} else {
                        $(lineChart).replaceWith('<canvas id="lineChart"></canvas>');
                        if (currentTeam2 !== undefined) {
                            graph.refreshData(data, 2);
                        }
                        graph.render("lineChart");
                    }
                })

                //Re-render polar graphs
                $('#polar1').replaceWith('<canvas id="polar1"></canvas>');
                $('#polar2').replaceWith('<canvas id="polar2"></canvas>');
                $('#polar3').replaceWith('<canvas id="polar3"></canvas>');
                $('#polar4').replaceWith('<canvas id="polar4"></canvas>');

                // series for polar1
                async.series([
                    function (cb) {
                            if (currentTeam1 !== undefined) {
                                m.getTeamWins(currentTeam1, graph.year1, function (err, data) {
                                    if (!err) {
                                        polarGraph1.refreshData(data, 0);
                                    }
                                    cb();
                                });
                            } else {
                                cb();
                            }
                    },
                    function (cb) {
                            if (currentTeam2 !== undefined) {
                                p.getTeamWins(currentTeam2, graph.year1, function (err, data) {
                                    if (!err) {
                                        polarGraph1.refreshData(data, 2);
                                    }
                                    cb();
                                });
                            } else {
                                cb();
                            }
                    }
                ],
                    function (err, results) {
                        polarGraph1.render('polar1');

                    });


                //series for polar 2
                async.series([
                    function (cb) {
                            if (currentTeam1 !== undefined) {
                                m.getTeamWins(currentTeam1, graph.year2, function (err, data) {
                                    if (!err) {
                                        polarGraph2.refreshData(data, 0);
                                    }
                                    cb();

                                });
                            } else {
                                cb();
                            }
                    },
                    function (cb) {
                            if (currentTeam2 !== undefined) {
                                p.getTeamWins(currentTeam2, graph.year2, function (err, data) {
                                    if (!err) {
                                        polarGraph2.refreshData(data, 2);
                                    }
                                    cb();
                                });
                            } else {
                                cb();
                            }
                    }
                ],
                    function (err, results) {
                        polarGraph2.render('polar2');
                    });

                //series for polar 3
                async.series([
                    function (cb) {

                            m.getMlbMoneyPerWinYear(graph.year1, function (err, data) {
                                if (!err) {
                                    polarGraph3.refreshData(data, 1);
                                }
                                cb();

                            });
                    },

                     function (cb) {
                            if (currentTeam1 !== undefined) {
                                m.getMoneyPerWin(currentTeam1, graph.year1, function (err, data) {
                                    if (!err) {
                                        polarGraph3.refreshData(data, 0);
                                    }
                                    cb();

                                });
                            } else {
                                cb();
                            }
                    },
                    function (cb) {
                            if (currentTeam1 !== undefined) {
                                p.getMoneyPerWin(currentTeam2, graph.year1, function (err, data) {
                                    if (!err) {
                                        polarGraph3.refreshData(data, 2);
                                    }
                                    cb();

                                });
                            } else {
                                cb();
                            }
                    }
                ],
                    function (err, results) {
                        polarGraph3.render('polar3');
                    });


                // series for polar4
                async.series([
                    function (cb) {
                            m.getMlbMoneyPerWinYear(graph.year2, function (err, data) {
                                if (!err) {
                                    polarGraph4.refreshData(data, 1);
                                }
                                cb();
                            });
                    },
                                      function (cb) {
                            if (currentTeam1 !== undefined) {
                                p.getMoneyPerWin(currentTeam1, graph.year2, function (err, data) {
                                    if (!err) {
                                        polarGraph4.refreshData(data, 0);
                                    }
                                    cb();

                                });
                            } else {
                                cb();
                            }
                    },
                                                          function (cb) {
                            if (currentTeam1 !== undefined) {
                                p.getMoneyPerWin(currentTeam2, graph.year2, function (err, data) {
                                    if (!err) {
                                        polarGraph4.refreshData(data, 2);
                                    }
                                    cb();

                                });
                            } else {
                                cb();
                            }
                    }
                ],
                    function (err, results) {
                        polarGraph4.render('polar4');

                    });
            }
        })
    })


    //Render original lineGraph
    m.getMlbAvgSalary(function (err, data) {
        if (err) {} else {
            //draw salary graph
            graph.refreshData(data, 0);
            graph.render("lineChart");
        }
        //Draw Maps
        m.createMap(graph.year1, 'map', function (viz) {
            var map1 = viz;
            p.createMap(graph.year2, 'map1', function (viz) {
                var map2 = viz;
                map1.getNativeMap().sync(map2.getNativeMap());
                map2.getNativeMap().sync(map1.getNativeMap());
            })
        })
    })

    //Left map onclick function
    m.on('featureClick', function (data) {
        $('#team1').removeClass(previousTeam1);
        currentTeam1 = data.name;
        $('#team1').html(currentTeam1);
        $('#team1').addClass(data.name.toLowerCase().replace(/\ /g, '-').replace(/\./g, ""));
        previousTeam1 = data.name.toLowerCase().replace(/\ /g, '-').replace(/\./g, "");
        m.getTeamSalaries(data.name, function (err, data) {
            if (err) {} else {
                graph.refreshData(data, 1);
            }
            m.getTeamWins(currentTeam1, graph.year1, function (err, data) {
                if (err) {} else {
                    polarGraph1.refreshData(data, 0)
                    $('#polar1').replaceWith('<canvas id="polar1"></canvas>');
                    polarGraph1.render('polar1');
                }
                m.getTeamWins(currentTeam1, graph.year2, function (err, data) {
                    if (err) {} else {
                        polarGraph2.refreshData(data, 0)
                        $('#polar2').replaceWith('<canvas id="polar2"></canvas>');
                        polarGraph2.render('polar2');
                    }
                    m.getMoneyPerWin(currentTeam1, graph.year1, function (err, data) {
                        if (err) {} else {
                            polarGraph3.polarData[0].label = "Team Cost Per Win";
                            polarGraph3.refreshData(data, 0);
                            $('#polar3').replaceWith('<canvas id="polar3"></canvas>');
                            polarGraph3.render('polar3');
                        }
                        m.getMoneyPerWin(currentTeam1, graph.year2, function (err, data) {
                            if (err) {} else {
                                polarGraph4.polarData[0].label = "Team Cost Per Win";
                                polarGraph4.refreshData(data, 0);
                                $('#polar4').replaceWith('<canvas id="polar4"></canvas>');
                                polarGraph4.render('polar4');
                            }
                            m.getMlbAvgSalary(function (err, data) {
                                if (err) {} else {
                                    graph.refreshData(data, 0);
                                    //Create new html canvas element for linechart
                                    $(lineChart).replaceWith('<canvas id="lineChart"></canvas>');
                                    //Draw map on new canvas element for linechart
                                    graph.render("lineChart");
                                }
                            })
                        })
                    })
                })
            })
        })
    })

    //Right Map onclick functions
    p.on('featureClick', function (data) {
        $('#team2').removeClass(previousTeam2);
        currentTeam2 = data.name;
        $('#team2').html(currentTeam2);
        $('#team2').addClass(data.name.toLowerCase().replace(/\ /g, '-').replace(/\./g, ""));
        previousTeam2 = data.name.toLowerCase().replace(/\ /g, '-').replace(/\./g, "");
        p.getTeamSalaries(data.name, function (err, data) {
            if (err) {} else {
                $(lineChart).replaceWith('<canvas id="lineChart"></canvas>');
                graph.refreshData(data, 2);
            }
            p.getTeamWins(currentTeam2, graph.year1, function (err, data) {
                if (err) {} else {
                    polarGraph1.refreshData(data, 2)
                    $('#polar1').replaceWith('<canvas id="polar1"></canvas>');
                    polarGraph1.render('polar1');
                }
                p.getTeamWins(currentTeam2, graph.year2, function (err, data) {
                    if (err) {} else {
                        polarGraph2.refreshData(data, 2)
                        $('#polar2').replaceWith('<canvas id="polar2"></canvas>');
                        polarGraph2.render('polar2');
                    }

                    p.getMoneyPerWin(currentTeam2, graph.year1, function (err, data) {
                        if (err) {} else {
                            polarGraph3.polarData[0].label = "Team Cost Per Win";
                            polarGraph3.refreshData(data, 2);
                            $('#polar3').replaceWith('<canvas id="polar3"></canvas>');
                            polarGraph3.render('polar3');
                        }

                        p.getMoneyPerWin(currentTeam2, graph.year2, function (err, data) {
                            if (err) {} else {
                                polarGraph4.polarData[0].label = "Team Cost Per Win";
                                polarGraph4.refreshData(data, 2);
                                $('#polar4').replaceWith('<canvas id="polar4"></canvas>');
                                polarGraph4.render('polar4');
                            }

                            p.getMlbAvgSalary(function (err, data) {
                                if (err) {} else {
                                    graph.refreshData(data, 0);
                                    //Create new html canvas element for linechart
                                    $(lineChart).replaceWith('<canvas id="lineChart"></canvas>');
                                    //Draw map on new canvas element for linechart
                                    graph.render("lineChart");
                                }
                            })
                        })
                    })
                })
            })
        })
    })
})