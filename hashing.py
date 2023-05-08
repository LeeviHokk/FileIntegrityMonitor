"""
    Contains various hashing functions.
"""

import hashlib

# TODO
# Add better hashing.

def read_hash(filename):
   """
        Calculates SHA-1 hash to a given file.
        
        Params:
        filename (string) = Path to the hashed file.

        Returns:
        (string) SHA-1 hexdigest of the given file.

   """

   # Hash object
   hash = hashlib.sha1()
   bufferSize = 64

   # Reading the file in binary mode:
   with open(filename,'rb') as file:
       chunk = 0
       while chunk != b'':
           chunk = file.read(bufferSize)
           hash.update(chunk)

   return hash.hexdigest()


    