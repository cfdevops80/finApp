var template = this;
var model = this.ractive;
var selectTarget = template.view.querySelector(".selectSize");
console.log(selectTarget);
var selected = selectTarget.value;
console.log(selected);


var chartDataTarget = template.view.querySelector("#chartQuery");
var chartData = JSON.parse(chartDataTarget.value);
console.log("chartDate:",  chartData);

var chartObjects = JSON.parse(model.get("chart")).filter(x=> x.type == 'buble')
console.log(chartObjects)

const amChart = template.view.querySelector("#amCharts");
console.log(amChart)
if (amChart) {
  chartObjects.forEach(obj => {
      const chartId = "chart" + obj.value;
      const existingChart = amChart.querySelector(`[id="chart${obj.value}"]`)
      if (!existingChart) {
          const newChartDiv = document.createElement("div");
          newChartDiv.id = chartId;
          amChart.appendChild(newChartDiv); 
          const applyHtmlEle = amChart.querySelector(`[id="chart${obj.value}"]`)
          applyHtmlEle.style = "width: 100%; height: 90%; margin-top: 20px; overflow: visible; text-align: left;"
          applyHtmlEle.classList.add("wrapper-chart")
          console.log(applyHtmlEle)
          console.log(obj)
          renderBubbleChart( obj, applyHtmlEle)
      }else {
        renderBubbleChart( obj, existingChart)
      }
  });
}


function balloonFunctionCustom(graphDataItem, graph) {
  return graph.title + " : " + graphDataItem.values.value;
}

function getRandomHexColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}

function convertRawDataToBubbleData(realPoints, filteredPoints) {
  realPoints.forEach((p) => {
    if (p.v0 && p.v1) {
      filteredPoints.push({
        ts: p.ts,
        x: p.v0,
        y: p.v1,
        value: 1,
      });
    }
  });
}

function makeAmChart(chartElement, points, chartTitle) {
  console.log("-----points--------");
  console.log(points)
  return AmCharts.makeChart(
    chartElement,
    {
      marginLeft: 46,
      marginBottom: 35,
      type: "xy",
      theme: "none",
      dataProvider: points,
      chartCursor: {
        zoomable: true,
        categoryBalloonEnabled: true,
        cursorAlpha: 0.1,
        categoryBalloonDateFormat: "JJ:NN, MMMM DD",
        cursorPosition: "mouse",
        fullWidth: false,
      },
      chartScrollbar: {
        enabled: true, 
        scrollbarHeight: 20,
        backgroundAlpha: 0.1,
        selectedBackgroundAlpha: 0.3,
        selectedBackgroundColor: "#888888",
        graphFillAlpha: 0,
        graphLineAlpha: 0.5,
        selectedGraphLineAlpha: 1,
        selectedGraphFillAlpha: 0,
      },
      titles: [
        {
          text: chartTitle ?? "Plant Efficiency VS Load",
          size: 24,
        },
      ],
      valueAxes: [
        {
          position: "bottom",
          axisAlpha: 0,
          title: "Cooling Load (RT)",
        },
        {
          minMaxMultiplier: 1.2,
          axisAlpha: 0,
          position: "left",
          maximum: 1,
          minimum: 0,
          title: "kW/RT",
        },
      ],
      graphs: [
        {
          balloonFunction: function (graphDataItem, graph) {
            var value1 = graphDataItem.values.x;
            var value2 = graphDataItem.values.y;
            return `${value1} RT <br> ${value2} kW/RT`;
          },
          bullet: "circle",
          bulletBorderAlpha: 0.2,
          bulletAlpha: 0.8,
          lineAlpha: 0,
          fillAlphas: 0,
          valueField: "value",
          xField: "x",
          yField: "y",
          maxBulletSize: 10,
        },
      ],
      export: {
        enabled: true,
      },
    },
    1000
  );
}



function renderBubbleChart(x,y){
  if (selected == "other") {
    top.app.ShowCalendar(
      null,
      function (data) {
        start = moment(data.range.start).format("YYYY-MM-DD");
        var startPretty = new moment(start).format("MMM D, YYYY");
        end = moment(data.range.end).format("YYYY-MM-DD");
        var endPretty = new moment(end).format("MMM D, YYYY");
        var query = "";
        if (start == end) {
          query = start;
        } else {
          query = start + ".." + end;
        }
        var prettyDate = "";
        if (startPretty == endPretty) {
          prettyDate = startPretty;
        } else {
          prettyDate = startPretty + " to " + endPretty;
        }
        setTimeout(function () {
          console.log(          "readAll(" +
            x['query'] +
            ").hisRead(" +
              query +
              ")")
          finstack.eval(
            "readAll(" +
            x['query'] +
            ").hisRead(" +
              query +
              ")",
            function (data) {
              queryData = data.result.toObj();
              var realPoints = data.result.toObj();
              console.log("-----realPoints--------");
              console.log(realPoints);
              newPoints = [];
              let index = 0;
  
              convertRawDataToBubbleData(realPoints, newPoints);
  
              makeAmChart(y, newPoints, x['title']);
            }
          );
        }, 200);
  
        model.set("other", prettyDate);
        model.set("start", "Start");
        model.set("end", "End");
        selected = start;
      },
      { periods: true }
    );
    model.fire("hideInfo")
  }
  else if (selected == "range") {
    var startDateTarget = template.view.querySelector("#startDate");
    var endDateTarget = template.view.querySelector("#endDate");
    var start = startDateTarget.value;
    var end = endDateTarget.value;
    console.log(start, end);
    console.log("readAll(" +  
        x['query'] +
        ").hisRead(" +
        start +
        ".." +
        end +
        ")")
    finstack.eval(
        "readAll(" +  
        x['query'] +
        ").hisRead(" +
        start +
        ".." +
        end +
        ")",
      function (data) {
        queryData = data.result.toObj();
        var realPoints = data.result.toObj();
        console.log("-----realPoints--------");
        console.log(realPoints);
        newPoints = [];
        convertRawDataToBubbleData(realPoints, newPoints);
  
        makeAmChart(y, newPoints , x['title']);
      }
    );
  } else {
    model.fire("hideInfo")
    setTimeout(function () {
    console.log( "readAll(" +  
      x['query'] +
      ").hisRead(2024-03-20..2024-03-21)")
    finstack.eval(
        "readAll(" +  
        x['query'] +
        ").hisRead(2024-03-20..2024-03-21)",
        function (data) {
          queryData = data.result.toObj();
          var realPoints = data.result.toObj();
          console.log("-----realPoints--------");
          console.log(realPoints);
          newPoints = [];
          convertRawDataToBubbleData(realPoints, newPoints);
          makeAmChart(y, newPoints, x['title']);
        }
      );
    }, 200);
    model.set("other", "Date Picker");
    model.set("start", "Start");
    model.set("end", "End");
  }
}