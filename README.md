[Underwater Rugby Tourist](http://www.uwrtourist.org/)
==============

An underwater rugby aficionado's best friend. Find a team to practice with, wherever you are.

## Requirements
- Python
    - Flask
- Node
    - Leaflet

## Setting up a dev environment

    bin/setup_project

## Starting the dev server

    bin/runserver

## Opening a Flask REPL with the app loaded

    cd server/
    python
    >>>  from uwrtourist.routes import app
    >>>  from uwrtourist.models import db
    >>>  with app.app_context():
    >>>     # do your stuff

