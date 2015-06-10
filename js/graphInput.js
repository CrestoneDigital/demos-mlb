var GraphInput = function(year1,year2){
    this.year1 = year1;
    this.year2 = year2;
    
        lineData = {
        labels: [],
        datasets: [
            {
                label: "Example dataset",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: []
            }]
    };

        lineOptions = {
        scaleShowGridLines: true,
        scaleGridLineColor: "rgba(0,0,0,.05)",
        scaleGridLineWidth: 1,
        bezierCurve: true,
        bezierCurveTension: 0.4,
        pointDot: true,
        pointDotRadius: 4,
        pointDotStrokeWidth: 1,
        pointHitDetectionRadius: 20,
        datasetStroke: true,
        datasetStrokeWidth: 2,
        datasetFill: true,
        responsive: true,
    };
};

GraphInput.prototype.getLabels = function(){
    var labels=[];
    var end = this.year2-this.year1;
    
    for(i=0;i<=end;i++){
        labels[i]=Number(this.year1)+i; 
        labels[i]=String(labels[i]);
    }
    return labels;
}
        
GraphInput.prototype.drawGraph = function(canvasId){
        var cvs = document.getElementById(canvasId)
        ctx=cvs.getContext("2d");
        myNewChart = new Chart(ctx).Line(lineData, lineOptions);
        
}
//passed an array of object with properties name, yearid, avg
GraphInput.prototype.getData = function(teamArray){
    var salaryArray=[];
    var end = this.year2-this.year1;
    for(i=0; i<=end;i++){
        salaryArray[i]=teamArray[i].avg;
    }
    return salaryArray;
}