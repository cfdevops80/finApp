var template = this;

const keyOrder = ['id', 'description', 'brand', 'type', 'plateMotor', 'coolingCap', 'chilledWater', 'eff', 'year'];

function resortKeys(obj) {
    return keyOrder.reduce((acc, key) => {
        if (key in obj) {
            acc[key] = obj[key];
        }
        return acc;
    }, {});
}

const ensureKeysInObjects = (array) => {
    return array.map(obj => {
        keyOrder.forEach(key => {
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
        finstack.eval("ioReadCsv(`io/test.csv`)", function (data) {
            const queryData = data.result.toObj();
            console.log(queryData);
            info = queryData;
            resolve();
        });
    });

    await promises;

    console.log("Final Info:", info);
    let newArray = info.map(({ dis, ...rest }) => rest);
    newArray = ensureKeysInObjects(newArray)
    const newSortArray = newArray.map(obj => resortKeys(obj));
    template.rows = newSortArray;
    console.log("Rows", template.rows);
}
fetchAndProcessData();