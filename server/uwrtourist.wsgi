import sys, os, inspect
projectpath = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
activate_venv = os.path.join(os.path.dirname(projectpath), "venv_uwrtourist", "bin", "activate_this.py")
execfile(activate_venv, dict(__file__=activate_venv))
sys.path.append(projectpath)
from routes import app as application
