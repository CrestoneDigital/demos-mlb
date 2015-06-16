 var PolarGraph = function () {
     this.nameLeft = "Left Map";
     this.nameRight = "Right Map";
     this.polarData = [
         {
             value: 0,
             color: "#3333ff",
             highlight: "#0000ff",
             label: this.nameLeft
        },
         {
             value: 81,
             color: "#dedede",
             highlight: "#999999",
             label: "Yearly Win Average"
        },
          {
             value: 0,
             color: "#ff3333",
             highlight: "#ff0000",
             label: this.nameRight
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
 
 PolarGraph.prototype.refreshLeftname = function (name) {
     this.nameLeft =  name;
 }
 
 PolarGraph.prototype.refreshRightname = function (name) {
     this.nameRight =  name;
 }
 
 PolarGraph.prototype.render = function (elementID) {
     var cvs = document.getElementById(elementID)
     ctx = cvs.getContext("2d");
     var NewChart = new Chart(ctx).PolarArea(this.polarData, this.polarOptions);
 }