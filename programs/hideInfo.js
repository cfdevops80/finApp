var template = this;
var model = this.ractive;

var titleTarget = template.view.querySelector("#amChartXtitle");
titleTarget.style.display = "none"
setTimeout(function () {
  var showItem = model.queryAll("stackRactive");

  showItem.forEach(function (item) {
    var test = template.view.querySelector("#customRange");

    test.style.visibility = "hidden";
  });
}, 200);
