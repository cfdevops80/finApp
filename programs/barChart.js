var template = this;
var model = this.ractive;
var selectTarget = template.view.querySelector(".selectSize");
console.log(selectTarget);
var selected = selectTarget.value;
console.log(selected);

const ranges = [
  { min: 100, max: 200 },
  { min: 200, max: 300 },
  { min: 300, max: 400 },
  { min: 400, max: 500 },
  { min: 500, max: 600 },
  { min: 600, max: 700 },
  { min: 700, max: 800 },
  { min: 800, max: 900 },
  { min: 900, max: 1000 },
  { min: 1000, max: 1100 },
  { min: 1100, max: 1200 },
  { min: 1200, max: Infinity },
];

function calculateFrequency(ranges, data) {
  const frequency = ranges.reduce((acc, { min, max }) => {
    acc[`${min}+${max}`] = 0;
    return acc;
  }, {});

  // Count frequencies
  for (const value of data) {
    for (const { min, max } of ranges) {
      if (value.v0 >= min && value.v0 < max) {
        frequency[`${min}+${max}`]++;
        break;
      }
    }
  }

  // Calculate total frequency
  const total = Object.values(frequency).reduce((sum, count) => sum + count, 0);

  // Convert frequencies to percentages
  const percentages = {};
  for (const key in frequency) {
    percentages[key] =
      total > 0 ? ((frequency[key] / total) * 100).toFixed(2) : 0;
  }

  return percentages;
}

function convertRawDataToBarData(realPoints) {
  const mappingArr = calculateFrequency(ranges, realPoints);
  console.log("mappingArr", mappingArr);
  return ranges.map(({ min, max }) => ({
    date: max === Infinity ? `>${min}` : `${min} to <${max}`,
    data: mappingArr[`${min}+${max}`],
  }));
}

function makeAmChart(chartElement, points) {
  var xTitle =  "Cooling Load (RT)"
  var titleTarget = template.view.querySelector("#amChartXtitle");
  titleTarget.style.display = "block"
  titleTarget.innerHTML = xTitle;
  return AmCharts.makeChart(
    chartElement,
    {
      marginRight: 40,
      marginLeft: 40,
      autoMarginOffset: 20,
      type: "serial",
      theme: "light",
      dataProvider: points,
      titles: [
        {
          text: "Frequency",
          size: 24,
        },
      ],
      valueAxes: [
        {
          position: "left",
          axisAlpha: 0,
          title: "Occurrence",
        }
      ],
      gridAboveGraphs: true,
      startDuration: 1,
      graphs: [
        {
          balloonText: "[[category]]: <b>[[value]]%</b>",
          fillAlphas: 0.8,
          lineAlpha: 0.2,
          type: "column",
          valueField: "data",
        },
      ],
      chartCursor: {
        categoryBalloonEnabled: false,
        cursorAlpha: 0,
        zoomable: false,
      },
      categoryField: "date",
      categoryAxis: {
        gridPosition: "start",
        gridAlpha: 0,
        tickPosition: "start",
        tickLength: 20,
      },
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
          'readAll(navName == "PltHG").hisRead(' + query + ")",
          function (data) {
            queryData = data.result.toObj();
            var realPoints = data.result.toObj();
            newPoints = [];
            let index = 0;

            newPoints = convertRawDataToBarData(realPoints);
            console.log(realPoints, newPoints);

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
  model.fire("hideInfo")
} else if (selected == "range") {
  var startDateTarget = template.view.querySelector("#startDate");
  var endDateTarget = template.view.querySelector("#endDate");
  var start = startDateTarget.value;
  var end = endDateTarget.value;
  console.log(start, end);
  finstack.eval(
    'readAll(navName == "PltHG").hisRead(' + start + ".." + end + ")",
    function (data) {
      queryData = data.result.toObj();
      var realPoints = data.result.toObj();
      newPoints = [];
      newPoints = convertRawDataToBarData(realPoints);
      console.log(realPoints, newPoints);

      var amChartEle = template.view.querySelector("#amChart");
      makeAmChart(amChartEle, newPoints);
    }
  );
} else {
  model.fire("hideInfo")
  setTimeout(function () {
    finstack.eval(
      'readAll(navName == "PltHG").hisRead(2024-03-20..2024-03-21)',
      function (data) {
        queryData = data.result.toObj();
        var realPoints = data.result.toObj();
        newPoints = [];
        newPoints = convertRawDataToBarData(realPoints);
        console.log(realPoints, newPoints);

        var amChartEle = template.view.querySelector("#amChart");
        makeAmChart(amChartEle, newPoints);
      }
    );
  }, 200);
  model.set("other", "Date Picker");
  model.set("start", "Start");
  model.set("end", "End");
}
