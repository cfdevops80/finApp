//    JS file : chilledWaterPlantForm

"use strict";
window.writeToChilledWaterPlantFormCsv = function (
  description,
  brand,
  type,
  namePlateMotor,
  totalCollingCapacity,
  chilledWater,
  ratedEffciency,
  yearInstalled
) {
  var formatData = {
    description: description,
    brand: brand,
    type: type,
    namePlateMotor: namePlateMotor,
    totalCollingCapacity: totalCollingCapacity,
    chilledWater: chilledWater,
    ratedEffciency: ratedEffciency,
    yearInstalled: yearInstalled,
  };

  const formattedRows = JSON.stringify(formatData).replace(
    /"([^"]+)":/g,
    "$1:"
  );
  console.log(formattedRows);
  finstack.eval(
    formattedRows + ".ioWriteCsv(`io/chilledWaterPlantForm.csv`)",
    function (data) {}
  );
};

const form = {
  body: [
    {
      name: "description",
      editorType: "textinput",
      prompt: "Description",
      defVal: "",
    },
    {
      name: "brand",
      editorType: "textinput",
      prompt: "Brand",
      defVal: "",
    },
    {
      name: "type",
      editorType: "textinput",
      prompt: "Type",
      defVal: "",
    },
    {
      name: "namePlateMotor",
      editorType: "numericstepper",
      prompt: "Name plate mortor (kW)",
    },
    {
      name: "totalCollingCapacity",
      editorType: "numericstepper",
      prompt: "Total Colling Capacity (RT)",
    },
    {
      name: "chilledWater",
      editorType: "numericstepper",
      prompt: "Chilled water LWT/EWT",
    },
    {
      name: "ratedEffciency",
      editorType: "numericstepper",
      prompt: "Rated Efficiency kW/RT",
    },
    {
      name: "yearInstalled",
      editorType: "numericstepper",
      prompt: "Year Installed",
    },
    {
      name: "cancelButton",
      editorType: "button",
      label: window.languageManager["cancel"],
      controlBar: true,
    },
    {
      name: "applyButton",
      editorType: "button",
      label: window.languageManager["coreApply"],
      controlBar: true,
    },
  ],
  dis: "Chilled Water Plant Form",
  name: "addVirtualPointForm",
  cancelButton: "$cancelButton",
  commitButton: "$applyButton",
  completeAction:
    "window.writeToChilledWaterPlantFormCsv($description, $brand, $type, $namePlateMotor, $totalCollingCapacity, $chilledWater, $ratedEffciency, $yearInstalled)",
};

fin.ShowForm(form, null);
