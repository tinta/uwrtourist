#! /usr/bin/env python

from flaskext.mysql import MySQL
from flask_sqlalchemy import SQLAlchemy
from pprint import pprint
import os.path, inspect
from configs.prod import ProdConfig

def create_app(config=ProdConfig):
    app = Flask(__name__)
    app.config.from_object(config)
    return app

def get_db():
    '''
    Return db object.
    '''
    project_dir = os.path.dirname(os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe()))))
    cnf_file = os.path.join(project_dir, ".my.cnf")
    db = connect(host="localhost", db="uwrtourist", user='uwr', read_default_file=cnf_file)
    db.set_character_set('utf8')
    return db

def main():
	pass

if __name__ == '__main__':
    main()