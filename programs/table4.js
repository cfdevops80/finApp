var queryMapping = {
    "CoolingLoadRT": `navName=="PltLoadTotal"`,
    // "CoolingLoadDensity(AirConArea)": "", // TODO: QA
    "PowerConsumption": `navName=="PltPowerTotal"`,
    "ChilledWaterSupplyTemperature":`navName=="ChWHeaderSTemp"`,
    "ChilledWaterReturnTemperature":`navName=="ChWHeaderRTemp"`,
    "ChilledWaterDeltaT": `navName=="ChWHeaderDeltaT"`,
    "ChilledWaterFlowRate": `navName=="ChWHeaderFlow"`,
    // "ChilledWaterFlowRateVsCoolingLoad": `navName=="ChWBypassFlow`, // TODO: QA
    "CondenserHeatRejection": `navName=="PltHR"`, // TODO: QA
    "CondenserWaterSupplyTemperature": `navName=="CWHeaderSTemp"`,
    "CondenserWaterReturnTemperature": `navName=="CWHeaderRTemp"`,
    "CondenserWaterDeltaT": `navName=="CWHeaderDeltaT"`,
    "CondenserWaterFlowRate": `navName=="CWHeaderFlow"`,
    // "CondenserWaterFlowRateVsCoolingLoad": `navName==""`, // TODO: QA
    "Chiller(s)Efficiency": `efficiency and equipRef->navName=="Chiller Total"`,// TODO: QA
    "ChilledWaterPump(s)Efficiency": `efficiency and equipRef->navName=="Primary Chilled Water Pump Total"`, // TODO: QA
    "CondenserWaterPump(s)Efficiency": `efficiency and equipRef->navName=="Condenser Water Pump Total"`, // TODO: QA
    "CoolingTower(s)Efficiency": `efficiency and equipRef->navName=="Cooling Tower Total"`, // TODO: QA
    "OverallChillerPlantEfficiency": `navName=="PltEff"`, // TODO: QA
}

const keyMapping = [
    "11pm-7am", "7am-11pm"
]

function calculateAverageV0ByTimeRange(data) {
    const result = data.reduce((acc, item) => {
        if (item.v0 === undefined) return acc;

        const localTime = new Date(item.ts);
        localTime.setMinutes(localTime.getMinutes() + item.tsOffset);

        const hours = localTime.getHours();

        const is11pmTo7pa = hours > 7 || hours <= 23;
        const key = is11pmTo7pa ? '11pm-7am' : '7am-11pm';

        acc[key].sum += item.v0;
        acc[key].count++;

        return acc;
    }, {
        '11pm-7am': { sum: 0, count: 0 },
        '7am-11pm': { sum: 0, count: 0 }
    });

    const averages = {}

    keyMapping.map((val) => {
        averages[val] = result[val].count > 0 ? result[val].sum / result[val].count : 0
    })


    return averages
}

function calculateCoolingLoadDensity(area, info) {
    if (!info['CoolingLoadRT']) return
    info['CoolingLoadDensity'] = {}
    keyMapping.map((val) => {
        info['CoolingLoadDensity'][val] = (Number(area)/Number(info['CoolingLoadRT'][val])).toFixed(2)
    })
}

// function calculateHeatReject(info) {
//     if (!info['CondenserHeatRejection']) return

//     keyMapping.map((val) => {
//         var temperature = Number(info[''][val]) - Number(info[''][val])
//         info['CondenserWaterFlowRateVsCoolingLoad'][val] = ((Number(info['CondenserHeatRejection'][val]) * 4.19 * temperature)/3.517).toFixed(2)
//     })
// }

function calculateFlowRateVsCoolingLoad(info) {
    if (!info['CoolingLoadRT'] || !info['CondenserHeatRejection']) return
    info['ChilledWaterFlowRateVsCoolingLoad'] = {}
    info['CondenserWaterFlowRateVsCoolingLoad'] = {}

    keyMapping.map((val) => {
        info['ChilledWaterFlowRateVsCoolingLoad'][val] = (Number(info['CoolingLoadRT'][val])/Number(info['ChilledWaterFlowRate'][val])).toFixed(2)

        info['CondenserWaterFlowRateVsCoolingLoad'][val] = (Number(info['CondenserHeatRejection'][val])/Number(info['CondenserWaterFlowRate'][val])).toFixed(2)
    })
}

function calculateInfo(info) {
    var area = 100 //TODO:
    console.log("info")

    calculateCoolingLoadDensity(area, info)
    // calculateHeatReject(info)
    calculateFlowRateVsCoolingLoad(info)
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
                    const res = calculateAverageV0ByTimeRange(queryData);
                    info[type] = { ...res };
                    resolve();
                }
            );
        });
    });

    await Promise.all(promises);
    console.log(info)
    const area = 100; // TODO: Replace with actual value
    calculateCoolingLoadDensity(area, info);
    calculateFlowRateVsCoolingLoad(info);

    console.log("Final Info:", info);
}

fetchAndProcessData();