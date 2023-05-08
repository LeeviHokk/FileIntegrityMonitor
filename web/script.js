
// Default Messages
const folderFailed = "No such folder exists.";
const jsonFailed = "No such JSON exists.";
const folderSuccess = "Folder was successfully loaded.";
const jsonSuccess = "JSON was successfully loaded.";
const saveSuccess = "Data was successfully saved.";
const saveFailed = "Data saving failed."

// Span Label
const message =  document.getElementById("message_id");

// Submit buttons
const jsonButton = document.getElementById("JSON_button");
const folderButton = document.getElementById("folder_button");
const saveButton = document.getElementById("save_button");

// Text Input Fields
const jsonField = document.getElementById("jsonSearch");
const folderField = document.getElementById("folderSearch");
const saveField = document.getElementById("jsonSave");

// Table
const tableContainer = document.getElementById("table_body");

let tableObjects = {};
let loadedJSON;


function addMessage(msg)
{   
    message.textContent = msg;
}

function makeTable(obj) {

    tableContainer.innerHTML = "";
    let headings = Object.keys(obj);

    // Iterate folders.
    for(let i=0; i<headings.length; i++)
    {

        let folderName = headings[i];
        let filesHash = obj[folderName];
        let fileNames = Object.keys(filesHash);

        let headRow = document.createElement("tr");
        let th1 = document.createElement("th");
        let th2 = document.createElement("th");

        th1.textContent = folderName;
        headRow.appendChild(th1);
        headRow.appendChild(th2);

        tableContainer.appendChild(headRow);

        // Iterate files
        for(let j=0; j<fileNames.length; j++)
        {
            let fileName = fileNames[j];

            let row = document.createElement("tr");
            let td1 = document.createElement("td");
            let td2 = document.createElement("td");

            td1.textContent = fileName.replace(folderName+'\\','');
            td2.textContent = filesHash[fileName];

            row.appendChild(td1);
            row.appendChild(td2);
            tableContainer.appendChild(row);
        }
    }
}

async function getDifference(jObject)
{
    let folderNames = Object.keys(jObject);
    let differences = {};

    if(loadedJSON == undefined)
    {
        return differences;
    }

    // Iterate folders
    for(let i=0; i<folderNames.length; i++)
    {
        let folderName = folderNames[i];
        differences[folderName] = {};

        // If folder is not in tableContainer
        // Everything in it is new.
        if(tableContainer[folderName] == undefined)
        {
            differences[folderName]["missing"] = [];
            differences[folderName]["modified"] = [];
            differences[folderName]["new"] = Object.keys(jObject[folderName]);
        }

        let inputString = JSON.stringify({folderName : jObject[folderName]});
        let dString = await eel.get_difference(loadedJSON,inputString)();
        let dObject = JSON.parse(dString);

        differences[folderName]["missing"] = dObject["missing"];
        differences[folderName]["modified"] = dObject["modified"];
        differences[folderName]["new"] = dObject["new"];
    }

    return differences;
}

function removeDifferences(jObject,differences)
{
    let folderNames = Object.keys(jObject);

    for(let i=0; i<folderNames.length; i++)
    {
        let folderName = folderNames[i];
        
        let missingFiles = differences[folderName]["missing"];
        let modifiedFiles = differences[folderName]["modified"];
        let newFiles = differences[folderName]["new"];

        // The folder files are up to date.
        if(missingFiles.length   == 0 &&
            modifiedFiles.length == 0 &&
            newFiles.length      == 0)
        {
            continue;
        }

        for(let j=0; j<missingFiles.length; j++)
        {
            fileName = missingFiles[j];
            tableObjects[folderName][fileName] += "---";
        }
        for(let j=0; j<modifiedFiles.length; j++)
        {
            fileName = modifiedFiles[j];
            tableObjects[folderName][fileName] += "=>";
            tableObjects[folderName][fileName] += jObject[folderName][fileName];
        }
        for(let j=0; j<newFiles.length; j++)
        {
            fileName = modifiedFiles[j];
            tableObjects[folderName][fileName] = jObject[folderName][fileName];
        }
    }

    return tableObjects;
}

// Loads JSON:
jsonButton.addEventListener("click", async (event) => {

    let path = jsonField.value;

    let jString = await eel.get_history(path)();
    let jObject = JSON.parse(jString);

    if(Object.keys(jObject).length != 0)
    {
        makeTable(jObject);
        addMessage(jsonSuccess);

        tableObjects = jObject;
        loadedJSON = path;
    }
    else
    {
        addMessage(jsonFailed);
    }
})

// Loads folders:
folderButton.addEventListener("click", async (event) => {

    let path = folderField.value;

    let jString = await eel.get_folder(path)();
    let jObject = JSON.parse(jString);

    if(Object.keys(jObject).length != 0)
    {

        let differences = await getDifference(jObject);
        if(Object.keys(differences).length != 0)
        {
            removeDifferences(jObject,differences);
        }
        else
        {
            tableObjects = jObject;
        }

        addMessage(folderSuccess);
        makeTable(tableObjects);
    }
    else
    {
        addMessage(folderFailed);
    }
})

// Saves the JSON
saveButton.addEventListener("click", async (event) => {

    let path = folderField.value;

    let jString = await eel.save(path)();
    let jObject = JSON.parse(jString);

    if(Object.keys(jObject).length != 0)
    {
        eel.save(path, tableObjects);
        addMessage(saveSuccess);
    }
    else
    {
        addMessage(jsonFailed);
    }
})