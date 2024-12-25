var template = this;
var model = this.ractive

const keyOrderMapping = ["title", "daytime", "nighttime", "unit"]

var queryMapping = {
    "CoolingLoadRT": `navName=="PltLoadTotal"`,
    "PowerConsumption": `navName=="PltPowerTotal"`,
    "ChilledWaterSupplyTemperature":`navName=="ChWHeaderSTemp"`,
    "ChilledWaterReturnTemperature":`navName=="ChWHeaderRTemp"`,
    "ChilledWaterDeltaT": `navName=="ChWHeaderDeltaT"`,
    "ChilledWaterFlowRate": `navName=="ChWHeaderFlow"`,
    "CondenserHeatRejection": `navName=="PltHRTotal"`,
    "CondenserWaterSupplyTemperature": `navName=="CWHeaderSTemp"`,
    "CondenserWaterReturnTemperature": `navName=="CWHeaderRTemp"`,
    "CondenserWaterDeltaT": `navName=="CWHeaderDeltaT"`,
    "CondenserWaterFlowRate": `navName=="CWHeaderFlow"`,
    "Chiller(s)Efficiency": `efficiency and equipRef->navName=="Chiller Total"`,// TODO: QA
    "ChilledWaterPump(s)Efficiency": `efficiency and equipRef->navName=="Primary Chilled Water Pump Total"`,
    "CondenserWaterPump(s)Efficiency": `efficiency and equipRef->navName=="Condenser Water Pump Total"`,
    "CoolingTower(s)Efficiency": `efficiency and equipRef->navName=="Cooling Tower Total"`,
    "OverallChillerPlantEfficiency": `navName=="PltEff"`,
}

const tableData = [
    { title: "Cooling Load", unit: "RTh", daytime: null, nighttime: null, keyMap: "CoolingLoadRT" },
    { title: "Power Consumption", unit: "kWh", daytime: null, nighttime: null, keyMap: "PowerConsumption" },
    { title: "Chilled water supply temperature", unit: "°C", daytime: null, nighttime: null, keyMap: "ChilledWaterSupplyTemperature" },
    { title: "Chilled water return temperature", unit: "°C", daytime: null, nighttime: null, keyMap: "ChilledWaterReturnTemperature" },
    { title: "Chilled water delta T", unit: "°C", daytime: null, nighttime: null, keyMap: "ChilledWaterDeltaT" },
    { title: "Chilled water flow rate", unit: "l/s", daytime: null, nighttime: null, keyMap: "ChilledWaterFlowRate" },
    { title: "*Condenser heat rejection", unit: "HRT", daytime: null, nighttime: null, keyMap: "CondenserHeatRejection" },
    { title: "*Condenser water supply temperature", unit: "°C", daytime: null, nighttime: null, keyMap: "CondenserWaterSupplyTemperature" },
    { title: "*Condenser water return temperature", unit: "°C", daytime: null, nighttime: null, keyMap: "CondenserWaterReturnTemperature" },
    { title: "*Condenser water delta T", unit: "°C", daytime: null, nighttime: null, keyMap: "CondenserWaterDeltaT" },
    { title: "*Condenser water flow rate", unit: "l/s", daytime: null, nighttime: null, keyMap: "CondenserWaterFlowRate" },
    { title: "Chiller(s) efficiency", unit: "kW/RT", daytime: null, nighttime: null, keyMap: "Chiller(s)Efficiency" },
    { title: "Chilled water pump(s) efficiency", unit: "kW/RT", daytime: null, nighttime: null, keyMap: "ChilledWaterPump(s)Efficiency" },
    { title: "*Condenser water pump(s) efficiency", unit: "kW/RT", daytime: null, nighttime: null, keyMap: "CondenserWaterPump(s)Efficiency" },
    { title: "*Cooling tower(s) efficiency", unit: "kW/RT", daytime: null, nighttime: null, keyMap: "CoolingTower(s)Efficiency" },
    { title: "Overall chiller plant efficiency", unit: "kW/RT", daytime: null, nighttime: null, keyMap: "OverallChillerPlantEfficiency" },
];

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

function resortKeys(obj, keyArr) {
    return keyArr.reduce((acc, key) => {
        if (key in obj) {
            acc[key] = obj[key];
        }
        return acc;
    }, {});
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
                    tableData.map((e) => {
                        if(e.keyMap == type) {
                            e.daytime = res["7am-11pm"]
                            e.nighttime = res["11pm-7am"]
                        }
                    })
                    resolve();
                }
            );
        });
    });

    await Promise.all(promises);

    console.log("Final Info:", info, tableData);
    let curVal = model.get("fixTableRow")
    // curVal["table5"] = tableData
    let tmpArr = tableData.map(({ keyMap, ...rest }) => rest);
    curVal["table5"] = tmpArr.map(obj => resortKeys(obj, keyOrderMapping));
    console.log(curVal);
    model.set("fixTableRow", curVal);
}

fetchAndProcessData();