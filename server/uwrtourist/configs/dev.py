import os.path, inspect

class DevConfig:
    BASEDIR = os.path.dirname(os.path.dirname(os.path.abspath(
                              inspect.getfile(inspect.currentframe()))))
    DEBUG = True
    DATABASE = "sqlite"
    SQLALCHEMY_DATABASE_URI = "{}:///{}/uwrtourist.db"\
                                .format(DATABASE, BASEDIR)
    SITE_NAME = "Underwater Rugby Tourist"
