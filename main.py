"""
    Initializes the eel interface and interfaces between it and the Python files.
"""

import eel
import fileManagement
import manageJSON
import json

eel.init("web")

@eel.expose
def get_folder(path):
    """
        Returns a JSON-string of files in a folder 
        chained to their hashes.
    """
    files = fileManagement.load_folder(path)
    return json.dumps(files)


@eel.expose
def get_history(path):
    """
        Gets history from memory.
    """
    files = manageJSON.openReadJSON(path)
    return json.dumps(files)


@eel.expose
def get_difference(path,jsonString):
    """
        Gets the difference.
        path = JSON path
    """

    jsonDict = json.loads(jsonString)
    folder = list(jsonDict.keys())[0]
    missingFiles, modifiedFiles, newFiles = manageJSON.compareJSON(path,folder,jsonDict)
    dictionary = {"missing" : missingFiles,
                  "modified" : modifiedFiles,
                  "new" : newFiles}
    return json.dumps(dictionary)


@eel.expose
def save(path, jsonString):
    """
        Saves the given JSON-string to memory.
    """
    dictionary = json.loads(jsonString)
    manageJSON.addJSON(path,dictionary)


eel.start("index.html")
