var template = this;
var model = this.ractive;
var selectTarget = template.view.querySelector(".selectSize2");
var selected = selectTarget.value;
console.log(selected);

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
        lineColor: getRandomHexColor(),
        lineThickness: 2,
        valueField: "date" + (index + 1),
        title: date,
        balloonFunction: function (graphDataItem, graph) {
          return balloonFunctionCustom(graphDataItem, graph);
        },
      });
      index++;
    }

    // Format time as "HH:mm"
    const time = moment(p.ts).format("HH:mm");
    const dayIndex = moment(p.ts).day();

    // Initialize time group if it doesn't exist
    if (!groupedByTime[time]) {
      groupedByTime[time] = { time };
      for (let i = 1; i <= 7; i++) {
        groupedByTime[time][`date${i}`] = 0;
      }
    }

    // Assign value to the corresponding day (date1 for Monday, ..., date7 for Sunday)
    groupedByTime[time][`date${dayIndex === 0 ? 7 : dayIndex}`] = p.v0
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
        finstack.eval(
          'readAll({attribute} and {query_table}).hisRead(' +
            query +
            ").hisRollupAuto(null,null).hisClip",
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

            var amChartEle = template.view.querySelector("#amChart");
            makeAmChart(amChartEle, newPoints, uniqueDates);
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
  setTimeout(function () {
    var showItem = model.queryAll("stackRactive");

    showItem.forEach(function (item) {
      var test = template.view.querySelector("#customRange");
      test.style.visibility = "hidden";
    });
  }, 200);
}
if (selected == "range") {
    var startDateTarget = template.view.querySelector("#startDate");
    var endDateTarget = template.view.querySelector("#endDate");
    var start = startDateTarget.value
    var end = endDateTarget.value
    console.log(start, end)
  finstack.eval(
    'readAll(power and connRef->dis=="Chiller 1 ").hisRead(' +
      start +
      ".." +
      end +
      ").hisRollupAuto(null,null).hisClip",
    function (data) {
      queryData = data.result.toObj();
      var realPoints = data.result.toObj();
      newPoints = [];
      uniqueDates = [];
      const groupedByTime = {};
      let index = 0;
      convertRawDataToChartData(realPoints, uniqueDates, groupedByTime, index);
      Object.values(groupedByTime).forEach((item) => {
        newPoints.push(item);
      });

      var amChartEle = template.view.querySelector("#amChart");
      makeAmChart(amChartEle, newPoints, uniqueDates);
    }
  );
} else {
  setTimeout(function () {
    var showItem = model.queryAll("stackRactive");

    showItem.forEach(function (item) {
      var test = template.view.querySelector("#customRange");

      test.style.visibility = "hidden";
    });
  }, 200);
  setTimeout(function () {
    finstack.eval(
      'readAll(power and connRef->dis=="Chiller 1 ").hisRead(' +
        selected +
        ").hisRollupAuto(null,null).hisClip",
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

        var amChartEle = template.view.querySelector("#amChart");
        makeAmChart(amChartEle, newPoints, uniqueDates);
      }
    );
  }, 200);
  model.set("other", "Date Picker");
  model.set("start", "Start");
  model.set("end", "End");
}
