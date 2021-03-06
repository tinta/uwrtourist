import os

class ProdConfig:
    TESTING = False
    DEBUG = False
    DATABASE = "mysql"
    DATABASE_NAME = "uwrtourist"
    DATABASE_USER = "uwr"
    DATABASE_PASSWORD = os.environ.get("MYSQL_PW")
    MAIL_SERVER = "aspmx.l.google.com"
    MAIL_PORT = 25

    SQLALCHEMY_DATABASE_URI = "{}://{}:{}@localhost/{}"\
                                .format(DATABASE, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME)
