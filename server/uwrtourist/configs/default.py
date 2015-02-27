import sys, os, inspect


class DefaultConfig(object):

    BASEDIR = os.path.dirname(os.path.dirname(os.path.abspath(
                                  inspect.getfile(inspect.currentframe())))
    VENV_ACTIVATE = os.path.join(os.path.dirname(BASEDIR), "venv_uwrtourist",
                            "bin", "activate_this.py")
