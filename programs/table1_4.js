var template = this;
var model = this.ractive

const keyOrderMapping = model.get("keyOrderMapping")

const fileName = model.get("fileName")

const tableArr = model.get("tableArr")

let tempRows = tableArr.reduce((acc, curr) => {
    acc[curr] = [];
    return acc;
}, {});

function resortKeys(obj, keyArr) {
    return keyArr.reduce((acc, key) => {
        if (key in obj) {
            acc[key] = obj[key];
        }
        return acc;
    }, {});
}

const ensureKeysInObjects = (array, keyArr) => {
    return array.map(obj => {
        keyArr.forEach(key => {
            if (!obj.hasOwnProperty(key)) {
                obj[key] = '';
            }
        });
        return obj;
    });
};

async function fetchAndProcessData(tableKey) {
    let info = [];
    let tableTypeSelected = tableKey
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
    newArray = ensureKeysInObjects(newArray, keyOrderMapping[tableTypeSelected])
    const newSortArray = newArray.map(obj => resortKeys(obj, keyOrderMapping[tableTypeSelected]));
    tempRows[tableKey]= newSortArray;
    console.log("Rows", tempRows);
}

async function processKeys() {
    const keys = Object.keys(keyOrderMapping);
    const promises = Promise.all(
        keys.map(async (key) => {
            console.log("KeyOrderMapping", key);
            await fetchAndProcessData(key);
        })
    );

    await promises

    template.rows = {...tempRows}
}
processKeys();