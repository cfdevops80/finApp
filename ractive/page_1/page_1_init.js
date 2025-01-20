this.ractive.fire("obtainData");
this.ractive.fire("initFixTable");

var template = this;
var model = this.ractive;
var myTarget = model.queryAll("targetPoint");
var title = myTarget.idDis;
var newPoints = [];
var uniqueDates = [];
var selected = "thisWeek";
var start = "Start";
var end = "End";

finstack.eval('read(equipRef->navName=="Cooling Tower Total")', function(data){
   model.set('coolingTowerTotal',data.result.toObj())

});

var eventMappingName = {
  "line": "changeLineChart",
  "buble": "changeBubleChart",
  "bar": "changeBarChart",
}
var eventName = eventMappingName["line"]

var classMappingName = {
  "line": "selectLineChartType",
  "buble": "selectBubleChartType",
  "bar": "selectBarChartType",
}

var typeChartMapping = {
  1: {
    title: "Super-imposed plot of 24 hr Cooling Load Profile RT",
    value: 1,
    query: 'navName == "PltHG"',
    type: "line"
  },
  2: {
    title: "Histogram of Cooling Load Occurrences",
    value: 2,
    query: 'navName == "PltHG"',
    type: "bar"
  },
  3: {
    title: "Super-imposed plot of daily chilled water return temperature C",
    value: 3,
    query: 'navName == "ChWHeaderRTemp"',
    type: "line"
  },
  3.1: {
    title: "Super-imposed plot of daily chilled water supply temperature C",
    value: 3.1,
    query: 'navName == "ChWHeaderSTemp"',
    type: "line"
  },
  4: {
    title: "Super-imposed plot of daily chilled water temperature difference oC",
    value: 4,
    query: 'navName == "ChWHeaderDeltaT"',
    type: "line"
  },
  5: {
    title: "Super-imposed plot of daily condenser water return temperature oC",
    value: 5,
    query: 'navName == "CWHeaderRTemp"',
    type: "line"
  },
  5.1: {
    title: "Super-imposed plot of daily condenser water supply temperature oC",
    value: 5.1,
    query: 'navName == "CWHeaderSTemp"',
    type: "line"
  },
  6: {
    title: "Super-imposed plot of daily condenser water temperature difference oC",
    value: 6,
    query: 'navName == "CWHeaderDeltaT"',
    type: "line"
  },
  7: {
    title: "Super-imposed plot of daily chilled water GPM/RT",
    value: 7,
    query: 'navName == "ChWBypassFlow" or navName == "PltHG"',
    type: "line"
  },
  8: {
    title: "Super-imposed plot of daily condenser water GPM/RT",
    value: 8,
    query: 'navName == "CWBypassFlow" or navName == "PltHG"',
    type: "line"
  },
  10: {
    title: "Super-imposed plot of daily chiller efficiency kW/RT",
    value: 10,
    query: 'efficiency and equipRef->navName=="Chiller Total"',
    type: "line"
  },
  10.1: {
    title: "Super-imposed plot of daily Chiller 1 efficiency kW/RT",
    value: 10.1,
    query: 'efficiency and equipRef->navName=="Chiller 1"',
    type: "line"
  },
  10.2: {
    title: "Super-imposed plot of daily Chiller 2 efficiency kW/RT",
    value: 10.2,
    query: 'efficiency and equipRef->navName=="Chiller 2"',
    type: "line"
  },
  11: {
    title: "Super-imposed plot of daily chilled water pump efficiency kW/RT",
    value: 11,
    query: 'efficiency and equipRef->navName=="Primary Chilled Water Pump Total"',
    type: "line"
  },

  11.1: {
    title: "Super-imposed plot of daily Primary Chilled Water Pump 1 efficiency kW/RT",
    value: 11.1,
    query: 'efficiency and equipRef->navName=="Primary Chilled Water Pump 1"',
    type: "line"
  },

  11.2: {
    title: "Super-imposed plot of daily Primary Chilled Water Pump 2 efficiency kW/RT",
    value: 11.2,
    query: 'efficiency and equipRef->navName=="Primary Chilled Water Pump 2"',
    type: "line"
  },
  11.3: {
    title: "Super-imposed plot of daily Primary Chilled Water Pump 3 efficiency kW/RT",
    value: 11.3,
    query: 'efficiency and equipRef->navName=="Alcon Primary Chilled Water Pump 3"',
    type: "line"
  },
  11.4: {
    title: "Super-imposed plot of daily Primary Chilled Water Pump Main efficiency kW/RT",
    value: 11.4,
    query: 'efficiency and equipRef->navName=="Primary Chilled Water Pump Main"',
    type: "line"
  },
  11.5: {
    title: "Super-imposed plot of daily Secondary Chilled Water Pump Total efficiency kW/RT",
    value: 11.5,
    query: 'efficiency and equipRef->navName=="Secondary Chilled Water Pump Total"',
    type: "line"
  },
  11.6: {
    title: "Super-imposed plot of daily Secondary Chilled Water Pump 1 efficiency kW/RT",
    value: 11.6,
    query: 'efficiency and equipRef->navName=="Secondary Chilled Water Pump 1"',
    type: "line"
  },
  11.7: {
    title: "Super-imposed plot of daily Secondary Chilled Water Pump 2 efficiency kW/RT",
    value: 11.7,
    query: 'efficiency and equipRef->navName=="Secondary Chilled Water Pump 2"',
    type: "line"
  },
  11.8: {
    title: "Super-imposed plot of daily Secondary Chilled Water Pump 3 efficiency kW/RT",
    value: 11.8,
    query: 'efficiency and equipRef->navName=="Secondary Chilled Water Pump 3"',
    type: "line"
  },
  11.9: {
    title: "Super-imposed plot of daily Secondary Chilled Water Pump 4 efficiency kW/RT",
    value: 11.9,
    query: 'efficiency and equipRef->navName=="Secondary Chilled Water Pump 4"',
    type: "line"
  },
  11.10: {
    title: "Super-imposed plot of daily Secondary Chilled Water Pump 5 efficiency kW/RT",
    value: 11.10,
    query: 'efficiency and equipRef->navName=="Secondary Chilled Water Pump 5"',
    type: "line"
  },
  11.11: {
    title: "Super-imposed plot of daily Secondary Chilled Water Pump 6 efficiency kW/RT",
    value: 11.11,
    query: 'efficiency and equipRef->navName=="Secondary Chilled Water Pump 6"',
    type: "line"
  },
  11.12: {
    title: "Super-imposed plot of daily Secondary Chilled Water Pump 7 efficiency kW/RT",
    value: 11.12,
    query: 'efficiency and equipRef->navName=="Secondary Chilled Water Pump 7"',
    type: "line"
  },
  11.13: {
    title: "Super-imposed plot of daily Secondary Chilled Water Pump 8 efficiency kW/RT",
    value: 11.13,
    query: 'efficiency and equipRef->navName=="Secondary Chilled Water Pump 8"',
    type: "line"
  },
  11.14: {
    title: "Super-imposed plot of daily Secondary Chilled Water Pump 9 efficiency kW/RT",
    value: 11.14,
    query: 'efficiency and equipRef->navName=="Secondary Chilled Water Pump 9"',
    type: "line"
  },
  11.15: {
    title: "Super-imposed plot of daily Secondary Chilled Water Pump Main efficiency kW/RT",
    value: 11.15,
    query: 'efficiency and equipRef->navName=="Secondary Chilled Water Pump Main"',
    type: "line"
  },
  12: {
    title: "Super-imposed plot of daily condenser water pump efficiency kW/RT",
    value: 12,
    query: 'efficiency and equipRef->navName=="Condenser Water Pump Total"',
    type: "line"
  },
  12.1: {
    title: "Super-imposed plot of daily Condenser Water Pump 1 efficiency kW/RT",
    value: 12.1,
    query: 'efficiency and equipRef->navName=="Condenser Water Pump 1"',
    type: "line"
  },
  12.2: {
    title: "Super-imposed plot of daily Condenser Water Pump 2 efficiency kW/RT",
    value: 12.2,
    query: 'efficiency and equipRef->navName=="Condenser Water Pump 2"',
    type: "line"
  },
  12.3: {
    title: "Super-imposed plot of daily Condenser Water Pump 3 efficiency kW/RT",
    value: 12.3,
    query: 'efficiency and equipRef->navName=="Condenser Water Pump 3"',
    type: "line"
  },
  12.4: {
    title: "Super-imposed plot of daily Condenser Water Pump Main efficiency kW/RT",
    value: 12.4,
    query: 'efficiency and equipRef->navName=="Condenser Water Pump Main"',
    type: "line"
  },
  13: {
    title: "Super-imposed plot of daily cooling tower efficiency kW/RT",
    value: 13,
    query: 'efficiency and equipRef->navName=="Cooling Tower Total"',
    type: "line"
  },
  13.1: {
    title: "Super-imposed plot of daily Cooling Tower 1 efficiency kW/RT",
    value: 13.1,
    query: 'efficiency and equipRef->navName=="Cooling Tower 1"',
    type: "line"
  },
  13.2: {
    title: "Super-imposed plot of daily Cooling Tower 2 efficiency kW/RT",
    value: 13.2,
    query: 'efficiency and equipRef->navName=="Cooling Tower 2"',
    type: "line"
  },
  13.3: {
    title: "Super-imposed plot of daily Cooling Tower Main efficiency kW/RT",
    value: 13.3,
    query: 'efficiency and equipRef->navName=="Cooling Tower Main"',
    type: "line"
  },
  14: {
    title: "Super-imposed plot of daily chiller plant system efficiency kW/RT",
    value: 14,
    query: 'navName=="PltEff"',
    type: "line"
  },
  15: {
    title: "Scatter plot of chiller plant efficiency over cooling load",
    value: 15,
    query: 'navName == "PltEff" or navName == "PltHG"',
    type: "buble"
  },
  16: {
    title: "Scatter plot of chilled water pump efficiency over cooling load",
    value: 16,
    query: '(efficiency and equipRef->navName=="Primary Chilled Water Pump Total") or navName == "PltHG"',
    type: "buble"
  },
  16.1: {
    title: "Scatter plot of Primary Chilled Water Pump 1 efficiency over cooling load",
    value: 16.1,
    query: '(efficiency and equipRef->navName=="Primary Chilled Water Pump 1") or navName == "PltHG"',
    type: "buble"
  },
  16.2: {
    title: "Scatter plot of Primary Chilled Water Pump 2 efficiency over cooling load",
    value: 16.2,
    query: '(efficiency and equipRef->navName=="Primary Chilled Water Pump 2") or navName == "PltHG"',
    type: "buble"
  },
  16.3: {
    title: "Scatter plot of Primary Chilled Water Pump 3 efficiency over cooling load",
    value: 16.3,
    query: '(efficiency and equipRef->navName=="Primary Chilled Water Pump 3") or navName == "PltHG"',
    type: "buble"
  },
  16.4: {
    title: "Scatter plot of Primary Chilled Water Pump Main efficiency over cooling load",
    value: 16.4,
    query: '(efficiency and equipRef->navName=="Primary Chilled Water Pump Main") or navName == "PltHG"',
    type: "buble"
  },
  17: {
    title: "Scatter plot of condenser water pump efficiency over cooling load",
    value: 17,
    query: '(efficiency and equipRef->navName=="Condenser Water Pump Total") or navName == "PltHG"',
    type: "buble"
  },
  17.1: {
    title: "Scatter plot of Condenser Water Pump 1 efficiency over cooling load",
    value: 17.1,
    query: '(efficiency and equipRef->navName=="Condenser Water Pump 1") or navName == "PltHG"',
    type: "buble"
  },
  17.2: {
    title: "Scatter plot of Condenser Water Pump 2 efficiency over cooling load",
    value: 17.2,
    query: '(efficiency and equipRef->navName=="Condenser Water Pump 2") or navName == "PltHG"',
    type: "buble"
  },
  17.3: {
    title: "Scatter plot of Condenser Water Pump 3 efficiency over cooling load",
    value: 17.3,
    query: '(efficiency and equipRef->navName=="Condenser Water Pump 3") or navName == "PltHG"',
    type: "buble"
  },
  17.4: {
    title: "Scatter plot of Condenser Water Pump Main efficiency over cooling load",
    value: 17.4,
    query: '(efficiency and equipRef->navName=="Condenser Water Pump Main") or navName == "PltHG"',
    type: "buble"
  },
  18: {
    title: "Scatter plot of cooling tower efficiency over cooling load",
    value: 18,
    query: 'navName == "PltHG" or (efficiency and equipRef->navName=="Cooling Tower Total")',
    type: "buble"
  },
  18.1: {
    title: "Scatter plot of Cooling Tower 1 efficiency over cooling load",
    value: 18.1,
    query: 'navName == "PltHG" or (efficiency and equipRef->navName=="Cooling Tower 1")',
    type: "buble"
  },
  18.2: {
    title: "Scatter plot of Cooling Tower 2 efficiency over cooling load",
    value: 18.2,
    query: 'navName == "PltHG" or (efficiency and equipRef->navName=="Cooling Tower 2")',
    type: "buble"
  },
  18.3: {
    title: "Scatter plot of Cooling Tower Main efficiency over cooling load",
    value: 18.3,
    query: 'navName == "PltHG" or (efficiency and equipRef->navName=="Cooling Tower Main")',
    type: "buble"
  },
  19: {
    title: "System Level Heat Balance Plot",
    value: 19,
    query: 'navName == "PltHBPercent"',
    type: "line"
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
      if (typeSelected == key) {
        selectTarget.style.display = 'block'
      }
      else {
        selectTarget.style.display = 'none'
      }
    }
  }

  var chartQueryTarget = template.view.querySelector("#chartQuery");
  switch (typeSelected) {
    case "line":
      chartQueryTarget.value = JSON.stringify(typeChartMapping[1])
      break;
    case "buble":
      chartQueryTarget.value = JSON.stringify(typeChartMapping[15])
      break;
    case "bar":
      chartQueryTarget.value = JSON.stringify(typeChartMapping[2])
      break;
  }

  model.fire(eventName)
});

model.on("typeChange", function (event) {
  typeSelected = event.node.value;
  console.log("Chart Value Select", typeSelected);

  var selectedOptions = model.get("selectedOptions")
  console.log("selectedOptions", selectedOptions)
  if (selectedOptions) {
    var chartObjects = selectedOptions.map(x => typeChartMapping[Number(x)])

    // Kiểm tra xem những cái nào cần xóa
    var existingCharts = model.get("chart")
    if (existingCharts) {
      var currentChartObjects = JSON.parse(existingCharts)
      currentChartObjects.forEach(item => {
        if (typeChartMapping[item.value] && !selectedOptions.map(x => Number(x.id)).includes(item.value)) {
          const amChart = template.view.querySelector("#amCharts");
          const deleteChartEle = amChart.querySelector(`[id="chart${item.value}"]`)
          if(deleteChartEle) deleteChartEle.remove()
        }
      })
    }

    const chartType = typeChartMapping[typeSelected].type
    if (typeChartMapping.hasOwnProperty(typeSelected)) {
      var chartQueryTarget = template.view.querySelector("#chartQuery");
      chartQueryTarget.value = JSON.stringify(typeChartMapping[typeSelected])
      var queries = JSON.stringify(chartObjects)
      model.set("chart", queries)
      console.log("chartQueryTarget", chartQueryTarget);
    }
    console.log(chartType)
    console.log("eventName: ", eventMappingName[chartType]);

    Object.keys(eventMappingName).forEach((type) => {
      const filteredCharts = chartObjects.filter((chart) => chart.type === type);
      if (filteredCharts.length > 0) {
        model.fire(eventMappingName[type]);
      }
    });
  } else {
    const amChart = template.view.querySelector("#amCharts");
    if (amChart) {
      amChart.innerHTML = "";
      console.log("All child elements have been removed, amCharts is still intact.");
    }
  }

})

model.on("dateChange", function (event) {
  selected = event.node.value;
  console.log("dateChange", selected)
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
  var selectedOptions = model.get("selectedOptions")
  console.log("selectedOptions", selectedOptions)
  if (selectedOptions) {
    var chartObjects = selectedOptions.map(x => typeChartMapping[Number(x)])
  }
  Object.keys(eventMappingName).forEach((type) => {
    const filteredCharts = chartObjects.filter((chart) => chart.type === type);
    if (filteredCharts.length > 0) {
      model.fire(eventMappingName[type]);
    }
  });
});

// This is code for table

var tableTypeSelected = "";

const keyOrderMapping = model.get("keyOrderMapping")

const fileName = model.get("fileName")

const refreshType = () => {
    var selectTarget = template.view.querySelector(".selectTable");
    console.log("Current table type:", selectTarget.value );
    return selectTarget.value;
}

function updateCsvFile(updatedRows) {
    const formattedRows = formatJsonString(updatedRows);
    // tableTypeSelected = refreshType()
    console.log(formattedRows);
    finstack.eval(formattedRows + ".ioWriteCsv(`io/"+fileName[tableTypeSelected]+"`)", function (data) {
        queryData = data.result.toObj();
        console.log(queryData);
    });
}
// FIXED
function changeModalStatus() {
    const modal = template.view.querySelector(".modal");
    const overlay = template.view.querySelector(".overlay");
    if (modal.classList.contains("hidden")) {
        modal.classList.remove("hidden")
    }
    else {
        modal.classList.add("hidden")
    }

    if (overlay.classList.contains("hidden")) {
        overlay.classList.remove("hidden")
    }
    else {
        overlay.classList.add("hidden")
    }
}

function validateCsvHeader(csv) {
    // tableTypeSelected = refreshType()
    const lines = csv.trim().split("\n");
    const headers = lines[0].split(",").map(header => header.trim());

    return headers.length === keyOrderMapping[tableTypeSelected].length && headers.every((header, index) => header === keyOrderMapping[tableTypeSelected][index]);
}

function csvToArray(csv) {
    const lines = csv.trim().split("\n");
    const headers = lines[0].split(",");

    const result = lines.slice(1).map(line => {
        const values = line.split(",");
        const obj = {};
        headers.forEach((header, index) => {
            obj[header.trim()] = values[index]?.trim() || "";
        });
        return obj;
    });

    return result;
}

function formatJsonString(obj) {
    const updatedObj = obj.map(obj =>
        Object.fromEntries(
            Object.entries(obj).map(([key, value]) =>
                [key, value === undefined ? '' : value]
            )
        )
    );

    let jsonString = JSON.stringify(updatedObj);
    return jsonString.replace(/"([^"]+)":/g, "$1:");
}

function download(filename, text) {
    console.log("filename", filename);
    console.log("text", text);
    var element = document.createElement('a');
    console.log("element", element);
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
// ----------------------------------
model.on("openModal", function (event) {
    var tableId = event.node.dataset.tableId;
    tableTypeSelected = tableId
    changeModalStatus()
})

model.on("closeModal", function (event) {
    changeModalStatus()
})

model.on("downloadTemplate", function (event) {
    download(fileName[tableTypeSelected], keyOrderMapping[tableTypeSelected].join(","));
})

model.on("addCsvFile", async function (event) {
    const input = template.view.querySelector("#csvFileInput");
    const file = input.files[0];
    if (!file) {
        console.log("No file selected.");
        return;
    }

    const reader = new FileReader();
    const rows = this.get('rows')
    let newRows = {...rows}

    reader.onload = function (event) {
        const csvContent = event.target.result;
        const isValid = validateCsvHeader(csvContent);

        if (!isValid) {
            console.log("CSV headers do not match the required format.");
            return;
        }

        const csvContentFormat = csvToArray(csvContent);
        csvContentFormat.forEach(row => {
            console.log(row);
            newRows[tableTypeSelected].push(row)
        })
        model.set("rows", newRows)

        updateCsvFile(newRows[tableTypeSelected])
    };
    
    reader.readAsText(file);
    
    changeModalStatus()
})

model.on("addNewRow", function (event) {
    console.log("event", event);
    var tableId = event.node.dataset.tableId;
    tableTypeSelected = tableId

    const newRow = keyOrderMapping[tableTypeSelected].reduce((obj, key) => {
        obj[key] = '';
        return obj;
    }, {});

    const rows = this.get('rows')
    let newRows = {...rows}
    newRows[tableTypeSelected].push(newRow)

    this.set("rows", newRows);
});

model.on("deleteRow", function (event) {
    console.log("Delete Row", event);

    var tableId = event.node.dataset.tableId;
    tableTypeSelected = tableId

    const rowIndex = Number(event.node.dataset.rowIndex);

    const rows = this.get('rows');
    let newRows = {...rows}

    newRows[tableTypeSelected].splice(rowIndex, 1);

    this.set("rows", newRows);
    updateCsvFile(newRows[tableTypeSelected])
})

model.on("cellInput", function (event) {
    const rowIndex = Number(event.node.dataset.rowIndex);
    const cellKey = event.node.dataset.cellIndex;
    const value = event.node.innerText.trim();
    const tableName = event.node.dataset.tableId;
    tableTypeSelected = tableName

    console.log("Cell input detected:", {
        rowIndex,
        cellKey,
        value,
        tableName,
    });


    const rows = this.get("rows")[tableTypeSelected];
    console.log(rows);
    rows[rowIndex][cellKey] = value;
});

model.on("cellBlur", function (event) {
    const rowIndex = Number(event.node.dataset.rowIndex);
    const cellKey = event.node.dataset.cellIndex;
    const value = event.node.innerText.trim();
    const tableName = event.node.dataset.tableId;
    tableTypeSelected = tableName

    console.log("Cell edit finished:", {
        rowIndex,
        cellKey,
        value,
    });

    const rows = this.get("rows")[tableTypeSelected];
    console.log(rows, tableTypeSelected);

    if (rows[rowIndex][cellKey] !== value) {
        rows[rowIndex][cellKey] = value;
        this.set("rows", rows);


    } else {
        console.log("No changes detected; skipping update.");
    }

    const updatedRows = this.get("rows")[tableTypeSelected].map((row, rIdx) =>
        rIdx === rowIndex
            ? (row = { ...row, [cellKey]: value })
            : row
    );
    updateCsvFile(updatedRows)
});
