var GraphInput = function (year1, year2) {
    this.year1 = year1;
    this.year2 = year2;

    this.lineData = {
        labels: this.getLabels(),
        datasets: [
            {
                label: " Avg Salary Data",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: []
            },
            {
                label: "Team 1 Salary Data",
                fillColor: "rgba(168,178,189,0.3)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: []
            },
            {
                label: "Team 2 Salary Data",
                fillColor: "rgba(100,100,100,0.3)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
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


GraphInput.prototype.render = function (data,canvasId,lineID) {
        this.lineData.datasets[lineID].data = this.getData(data);
        this.cutData(this.lineData.datasets[lineID].data);
        this.lineData.labels=this.getLabels();
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
    return labels;
}

    //passed an array of object with properties name, yearid, avg
GraphInput.prototype.getData = function (teamArray) {
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
    return salaryArray;
}

GraphInput.prototype.cutData = function () {
    var end = this.year2 - 2000;
    for (i = 0; i < 3; i++) {
        if (this.lineData.datasets[i].data.length !== 0) {
            var newSalary = [];
            var start = this.year1 - 2000;
            j = 0;
            for (; start <= end; start++) {
                newSalary[j] = this.lineData.datasets[i].data[start];
                j++;
            }
            this.lineData.datasets[i].data=newSalary
        }
    }
}