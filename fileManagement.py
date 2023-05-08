import hashing
#import sys
import os


def checkPath(path):
    """
        Checks, whether the given folder or file exists.

        Returns True if yes, else False.
    """

    return os.path.exists(path)


def load_folder(folder):
    """
        Returns a list of filenames and hashes from given folder.
    """

    if(checkPath(folder) == False):
        return {}

    fileHashDict = {}
    for filename in os.listdir(folder):

        pathName = os.path.join(folder,filename)

        # Folders will not be hashed..
        if os.path.isdir(pathName) is False:
            hash = hashing.read_hash(pathName)
            fileHashDict[pathName] = hash
        else:
            fileHashDict[pathName] = "folder"

    return {folder : fileHashDict}


#def load_file(filePath):
    """
        Returns the filename with and hash of a given file
    """

    """if(checkPath(filePath) == False):
        return [], []

    hash = hashing.read_hash(filePath)

    return [filePath], [hash]"""
