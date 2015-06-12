 var PolarGraph = function () {
     this.polarData = [
         {
             value: 300,
             color: "#a3e1d4",
             highlight: "#1ab394",
             label: "App"
        },
         {
             value: 140,
             color: "#dedede",
             highlight: "#1ab394",
             label: "Software"
        },
         {
             value: 200,
             color: "#b5b8cf",
             highlight: "#1ab394",
             label: "Laptop"
        }
    ];
     this.polarOptions = {
         scaleShowLabelBackdrop: true,
         scaleBackdropColor: "rgba(255,255,255,0.75)",
         scaleBeginAtZero: true,
         scaleBackdropPaddingY: 1,
         scaleBackdropPaddingX: 1,
         scaleShowLine: true,
         segmentShowStroke: true,
         segmentStrokeColor: "#fff",
         segmentStrokeWidth: 2,
         animationSteps: 100,
         animationEasing: "easeOutBounce",
         animateRotate: true,
         animateScale: false,
         responsive: true,
     }
 };

PolarGraph.prototype.dataUpdate = function (team,year,elementID) {
        var finalData = undefined;
        m.getTeamWins(team, year, function (err, data) {
                if (err) {} else {
                    console.log(data);
                    finalData=data[0].avg;
                }})
        return finalData;
        }
PolarGraph.prototype.drawPolarGraph = function (elementID) {
      var cvs = document.getElementById(elementID)
        ctx = cvs.getContext("2d");
        var NewChart = new Chart(ctx).PolarArea(this.polarData, this.polarOptions);
        }