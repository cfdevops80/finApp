var template = this;
var model = this.ractive;
var selectTarget = template.view.querySelector(".selectSize");

var chartQueryTarget = template.view.querySelector("#chartQuery");
var initChartObjects = {
  title: "Super-imposed plot of 24 hr Cooling Load Profile RT",
  value: 1,
  query: 'navName == "PltHG"',
  type: "line"
}
chartQueryTarget.value = JSON.stringify(initChartObjects);
var queries = JSON.stringify([initChartObjects])
model.set("chart", queries)

selectTarget.value = "thisWeek";
console.log("init", selectTarget.value, chartQueryTarget.value);
this.ractive.fire("changeLineChart");
