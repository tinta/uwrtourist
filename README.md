[Underwater Rugby Tourist](https://www.uwrtourist.org/)
==============

An underwater rugby aficionado's best friend. Find a team to practice with, wherever you are.

## Requirements
At a high level, this project requires python (python2.7, [pip](https://pip.pypa.io/en/latest/), [virtualenv](http://docs.python-guide.org/en/latest/dev/virtualenvs/)) and node ([npm](https://www.npmjs.com/)), and it assumes that you already have these packages installed globally. Everything else it will install with `bin/setup_project`.

More information about server-side requirements can be found in [server/requirements-dev.txt](https://github.com/tinta/uwrtourist/blob/master/server/requirements-dev.txt). More information about client-side requirements can be found in [client/package.json](https://github.com/tinta/uwrtourist/blob/master/client/package.json).

## Setting up a dev environment

    bin/setup_project

This installs server and client-side requirements, and sets up a dev sqlite instance, pre-populated with fixtures.

## Starting the dev server

    bin/runserver

The dev server runs on [localhost:30311](localhost:30311).

## Client-Side Development

Available CLI commands, their flags and their default values are listed below.
They must be run from the `./client` directory.

| Executable | Action |
| :--- | :--- |
| `npm start` | Boots Flask and Gulp's build and watch tasks.
| `npm start -- build` | Compiles SCSS and JS files once. It runs the `scss:build` and `js:build` tasks.
| `npm start -- scss:build` | Compiles SCSS files once. Dumps `./client/resources/build/build.css`
| `npm start -- js:build` | Compiles JS files once. Dumps `./client/resources/build/index.js`


## Opening a Flask REPL with the app loaded

    cd server/
    python
    >>>  from uwrtourist.routes import app
    >>>  from uwrtourist.models import db
    >>>  with app.app_context():
    >>>     # do your stuff

## Contributing

Open an issue, fork the repo, or contact either of the maintainers: <hi@xmunoz.com> and <me@walterroman.com>.

## License

MIT
