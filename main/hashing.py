"""
    Contains various hashing functions.
"""

import hashlib

# TODO
# Implement file encryption.

#import base64
#from Crypto.Cipher import AES
#from Crypto import Random
#from Crypto.Protocol.KDF import PBKDF2

"""def deriveKey(password):

    password = bytes(password,'UTF-8')
    salt = 8
    key = PBKDF2(password, salt, 64)
    return key


def AES_256_encrypt(filename, password):
    key = deriveKey(password)
    cipher = AES.new(key, AES.MODE_EAX)


def AES_256_decrypt(filename, password):"""


def read_hash(filename):
   """
        Calculates SHA-1 hash to a given file.
        
        Params:
        filename (string) = Path to the hashed file.

        Returns:
        (string) SHA-256 hexdigest of the given file.

   """

   # Hash object
   hash = hashlib.sha256()
   bufferSize = 64

   # Reading the file in binary mode:
   with open(filename,'rb') as file:
       chunk = 0
       while chunk != b'':
           chunk = file.read(bufferSize)
           hash.update(chunk)

   return hash.hexdigest()


    