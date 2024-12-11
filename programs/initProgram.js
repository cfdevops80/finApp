var template = this;
var selectTarget = template.view.querySelector(".selectSize");

var chartQueryTarget = template.view.querySelector("#chartQuery");
chartQueryTarget.value = JSON.stringify({
  title: "Super-imposed plot of 24 hr Cooling Load Profile RT",
  value: 1,
  query: 'navName == "PltHG"',
});

selectTarget.value = "thisWeek";
console.log("init", selectTarget.value, chartQueryTarget.value);
this.ractive.fire("changeLineChart");
