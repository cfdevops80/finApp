this.ractive.fire("obtainData");

var template = this;
var model = this.ractive;

var tableTypeSelected = "";

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

const refreshType = () => {
    var selectTarget = template.view.querySelector(".selectTable");
    console.log("Current table type:", selectTarget.value );
    return selectTarget.value;
}

function updateCsvFile(updatedRows) {
    const formattedRows = formatJsonString(updatedRows);
    // tableTypeSelected = refreshType()
    console.log(formattedRows);
    finstack.eval(formattedRows + ".ioWriteCsv(`io/"+fileName[tableTypeSelected]+"`)", function (data) {
        queryData = data.result.toObj();
        console.log(queryData);
    });
}
// FIXED
function changeModalStatus() {
    const modal = template.view.querySelector(".modal");
    const overlay = template.view.querySelector(".overlay");
    if (modal.classList.contains("hidden")) {
        modal.classList.remove("hidden")
    }
    else {
        modal.classList.add("hidden")
    }

    if (overlay.classList.contains("hidden")) {
        overlay.classList.remove("hidden")
    }
    else {
        overlay.classList.add("hidden")
    }
}

function validateCsvHeader(csv) {
    // tableTypeSelected = refreshType()
    const lines = csv.trim().split("\n");
    const headers = lines[0].split(",").map(header => header.trim());

    return headers.length === keyOrderMapping[tableTypeSelected].length && headers.every((header, index) => header === keyOrderMapping[tableTypeSelected][index]);
}

function csvToArray(csv) {
    const lines = csv.trim().split("\n");
    const headers = lines[0].split(",");

    const result = lines.slice(1).map(line => {
        const values = line.split(",");
        const obj = {};
        headers.forEach((header, index) => {
            obj[header.trim()] = values[index]?.trim() || "";
        });
        return obj;
    });

    return result;
}

function formatJsonString(obj) {
    const updatedObj = obj.map(obj =>
        Object.fromEntries(
            Object.entries(obj).map(([key, value]) =>
                [key, value === undefined ? '' : value]
            )
        )
    );

    let jsonString = JSON.stringify(updatedObj);
    return jsonString.replace(/"([^"]+)":/g, "$1:");
}

function download(filename, text) {
    console.log("filename", filename);
    console.log("text", text);
    var element = document.createElement('a');
    console.log("element", element);
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
// ----------------------------------
model.on("openModal", function (event) {
    var tableId = event.node.dataset.tableId;
    tableTypeSelected = tableId
    changeModalStatus()
})

model.on("closeModal", function (event) {
    changeModalStatus()
})

model.on("downloadTemplate", function (event) {
    download(fileName[tableTypeSelected], keyOrderMapping[tableTypeSelected].join(","));
})

model.on("addCsvFile", async function (event) {
    const input = template.view.querySelector("#csvFileInput");
    const file = input.files[0];
    if (!file) {
        console.log("No file selected.");
        return;
    }

    const reader = new FileReader();
    const rows = this.get('rows')
    let newRows = {...rows}

    reader.onload = function (event) {
        const csvContent = event.target.result;
        const isValid = validateCsvHeader(csvContent);

        if (!isValid) {
            console.log("CSV headers do not match the required format.");
            return;
        }

        const csvContentFormat = csvToArray(csvContent);
        csvContentFormat.forEach(row => {
            console.log(row);
            newRows[tableTypeSelected].push(row)
        })
        model.set("rows", newRows)

        updateCsvFile(newRows[tableTypeSelected])
    };
    
    reader.readAsText(file);
    
    changeModalStatus()
})

model.on("addNewRow", function (event) {
    console.log("event", event);
    var tableId = event.node.dataset.tableId;
    tableTypeSelected = tableId

    const newRow = keyOrderMapping[tableTypeSelected].reduce((obj, key) => {
        obj[key] = '';
        return obj;
    }, {});

    const rows = this.get('rows')
    let newRows = {...rows}
    newRows[tableTypeSelected].push(newRow)

    this.set("rows", newRows);
});

model.on("deleteRow", function (event) {
    console.log("Delete Row", event);

    var tableId = event.node.dataset.tableId;
    tableTypeSelected = tableId

    const rowIndex = Number(event.node.dataset.rowIndex);

    const rows = this.get('rows');
    let newRows = {...rows}

    newRows[tableTypeSelected].splice(rowIndex, 1);

    this.set("rows", newRows);
    updateCsvFile(newRows[tableTypeSelected])
})

model.on("cellInput", function (event) {
    const rowIndex = Number(event.node.dataset.rowIndex);
    const cellKey = event.node.dataset.cellIndex;
    const value = event.node.innerText.trim();
    const tableName = event.node.dataset.tableId;
    tableTypeSelected = tableName

    console.log("Cell input detected:", {
        rowIndex,
        cellKey,
        value,
        tableName,
    });


    const rows = this.get("rows")[tableTypeSelected];
    console.log(rows);
    rows[rowIndex][cellKey] = value;
});

model.on("cellBlur", function (event) {
    const rowIndex = Number(event.node.dataset.rowIndex);
    const cellKey = event.node.dataset.cellIndex;
    const value = event.node.innerText.trim();
    const tableName = event.node.dataset.tableId;
    tableTypeSelected = tableName

    console.log("Cell edit finished:", {
        rowIndex,
        cellKey,
        value,
    });

    const rows = this.get("rows")[tableTypeSelected];
    console.log(rows, tableTypeSelected);

    if (rows[rowIndex][cellKey] !== value) {
        rows[rowIndex][cellKey] = value;
        this.set("rows", rows);


    } else {
        console.log("No changes detected; skipping update.");
    }

    const updatedRows = this.get("rows")[tableTypeSelected].map((row, rIdx) =>
        rIdx === rowIndex
            ? (row = { ...row, [cellKey]: value })
            : row
    );
    updateCsvFile(updatedRows)
});
