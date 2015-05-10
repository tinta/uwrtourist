import os
import sys

APP_HOME = "/home/cristina/public/uwrtourist/web"

activate_this = os.path.join(APP_HOME, "venv_uwrtourist/bin/activate_this.py")
execfile(activate_this, dict(__file__=activate_this))

sys.path.insert(0, APP_HOME)
os.chdir(APP_HOME)

from uwrtourist.routes import app as application
