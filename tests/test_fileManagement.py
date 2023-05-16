import sys
from unittest import TestCase
sys.path.append('..')
import fileManagement as fileManagement

def test_checkPath():
    """True case"""
    assert fileManagement.checkPath("testFolder/test1.txt") == True

def test_checkPath():
    """Invalid case"""
    assert fileManagement.checkPath("testFolder/test69.txt") == False

def test_load_folder_1():
    """Valid Case"""
    dictionary = fileManagement.load_folder("testFolder")
    lst = list(dictionary["testFolder"].keys())
    assert lst == [r"testFolder\test1.txt",r"testFolder\test2.txt",
                   r"testFolder\test3"]
    
def test_load_folder_2():
    """Invalid Case"""
    dictionary = fileManagement.load_folder("thisDoesNotExist")
    assert len(dictionary) == 0

def test_load_folder_2():
    """Invalid Case"""
    dictionary = fileManagement.load_folder("thisDoesNotExist")
    assert len(dictionary) == 0

def test_load_folder_3():
    """Invalid Case"""
    dictionary = fileManagement.load_folder("file.txt")
    assert len(dictionary) == 0