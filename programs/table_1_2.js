var template = this;

var selectTarget = template.view.querySelector(".selectTable");
var tableTypeSelected = selectTarget.value;

const tableHeaderMapping = {
    table1:  ['ID', 'Description', 'Brand', 'Type', 'Name plate motor (kW)', 'Total Cooling Capacity (RT)', 'Chilled water LWT/EWT', 'Rated Efficiency kW/RT', 'Year Installed'],
    table2: ['ID', 'Brand', 'Type', 'Name plate motor (kW)', 'Pump Head (m)', 'Flow rate (L/S)', 'Rated Pump/Fan efficiency', 'Rated Motor Efficiency']
}

const keyOrderMapping = {
    table1: ['id', 'description', 'brand', 'type', 'plateMotor', 'coolingCap', 'chilledWater', 'eff', 'year'],
    table2: [
        "id",
        "brand",
        "type",
        "plateMotor",
        "pumpHead",
        "flowRate",
        "fanEff",
        "motorEff",
      ]
}

const fileName = {
    table1: "table1.csv",
    table2: "table2.csv"
}

function resortKeys(obj) {
    return keyOrderMapping[tableTypeSelected].reduce((acc, key) => {
        if (key in obj) {
            acc[key] = obj[key];
        }
        return acc;
    }, {});
}

const ensureKeysInObjects = (array) => {
    return array.map(obj => {
        keyOrderMapping[tableTypeSelected].forEach(key => {
            if (!obj.hasOwnProperty(key)) {
                obj[key] = '';
            }
        });
        return obj;
    });
};

async function fetchAndProcessData() {
    let info = [];

    const promises = new Promise((resolve) => {
        finstack.eval("ioReadCsv(`io/"+fileName[tableTypeSelected]+"`)", function (data) {
            const queryData = data.result.toObj();
            console.log(queryData);
            info = queryData;
            resolve();
        });
    });

    await promises;

    
    if(info.length === 0) {
        const createNewPromises = new Promise((resolve) => {
            finstack.eval("[].ioWriteCsv(`io/"+fileName[tableTypeSelected]+"`)", function (data) {
                resolve();
            });
        });
        await createNewPromises
        console.log("Create new file", fileName[tableTypeSelected]);
    }

    console.log("Final Info:", info);
    let newArray = info.map(({ dis, ...rest }) => rest);
    newArray = ensureKeysInObjects(newArray)
    const newSortArray = newArray.map(obj => resortKeys(obj));
    template.rows = newSortArray;
    template.headers = tableHeaderMapping[tableTypeSelected]
    console.log("Rows", template.rows);
}
fetchAndProcessData();