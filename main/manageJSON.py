"""
    Manages the JSON file/files the program operates with.
"""

import json
import os

def openReadJSON(path):
    """
        Returns a dictionary of a data.json file.
        If file does not exist, returns empty dict.
    """

    data = dict()

    if(os.path.exists(path)):
        with open(path) as json_file:
            data = json.load(json_file)
            json_file.close()
    return data


def writeJSON(path, jsonDict):
    """
        Writes the given dict into a json file.
        jsonDict (dictionary) = A dictionary to 
                                be written to a file
    """

    with open(path, 'w') as json_file:
        json.dump(jsonDict, json_file)
        json_file.close()
    

def getJSON(path, folder):
    """
        Returns the info on given key from the json.
        Returns None if key does not exist.
        key(folder) = Dictionary folder
    """

    data = openReadJSON(path)

    if folder not in data:
        return None

    return data[folder]


def addJSON(path,jsonDict):
    """
        Adds/modifies a section in a JSON file.
        jsonDict (dictionary) = A dictionary to 
                                be added to a JSON-file
    """

    if(os.path.exists(path)):
        data = openReadJSON(path)
        data.update(jsonDict)
        writeJSON(path,data)
    else:
        writeJSON(path,jsonDict)


def compareJSON(path,folder,jsonDict):
    """
        Finds out, whether given dict section in JSON has been modified.
        jsonDict (dictionary) = A dictionary to 
                                be compared in the JSON-file.
        
        Returns a list of filenames modified,
        list of missing files,
        and a list of new files
        
        Returns None if folder does not exist in database
    """

    missingFiles = []
    modifiedFiles = []
    newFiles = []
    
    # Data stored in the JSON
    data = getJSON(path,folder)

    # Check whether folder exists in JSON.
    if data == None:
        #print(path)
        #print(folder)
        #print(jsonDict)
        return [], [], []

    for key in data:
        # Check if file is missing:
        if key not in jsonDict:
            missingFiles.append(key)
        # Check if file has been modified:
        elif data[key] != jsonDict[key]:
            modifiedFiles.append(key)

    for key in jsonDict:
        # Check if file is new
        if key not in data:
            newFiles.append(key)

    return missingFiles, modifiedFiles, newFiles


def deleteFolderJSON(path,folder):
    """
        Deletes a section from the JSON file.
        jsonDict (dictionary) = A dictionary to 
                                be removed from the JSON-file.
        Return True if success, else returns false
    """
    
    data = openReadJSON(path)

    # Check, whether the folder exists.
    if folder not in data:
        return False

    del data[folder]
    writeJSON(path,data)

    return True


def deleteFileJSON(path,folder,file):
    """
        Deletes a section from the JSON file.
        jsonDict (dictionary) = A dictionary to 
                                be removed from the JSON-file.
        Return True if success, else returns false
    """

    data = openReadJSON(path)

    if folder not in data:
        return False
    elif file not in data[folder]:
        return False

    del data[folder][file]
    writeJSON(path,data)

    return True