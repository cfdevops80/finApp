var template = this;

var unitByType = {
  SumOfTotalElectricalEnergyUsed: `kWh`,
  SumOfTotalCoolingProduced: `RTh`,
  SumOfTotalHeatRejected: `RTh`,
  ChillerPlantEfficiency: `kW/RT`,
  TotalHeatBalanceDataCount: `-`,
  "DataCount>+5%Error": `-`,
  "DataCount<5%Error": `-`,
  "DataCountWithin±5%Error": ``,
  HeatBalanceWithin: `%`,
};

var titleByType = {
  SumOfTotalElectricalEnergyUsed: `Sum of total electrical energy used`,
  SumOfTotalCoolingProduced: `Sum of total cooling produced`,
  SumOfTotalHeatRejected: `Sum of total heat rejected`,
  ChillerPlantEfficiency: `Chiller Plant Efficiency`,
  TotalHeatBalanceDataCount: `Total Heat Balance Data Count`,
  "DataCount>+5%Error": `Data Count > + 5% error`,
  "DataCount<5%Error": `Data Count < - 5% error`,
  "DataCountWithin±5%Error": `Data Count within ±5% error`,
  HeatBalanceWithin: `% Heat Balance within ±5% error`,
};

var formulaByType = {
  SumOfTotalElectricalEnergyUsed: `(A)`,
  SumOfTotalCoolingProduced: `(B)`,
  SumOfTotalHeatRejected: `(C)`,
  ChillerPlantEfficiency: `(A) / (B)`,
  TotalHeatBalanceDataCount: `(D)`,
  "DataCount>+5%Error": `(E)`,
  "DataCount<5%Error": `(F)`,
  "DataCountWithin±5%Error": `(G) = (D) – (E) – (F)`,
  HeatBalanceWithin: `100 x (G) / (D)`,
};

var queryMapping = {
  SumOfTotalElectricalEnergyUsed: `navName=="PltPowerTotal"`,
  SumOfTotalCoolingProduced: `navName=="PltHG"`,
  SumOfTotalHeatRejected: `navName=="PltHRTotal"`,
  ChillerPlantEfficiency: `navName=="PltEff"`,
  TotalHeatBalanceDataCount: `navName=="PltHBTotal"`,
  "DataCount>+5%Error": `navName=="PltHBAboveLimit"`,
  "DataCount<5%Error": `navName=="PltHBBelowLimit"`,
  "DataCountWithin±5%Error": `navName=="PltHBWithin"`,
};

function calcHeatBalance(info) {
  var type = "HeatBalanceWithin";
  var quantityDataCountWithin = info.find(
    (item) => (item.type = "DataCountWithin±5%Error")
  ).quantity;
  var quantityTotalHeatBalanceDataCount = info.find(
    (item) => (item.type = "TotalHeatBalanceDataCount")
  );
  if (!quantityDataCountWithin || !quantityTotalHeatBalanceDataCount) {
    info.push({
      title: titleByType[type],
      quantity: 0,
      unit: unitByType[type],
      formular: formulaByType[type],
      type: type,
    });
  } else {
    info.push({
      title: titleByType[type],
      quantity:
        (100 * Number(info["DataCountWithin±5%Error"])) /
        Number(info["TotalHeatBalanceDataCount"]),
      unit: unitByType[type],
      formular: formulaByType[type],
      type: type,
    });
  }
}

function calculateAverageV0(data) {
  const filteredData = data.filter((item) => item.v0 !== undefined);

  const totalV0 = filteredData.reduce((sum, item) => sum + item.v0, 0);

  const averageV0 = filteredData.length > 0 ? totalV0 / filteredData.length : 0;

  return averageV0;
}

async function fetchAndProcessData() {
  const info = [];
  const promises = Object.keys(queryMapping).map((type) => {
    const query = queryMapping[type];
    return new Promise((resolve) => {
      finstack.eval(
        `readAll(${query}).hisRead(today).hisRollupAuto(null,null).hisClip`,
        (data) => {
          const queryData = data.result.toObj();
          info.push({
            title: titleByType[type],
            quantity: calculateAverageV0(queryData),
            unit: unitByType[type],
            formular: formulaByType[type],
            type: type,
          });
          resolve();
        }
      );
    });
  });

  await Promise.all(promises);
  calcHeatBalance(info);

  console.log("Final Info:", info);
  template.data = info;
}

fetchAndProcessData();
