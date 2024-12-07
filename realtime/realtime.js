var template = this;
var model = this.ractive;
console.log(point.curVal, point.hisEnd)

function balloonFunctionCustom(graphDataItem, graph) {
  return graph.title + " : " + graphDataItem.values.value;
}


function convertRawDataToChartData(
  realPoints,
  uniqueDates,
  groupedByTime,
  index
) {
  realPoints.forEach((p) => {
    const date = moment(p.ts).format("YYYY-MM-DD");
    if (!uniqueDates.find((item) => item.id === date)) {
      uniqueDates.push({
        id: date,
        bullet: "round",
        bulletSize: 6,
        lineColor: "#191919",
        lineThickness: 2,
        valueField: "today",
        title: date,
        balloonFunction: function (graphDataItem, graph) {
          return balloonFunctionCustom(graphDataItem, graph);
        },
      });
      index++;
    }

    // Format time as "HH:mm"
    const time = moment(p.ts).format("HH:mm");

    // Initialize time group if it doesn't exist
    if (!groupedByTime[time]) {
      groupedByTime[time] = { time };
    }

    // Assign value to the corresponding day (date1 for Monday, ..., date7 for Sunday)
    groupedByTime[time]["today"] = p.v0
      ? p.v0.toFixed(2)
      : 0;
  });
}

function makeAmChart(chartElement, points, uniqueDates) {
  return AmCharts.makeChart(
    chartElement,
    {
      marginRight: 40,
      marginLeft: 40,
      autoMarginOffset: 20,
      type: "serial",
      theme: "light",
      dataProvider: points,
      categoryField: "time",
      dataDateFormat: "HH:NN",
      categoryAxis: {
        minPeriod: "mm",
        parseDates: true,
        gridAlpha: 0.1,
        axisAlpha: 0.5,
        title:
          "Figure 10: Super-imposed plot of daily chiller efficiency kW/RT",
      },
      startDuration: 1,
      chartCursor: {
        categoryBalloonDateFormat: "JJ:NN, MMMM DD",
        cursorPosition: "mouse",
      },
      trendLines: [],
      graphs: uniqueDates,
      chartCursor: {
        categoryBalloonDateFormat: "JJ:NN",
        cursorPosition: "mouse",
      },
      legend: {
        useGraphSettings: false,
      },
      export: {
        enabled: true,
        dateFormat: "YYYY-MM-DD HH:NN:SS",
      },
    },
    1000
  );
}

setTimeout(function () {
finstack.eval(
    'readAll(load and equipRef->navName == "Chiller 1").hisRead(today).hisRollupAuto(null,null).hisClip',
    function (data) {
    queryData = data.result.toObj();
    var realPoints = data.result.toObj();
    newPoints = [];
    uniqueDates = [];
    const groupedByTime = {};
    let index = 0;

    convertRawDataToChartData(
        realPoints,
        uniqueDates,
        groupedByTime,
        index
    );
    
    Object.values(groupedByTime).forEach((item) => {
        newPoints.push(item);
    });

    var chartById = AmCharts.charts.find(function(chart) {
        return chart.div.id === "amChart";
    });
    console.log("chartById", chartById)
    if (!chartById) {
        console.log("Create chart");
        amChartEle = template.view.querySelector("#amChart");
        var chart = makeAmChart(amChartEle, newPoints, uniqueDates);
    }
    else {
        console.log("Update chart")
        var chart = chartById;
        chart.dataProvider = newPoints;
        chart.validateData();
    }

    }
);
}, 200);