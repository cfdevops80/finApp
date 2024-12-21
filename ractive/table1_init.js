this.ractive.fire("obtainData");

var template = this;
var model = this.ractive;


function updateCsvFile(updatedRows){
    const formattedRows = formatJsonString(updatedRows);
    console.log(formattedRows);
    finstack.eval(formattedRows + ".ioWriteCsv(`io/test.csv`)", function (data) {
        queryData = data.result.toObj();
        console.log(queryData);
    });
}

model.on("addNewRow", function (event) {
    console.log("event", event);

    const newRow = {
        id: '',
        description: '',
        brand: '',
        type: '',
        plateMotor: '',
        coolingCap: '',
        chilledWater: '',
        eff: '',
        year: ''
    };
    model.push('rows', newRow);
});

model.on("deleteRow", function (event) {
    console.log("Delete Row", event);

    const rowIndex = Number(event.node.dataset.rowIndex);
    const rows = this.get("rows");
    rows.splice(rowIndex, 1);

    this.set("rows", rows);
    updateCsvFile(rows)
})

function convertArrayToJson(arr) {
    return arr.map((row, idx) => {
        return {
            id: row["id"],
            description: row["description"],
            brand: row["brand"],
            type: row["type"],
            plateMotor: row["plateMotor"],
            coolingCap: row["coolingCap"],
            chilledWater: row["chilledWater"],
            eff: row["eff"],
            year: row["year"],
        };
    });
}

function formatJsonString(obj) {
    // Convert to JSON string without line breaks
    const updatedObj = obj.map(obj => 
        Object.fromEntries(
            Object.entries(obj).map(([key, value]) => 
                [key, value === undefined ? '' : value]
            )
        )
    );

    // Convert to JSON string without line breaks
    let jsonString = JSON.stringify(updatedObj);
    // Remove quotes from property names
    return jsonString.replace(/"([^"]+)":/g, "$1:");
}


model.on("cellInput", function (event) {
    const rowIndex = Number(event.node.dataset.rowIndex);
    const cellKey = event.node.dataset.cellIndex;
    const value = event.node.innerText.trim();

    console.log("Cell input detected:", {
        rowIndex,
        cellKey,
        value,
    });

    const rows = this.get("rows");
    rows[rowIndex][cellKey] = value;
});

model.on("cellBlur", function (event) {
    const rowIndex = Number(event.node.dataset.rowIndex);
    const cellKey = event.node.dataset.cellIndex;
    const value = event.node.innerText.trim();

    console.log("Cell edit finished:", {
        rowIndex,
        cellKey,
        value,
    });

    const rows = this.get("rows");
    
    if (rows[rowIndex][cellKey] !== value) {
        rows[rowIndex][cellKey] = value;
        this.set("rows", rows);

        
    } else {
        console.log("No changes detected; skipping update.");
    }

    const updatedRows = this.get("rows").map((row, rIdx) =>
        rIdx === rowIndex
            ? (row = { ...row, [cellKey]: value })
            : row
    );
    updateCsvFile(updatedRows)
});
