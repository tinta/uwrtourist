from default import DefaultConfig

import os

class DevConfig(DefaultConfig):
    DEBUG = True
    DATABASE = "sqlite"
    DATABASE_PATH = os.path.join(BASEDIR, "server", "uwrtourist.sqlite3")
