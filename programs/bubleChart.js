var template = this;
var model = this.ractive;
var selectTarget = template.view.querySelector(".selectSize");
console.log(selectTarget);
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

function makeAmChart(chartElement, points) {
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
      titles: [
        {
          text: "Plant Efficiency VS Load",
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
          'readAll(navName == "PltEff" or navName == "PltHG").hisRead(' +
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

            var amChartEle = template.view.querySelector("#amChart");
            makeAmChart(amChartEle, newPoints);
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
  var start = startDateTarget.value;
  var end = endDateTarget.value;
  console.log(start, end);
  finstack.eval(
    'readAll(navName == "PltEff" or navName == "PltHG").hisRead(' +
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

      var amChartEle = template.view.querySelector("#amChart");
      makeAmChart(amChartEle, newPoints);
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
      'readAll(navName == "PltEff" or navName == "PltHG").hisRead(2024-03-20..2024-03-21)',
      function (data) {
        queryData = data.result.toObj();
        var realPoints = data.result.toObj();
        console.log("-----realPoints--------");
        console.log(realPoints);
        newPoints = [];
        convertRawDataToBubbleData(realPoints, newPoints);

        var amChartEle = template.view.querySelector("#amChart");
        makeAmChart(amChartEle, newPoints);
      }
    );
  }, 200);
  model.set("other", "Date Picker");
  model.set("start", "Start");
  model.set("end", "End");
}
