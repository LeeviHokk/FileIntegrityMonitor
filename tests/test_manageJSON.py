"""
    Unit tests for manageJSON.py
"""

import sys
from unittest import TestCase
sys.path.append('..')
import manageJSON as manageJSON

def test_writeJSON():
    """Normal case"""
    manageJSON.writeJSON("testData.json",{"folder_1" : {"file1" : "2efrgsres",
                                                          "file2" : "sweijropwejf",
                                                          "folder_2" : "folder"},
                                        "folder_3" : {"file3" : "fdbsg3h4bwwher"}})
    object = manageJSON.openReadJSON("testData.json")
    assert object["folder_3"]["file3"] == "fdbsg3h4bwwher"

def test_openReadJSON():
    """Normal case"""
    object = manageJSON.openReadJSON("testData.json")
    #assert type(object) is dict
    assert object["folder_1"]["folder_2"] == "folder"

def test_getJSON_1():
    """Normal case"""
    data = manageJSON.getJSON("testData.json","folder_3")
    assert data["file3"] == "fdbsg3h4bwwher"

def test_getJSON_2():
    """With folder that doesn't exist."""
    data = manageJSON.getJSON("testData.json","This_folder_does_not_exist")
    assert data == None
    
def test_addJSON():
    """Normal case"""
    manageJSON.addJSON("testData.json", {"folder_4" : {"file4" : "3rrfgtsea"}})
    data = manageJSON.getJSON("testData.json","folder_4")
    assert data["file4"] == "3rrfgtsea"

def test_compareJSON_1():
    "Normal case"
    missing, modified, new = manageJSON.compareJSON("testData.json", "folder_1", 
                                              {"file1" : "2efrgsres",
                                                "file2" : "sdfjf",
                                                "newFile" : "34t5ythjm",
                                                "folder_69" : "folder"})
    assert "folder_2" in missing and "file2" in modified and "newFile" in new

def test_compareJSON_2():
    "With folder that doesn't exist."
    missing, modified, new = manageJSON.compareJSON("testData.json", 
                                               "This_folder_does_not_exist", 
                                              {"file1" : "2efrgsres",
                                                "file2" : "sdfjf",
                                                "folder_69" : "folder"})
    assert missing == [] and modified == [], new == []
    
def test_deleteFolderJSON():
    """Normal case"""
    status = manageJSON.deleteFolderJSON("testData.json","folder_3")
    dictThatDoesNotExist = manageJSON.getJSON("testData.json","folder_3")

    assert status == True and dictThatDoesNotExist == None

def test_deleteFileJSON():
    """Normal case"""
    status = manageJSON.deleteFileJSON("testData.json","folder_1","file1")
    dictionary = manageJSON.getJSON("testData.json","folder_1")

    assert status == True and "file1" not in dictionary