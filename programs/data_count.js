var template = this;
var model = this.ractive;
// var selectTarget = template.view.querySelector(".selectSize");
// console.log(selectTarget);
// var selected = selectTarget.value;
// console.log(selected);
var selected = "today" 

// var chartObjects = JSON.parse(model.get("chart")).filter(x=> x.type == 'bar')
// console.log(chartObjects)
var chartObjects = [{
    title: "Histogram of Cooling Load Occurrences",
    value: 2,
    query: 'navName == "PltHBPercent"',
    type: "bar"
  }]

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
          renderBarCharts( obj, applyHtmlEle)
      }else {
        renderBarCharts( obj, existingChart)
      }
  });
}



const ranges = [
  { min: Infinity, max: -5 },
  { min: -5, max: -1 },
  { min: -1, max: 2 },
  { min: 2, max: 5 },
  { min: 5, max: Infinity },
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
    date: max === Infinity ? `>${min}` : (min === Infinity ? `<${max}` : `${min} to <${max}`),
    data: mappingArr[`${min}+${max}`],
  }));
}

function makeAmChart(chartElement, points) {
  // var xTitle =  "Data Count"
  // var titleTarget = template.view.querySelector("#amChartXtitle");
  // titleTarget.style.display = "block"
  // titleTarget.innerHTML = xTitle;
  return AmCharts.makeChart(
    chartElement,
    {
      marginRight: 40,
      marginLeft: 40,
      autoMarginOffset: 20,
      type: "serial",
      theme: "light",
      dataProvider: points,
      rotate: true,
      // titles: [
      //   {
      //     text: "Frequency",
      //     size: 24,
      //   },
      // ],
      valueAxes: [
        {
          position: "left",
          axisAlpha: 0,
          title: "Data Count",
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

function renderBarCharts(x,y) {
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
            `readAll(${x.query}).hisRead(${query})`,
            function (data) {
              queryData = data.result.toObj();
              var realPoints = data.result.toObj();
              newPoints = [];
              let index = 0;
  
              newPoints = convertRawDataToBarData(realPoints);
              console.log(realPoints, newPoints);
  
              makeAmChart(y, newPoints);
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
      "readAll(" + x['query'] + ").hisRead(" + start + ".." + end + ")",
      function (data) {
        queryData = data.result.toObj();
        var realPoints = data.result.toObj();
        newPoints = [];
        newPoints = convertRawDataToBarData(realPoints);
        console.log(realPoints, newPoints);
  
        makeAmChart(y, newPoints);
      }
    );
  } else {
    model.fire("hideInfo")
    setTimeout(function () {
      finstack.eval(
        "readAll(" +  
        x['query'] +
        ").hisRead(2024-03-20..2024-03-21)",
        function (data) {
          queryData = data.result.toObj();
          var realPoints = data.result.toObj();
          newPoints = [];
          newPoints = convertRawDataToBarData(realPoints);
          console.log(realPoints, newPoints);
  
          makeAmChart(y, newPoints);
        }
      );
    }, 200);
    model.set("other", "Date Picker");
    model.set("start", "Start");
    model.set("end", "End");
  }
}




