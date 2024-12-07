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

setTimeout(function () {
  var showItem = model.queryAll("stackRactive");

  showItem.forEach(function (item) {
    var test = template.view.querySelector("#customRange");
    test.style.visibility = "hidden";
  });
}, 200);

model.on("dateChange", function (event) {
  selected = event.node.value;
  if (selected == "other") {
    model.fire("changeChart")
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
    model.fire("changeChart")
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
  model.fire("changeChart")
});
