from flask import Flask, render_template, request
from flask.ext.babel import Babel, gettext
from flask.ext.sqlalchemy import SQLAlchemy
from configs.dev import DevConfig

# set up app
app = Flask(__name__)

app.jinja_env.add_extension('pyjade.ext.jinja.PyJadeExtension')
app.config.from_object(DevConfig)

db = SQLAlchemy(app)
babel = Babel(app)

@app.context_processor
def add_pages():
    return {"pages" : Navbar().routes}

@app.route("/")
def homepage():
    title = False
    return render_template("pages/home.jade", title=title)

@app.route("/about")
def about():
    title = gettext("About")
    return render_template("about.html", title=title)

@app.route("/teams")
def teams():
    title = gettext("Teams")
    return render_template("pages/teams.jade", title=title)

@app.route("/add-new-team", methods=["GET", "POST"])
def addform():
    if request.method == "POST":
        # process the submission
        pass
    else:
        # show the login form
        title = gettext("Add a new team")
        return render_template("pages/add.jade", title=title)

@app.route("/competitions")
def competitions():
    title = gettext("Competitions")
    return render_template("pages/competitions.jade", title=title)

@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.jade"), 404

@app.errorhandler(500)
def site_down(e):
    return render_template("500.jade", error=e), 500

# helper methods
class Navbar:
    def __init__(self, other_routes=[]):
        self.routes = [
            {
                "url": "/about",
                "title": "About",
            },
            {
                "url": "/teams",
                "title": "Teams",
            },
            {
                "url": "/competitions",
                "title": "Competitions",
            },
            {
                "url": "/add-new-team",
                "title": "Add Your Team",
            },
        ]

        if other_routes:
            self.routes += other_routes
