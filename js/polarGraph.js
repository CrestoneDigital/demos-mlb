 var PolarGraph = function () {
     this.polarData = [
         {
             value: 0,
             color: "#a3e1d4",
             highlight: "#1ab394",
             label: "left Map"
        },
         {
             value: 81,
             color: "#dedede",
             highlight: "#1ab394",
             label: "Yearly Win Average"
        },
          {
             value: 0,
             color: "#dedede",
             highlight: "#1ab394",
             label: "Right Map"
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

 PolarGraph.prototype.refreshData = function (data,sectionID) {
     console.log(data);
     this.polarData[sectionID].value =  data[0].avg;
 }

 
 PolarGraph.prototype.render = function (elementID) {
     var cvs = document.getElementById(elementID)
     ctx = cvs.getContext("2d");
     var NewChart = new Chart(ctx).PolarArea(this.polarData, this.polarOptions);
 }