this.ractive.fire("obtainData");

var template = this;
var model = this.ractive;

const keyOrder = ['id', 'description', 'brand', 'type', 'plateMotor', 'coolingCap', 'chilledWater', 'eff', 'year'];

function updateCsvFile(updatedRows){
    const formattedRows = formatJsonString(updatedRows);
    console.log(formattedRows);
    finstack.eval(formattedRows + ".ioWriteCsv(`io/test.csv`)", function (data) {
        queryData = data.result.toObj();
        console.log(queryData);
    });
}

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

model.on("openModal", function (event) {
    changeModalStatus()
})

model.on("closeModal", function (event) {
    changeModalStatus()
})

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

model.on("downloadTemplate", function (event) {
    download("template.csv",keyOrder.join(","));
})

function validateCsvHeader(csv) {
    const lines = csv.trim().split("\n");
    const headers = lines[0].split(",").map(header => header.trim());

    return headers.length === keyOrder.length && headers.every((header, index) => header === keyOrder[index]);
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

model.on("addCsvFile", async function (event) {
    const input = template.view.querySelector("#csvFileInput");
    const file = input.files[0];
    if (!file) {
        console.log("No file selected.");
        return;
    }

    const reader = new FileReader();
    const rows = this.get("rows");
    reader.onload = function (event) {
        const csvContent = event.target.result;
        const isValid = validateCsvHeader(csvContent);

        if (!isValid) {
            console.log("CSV headers do not match the required format.");
            return;
        }

        const csvContentFormat = csvToArray(csvContent);
        csvContentFormat.forEach(row => {
            model.push('rows', row);
        })
        updateCsvFile(rows)
    };
    
    reader.readAsText(file);
    
    changeModalStatus()
})

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
