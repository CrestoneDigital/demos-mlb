$(function() {
    //Get year data from a max/min year range sql query function
    graph=new GraphInput("2000","2015");
    lineData.labels=graph.getLabels();
    graph.drawGraph("lineChart");
    m = new MlbMap({user: 'crestonedigital'});
    m.createMap(2001,'map');
    m.on('featureClick',function(data) {
        console.log('click',data);
    });
});