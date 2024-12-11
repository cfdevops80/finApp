this.ractive.fire("obtainData");
var template = this;
var model = this.ractive;
var myTarget = model.queryAll("targetPoint");
var title = myTarget.idDis;
var newPoints = [];
var uniqueDates = [];
var selected = "thisWeek";
var start = "Start";
var end = "End";

var eventMappingName = {
  "line": "changeLineChart",
  "buble": "changeBubleChart",
  "bar": "changeBarChart",
}
var eventName = eventMappingName["line"]

var classMappingName = {
  "line": "selectLineChartType",
  "buble": "selectBarChartType",
  "bar": "selectBubleChartType",
}

var typeChartMapping = {
  1: {
    title: "Super-imposed plot of 24 hr Cooling Load Profile RT",
    value: 1,
    query: 'navName == "PltHG"'
  },
  2: {
    title: "Histogram of Cooling Load Occurrences",
    value: 2,
    query: 'navName == "PltHG"'
  },
  3: {
    title: "Super-imposed plot of daily chilled water supply/return temperature C",
    value: 3,
    query: 'navName == "ChWHeaderRTemp"'
  },
  4: {
    title: "Super-imposed plot of daily chilled water temperature difference oC",
    value: 4,
    query: 'navName == "ChWHeaderDeltaT"'
  },
  5: {
    title: "Super-imposed plot of daily condenser water supply/return temperature oC",
    value: 5,
    query: 'navName == "CWHeaderRTemp"'
  },
  6: {
    title: "Super-imposed plot of daily condenser water temperature difference oC",
    value: 6,
    query: 'navName == "CWHeaderDeltaT"'
  },
  7: {
    title: "Super-imposed plot of daily chilled water GPM/RT",
    value: 7,
    query: 'navName == "ChWBypassFlow" or navName == "PltHG"'
  },
  8: {
    title: "Super-imposed plot of daily condenser water GPM/RT",
    value: 8,
    query: 'navName == ""CWBypassFlow"" or navName == ""PltHG""'
  },
  10: {
    title: "Super-imposed plot of daily chiller efficiency kW/RT",
    value: 10,
    query: 'efficiency and equipRef->navName=="Chiller Total"'
  },
  11: {
    title: "Super-imposed plot of daily chilled water pump efficiency kW/RT",
    value: 11,
    query: 'efficiency and equipRef->navName=="Primary Chilled Water Pump Total"'
  },
  12: {
    title: "Super-imposed plot of daily condenser water pump efficiency kW/RT",
    value: 12,
    query: 'efficiency and equipRef->navName=="Condenser Water Pump Total"'
  },
  13: {
    title: "Super-imposed plot of daily cooling tower efficiency kW/RT",
    value: 13,
    query: 'efficiency and equipRef->navName=="Cooling Tower Total"'
  },
  14: {
    title: "Super-imposed plot of daily chiller plant system efficiency kW/RT",
    value: 14,
    query: 'navName=="PltEff"'
  },
  15: {
    title: "Scatter plot of chiller plant efficiency over cooling load",
    value: 15,
    query: 'navName == "PltEff" or navName == "PltHG"'
  },
  16: {
    title: "Scatter plot of chilled water pump efficiency over cooling load",
    value: 16,
    query: '(efficiency and equipRef->navName=="Primary Chilled Water Pump Total") or navName == "PltHG"'
  },
  17: {
    title: "Scatter plot of condenser water pump efficiency over cooling load",
    value: 17,
    query: '(efficiency and equipRef->navName=="Condenser Water Pump Total") or navName == "PltHG"'
  },
  18: {
    title: "Scatter plot of cooling tower efficiency over cooling load",
    value: 18,
    query: 'navName == "PltHG" or (efficiency and equipRef->navName=="Cooling Tower Total")'
  },
  19: {
    title: "System Level Heat Balance Plot",
    value: 19,
    query: 'navName == "PltHBPercent"'
  },
  // 20: {
  //   title: "Temperature Verification Plots for Water-Cooled Chiller Plant System",
  //   value: 20,
  //   query: ""
  // }
};


model.fire("hideInfo")

model.on("chartTypeChange", function (event) {
  typeSelected = event.node.value;
  console.log("Chart Type Select", typeSelected)
  if (eventMappingName.hasOwnProperty(typeSelected)) {
    eventName = eventMappingName[typeSelected]
    for (var key of Object.keys(classMappingName)) {
      var selectTarget = template.view.querySelector(`.${classMappingName[key]}`);
      if(typeSelected == key) {
        selectTarget.style.display = 'block'
      }
      else {
        selectTarget.style.display = 'none'
      }
    }
  }
  model.fire(eventName)
});

model.on("typeChange", function (event) {
  typeSelected = event.node.value;
  console.log("Chart Value Select", typeSelected)

  if (typeChartMapping.hasOwnProperty(typeSelected)) {
    var chartQueryTarget = template.view.querySelector("#chartQuery");
    chartQueryTarget.value = JSON.stringify(typeChartMapping[typeSelected])
  }

  model.fire(eventName)
})

model.on("dateChange", function (event) {
  selected = event.node.value;
  if (selected == "other") {
    model.fire(eventName)
  } else if (selected == "range") {
    setTimeout(function () {
      model.set("other", "Date Picker");
      var showItem = model.queryAll("stackRactive");

      showItem.forEach(function (item) {
        var test = template.view.querySelector("#customRange");
        test.style.visibility = "";
      });
    }, 200);
  } else {
    model.fire(eventName)
  }
});

model.on("start", function (event) {
  console.log("start")
  top.app.ShowCalendar(null, function (data) {
    start = moment(data.range.start).format("YYYY-MM-DD");
    var startDateTarget = template.view.querySelector("#startDate");
    startDateTarget.value = start
    var startPretty = new moment(start).format("MMM D, YYYY");
    model.set("start", startPretty);
    console.log("start", startPretty);
  });
});

model.on("end", function (event) {
  console.log("end")
  top.app.ShowCalendar(null, function (data) {
    end = moment(data.range.end).format("YYYY-MM-DD");
    var endDateTarget = template.view.querySelector("#endDate");
    endDateTarget.value = end
    var endPretty = new moment(end).format("MMM D, YYYY");
    model.set("end", endPretty);
    console.log("end", endPretty);
  });
});

model.on("go", function (event) {
  model.fire(eventName)
});
