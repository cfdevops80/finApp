var queryMapping = {
    "SumOfTotalElectricalEnergyUsed": `navName=="PltPowerTotal"`,
    "SumOfTotalCoolingProduced": `navName=="PltHG"`,
    "SumOfTotalHeatRejected":`navName=="PltHRTotal"`,
    "ChillerPlantEfficiency":`navName=="PltEff"`,
    "TotalHeatBalanceDataCount": `navName=="PltHBTotal"`,
    "DataCount>+5%Error": `navName=="PltHBAboveLimit"`,
    "DataCount<5%Error": `navName=="PltHBBelowLimit"`,
    "DataCountWithin±5%Error": `navName=="PltHBWithin"`,
    // "%HeatBalanceWithin±5%Error": `navName==""`, //TODO:
}

function calcHeatBalance(info) {
    info['HeatBalanceWithin'] = 0
    if(!info['DataCountWithin±5%Error'] || !info['TotalHeatBalanceDataCount']) return

    info['HeatBalanceWithin'] = 100 * Number(info['DataCountWithin±5%Error'])/Number(info['TotalHeatBalanceDataCount'])
}

function calculateAverageV0(data) {
    // Filter out items without `v0`
    const filteredData = data.filter(item => item.v0 !== undefined);

    // Calculate the sum of `v0`
    const totalV0 = filteredData.reduce((sum, item) => sum + item.v0, 0);

    // Calculate the average
    const averageV0 = filteredData.length > 0 ? totalV0 / filteredData.length : 0;

    return averageV0;
}

async function fetchAndProcessData() {
    const info = {};
    const promises = Object.keys(queryMapping).map((type) => {
        const query = queryMapping[type];
        return new Promise((resolve) => {
            finstack.eval(
                `readAll(${query}).hisRead(today).hisRollupAuto(null,null).hisClip`,
                (data) => {
                    const queryData = data.result.toObj();
                    console.log(queryData)
                    // const res = queryData.v0;
                    info[type] = calculateAverageV0(queryData);
                    resolve();
                }
            );
        });
    });

    await Promise.all(promises);
    console.log(info)
    calcHeatBalance(info)
    // const area = 100; // TODO: Replace with actual value
    // calculateCoolingLoadDensity(area, info);
    // calculateFlowRateVsCoolingLoad(info);

    console.log("Final Info:", info);
}

fetchAndProcessData();