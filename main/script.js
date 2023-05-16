
// Default Messages
const folderFailed = "No such folder exists.";
const jsonFailed = "No such JSON exists.";
const folderSuccess = "Folder was successfully loaded.";
const jsonSuccess = "JSON was successfully loaded. Load a folder to add";
const saveSuccess = "Data was successfully saved.";
const saveFailed = "Data saving failed."
const loading = "Loading...";

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
//var worker = undefined;


function addMessage(msg)
{   
    message.textContent = msg;
}


function switch_buttons()
{
    let buttons = document.getElementsByClassName("button");
    let status = buttons[0].disabled;

    for(let i=0; i<buttons.length; i++)
    {
        buttons[i].disabled = !status;
    }
}

function isChanged(input)
{

    let str = input.slice(-3);
    let status;

    switch (str)
    {
        case '+++':
            status = "New";
            break;
        case '---':
            status = "Missing";
            break;
        case '***':
            status = "Modified";
            break;
        default:
            status = "Default";
            break;
    }

    return status;
}

function updateTableObjects(paths, jObject)
{
    // Iterate folders
    for(let i=0; i<paths.length; i++)
    {
        tableObjects[paths[i]] = jObject[paths[i]];
    }
}

function makeTable(obj) {

    tableContainer.innerHTML = "";
    let headings = Object.keys(obj);

    titles = document.createElement("tr");
    titles.innerHTML = '<th>Name</th><th>Hash</th><th>Status</th>';
    tableContainer.appendChild(titles);

    // Iterate folders.
    for(let i=0; i<headings.length; i++)
    {

        let folderName = headings[i];
        let filesHash = obj[folderName];
        let fileNames = Object.keys(filesHash);

        let headRow = document.createElement("tr");
        let th1 = document.createElement("th");
        let th2 = document.createElement("th");
        let th3 = document.createElement("th");

        th1.textContent = folderName;
        headRow.appendChild(th1);
        headRow.appendChild(th2);
        headRow.appendChild(th3);

        tableContainer.appendChild(headRow);

        // Iterate files
        for(let j=0; j<fileNames.length; j++)
        {
            let fileName = fileNames[j];
            let hash = filesHash[fileName];
            let rowClass = isChanged(hash);

            let row = document.createElement("tr");
            row.setAttribute("class",rowClass);
            let td1 = document.createElement("td");
            let td2 = document.createElement("td");
            let td3 = document.createElement("td");

            if(rowClass != "Default")
            {
                td3.textContent = rowClass;
                hash = hash.substring(0,hash.length-3);
                tableObjects[folderName][fileName] = hash;
                hash = tableObjects[folderName][fileName];
            }

            td1.textContent = fileName.replace(folderName+'\\','');
            td2.textContent = hash;
            
            row.appendChild(td1);
            row.appendChild(td2);
            row.appendChild(td3);
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

        // If folder is not in tableObjects
        // Everything in it is new.
        if(tableObjects[folderName] == undefined)
        {
            differences[folderName]["missing"] = [];
            differences[folderName]["modified"] = [];
            differences[folderName]["new"] = Object.keys(jObject[folderName]);
            continue;
        }

        let obj = {};
        obj[folderName] = jObject[folderName];

        let inputString = JSON.stringify(obj);
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

        // Checks, which files are missing.
        for(let j=0; j<missingFiles.length; j++)
        {
            fileName = missingFiles[j];
            tableObjects[folderName][fileName] += "---";
        }
        // Checks, which files have been modified.
        for(let j=0; j<modifiedFiles.length; j++)
        {
            fileName = modifiedFiles[j];
            tableObjects[folderName][fileName] = jObject[folderName][fileName];
            tableObjects[folderName][fileName] += "***";
        }
        // Checks, which files have been added.
        for(let j=0; j<newFiles.length; j++)
        {
            fileName = newFiles[j];
            tableObjects[folderName][fileName] = jObject[folderName][fileName];
            tableObjects[folderName][fileName] += "+++";
        }
    }

    //return tableObjects;
}

// Loads JSON:
jsonButton.addEventListener("click", async (event) => {

    switch_buttons();
    addMessage(loading);

    let path = jsonField.value;

    let jString = await eel.get_history(path)();
    let jObject = JSON.parse(jString);

    if(Object.keys(jObject).length != 0)
    {
        // Loading new JSON resets the table and tableObjects.
        tableObjects = {};
        updateTableObjects(Object.keys(jObject),jObject);
        loadedJSON = path;

        makeTable(jObject);
        addMessage(jsonSuccess);
    }
    else
    {
        addMessage(jsonFailed);
    }

    switch_buttons();
})

// Loads folders:
folderButton.addEventListener("click", async (event) => {

    switch_buttons();
    addMessage(loading);

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
            updateTableObjects([path], jObject);
        }

        addMessage(folderSuccess);
        makeTable(tableObjects);
    }
    else
    {
        addMessage(folderFailed);
    }

    switch_buttons();
})

// Saves the JSON
saveButton.addEventListener("click", async (event) => {

    switch_buttons();
    addMessage(loading);

    let path = saveField.value;

    folders = Object.keys(tableObjects);

    if(folders.length != 0)
    {
        // Iterate folders
        for(let i=0; i<folders.length; i++)
        {
            let jObject = {}; 
            jObject[folders[i]] = tableObjects[folders[i]];
            let jString = JSON.stringify(jObject);

            eel.save(path, jString);
        }
        addMessage(saveSuccess);
    }
    else
    {
        addMessage(jsonFailed);
    }

    switch_buttons();
})