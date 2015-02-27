from default import DefaultConfig

import os

class ProdConfig(DefaultConfig):
    TESTING = False
    DEBUG = False
    DATABASE = "mysql"
    DATABASE_NAME = "uwrtourist"
    DATABASE_USER = "uwr"
