var GraphInput = function (year1, year2) {
    this.year1 = year1;
    this.year2 = year2;

    this.lineData = {
        labels: [],
        datasets: [
            {
                label: " Avg Salary Data",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,2)",
                pointColor: "rgba(220,220,220,.2)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: []
            },
            {
                label: "Team 1 Salary Data",
                fillColor: "rgba(168,178,189,0)",
                strokeColor: "rgba(255,0,0,1)",
                pointColor: "rgba(255,0,0,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: []
            },
            {
                label: "Team 2 Salary Data",
                fillColor: "rgba(100,100,100,0)",
                strokeColor: "rgba(0,0,255,1)",
                pointColor: "rgba(0,0,255,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(0,0,255,1)",
                data: []
            }
        ]
    };

    this.lineOptions = {
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


GraphInput.prototype.render = function (canvasId) {
    this.getLabels();
    var cvs = document.getElementById(canvasId)
    ctx = cvs.getContext("2d");
    ctx.canvas.height = 50;
    myNewChart = new Chart(ctx).Line(this.lineData, this.lineOptions);

}

GraphInput.prototype.getLabels = function () {
    var labels = [];
    var end = this.year2 - this.year1;

    for (i = 0; i <= end; i++) {
        labels[i] = Number(this.year1) + i;
        labels[i] = String(labels[i]);
    }
    this.lineData.labels= labels;
}

//passed an array of object with properties name, yearid, avg
GraphInput.prototype.getData = function (teamArray, lineID) {
    //This function works for teams that start later than 2000
    salaryArray = [];
    var end = teamArray.length - 1;
    var i = 0;
    if (teamArray[0].yearid != 2000) {
        finish = teamArray[0].yearid - 2000;
        for (j = 0; j < finish; j++) {
            salaryArray[j] = 0;
        }
        i = finish;
        end = end + i;
        teamArray = salaryArray.concat(teamArray);
    }
    for (; i <= end; i++) {
        salaryArray[i] = teamArray[i].avg;
    }
    this.lineData.datasets[lineID].data = salaryArray;
}

GraphInput.prototype.cutData = function (lineID) {
    var end = this.year2 - 2000;
    var newSalary = [];
    if (this.lineData.datasets[lineID].data.length !== 0) {
        var start = this.year1 - 2000;
        j = 0;
        for (; start <= end; start++) {
            newSalary[j] = this.lineData.datasets[lineID].data[start];
            j++;
        }
        this.lineData.datasets[lineID].data = newSalary;
    }
}

// Adds data without re-rendering the chart
GraphInput.prototype.refreshData = function (data, lineID) {
    this.getData(data, lineID);
    this.cutData(lineID);
}