var template = this;
var selectTarget = template.view.querySelector(".selectSize");
console.log(selectTarget.value);

selectTarget.value = "thisWeek"
this.ractive.fire("bubleChart");
