from uwrtourist import create_app

execfile(conf.VENV_ACTIVATE, dict(__file__=conf.VENV_ACTIVATE))
sys.path.append(conf.BASEDIR)
uwrapp = create_app()
