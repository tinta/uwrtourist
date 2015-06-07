from flask import Flask, render_template, request
from flask.ext.babel import Babel, gettext
from models import db, get_teams, get_team
import os

# set up app
app = Flask(__name__)
db.init_app(app)

app.jinja_env.add_extension('pyjade.ext.jinja.PyJadeExtension')

environment = os.environ.get("UWR_ENVIRONMENT")
if environment == "prod":
    from configs.prod import ProdConfig
    app.config.from_object(ProdConfig)
else:
    from configs.dev import DevConfig
    app.config.from_object(DevConfig)

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
    return render_template("pages/about.jade", title=title)

@app.route("/teams")
def teams():
    title = gettext("Teams")
    teams = get_teams(format="json")
    return render_template("pages/teams.jade", title=title, teams=teams)

@app.route("/team/<tid>")
def team(tid):
    team_data = get_team(tid, format="json")
    if not team_data:
        return pnf()
    return render_template("pages/team.jade", title=team_data["name"], team=team_data["json"])

@app.route("/add-new-team", methods=["GET", "POST"])
def addform():
    if request.method == "POST":
        # process the submission
        pass
    else:
        # show the login form
        title = gettext("Add a New Team")
        return render_template("pages/add.jade", title=title)

@app.route("/oauth2callback")
def oauthcallback():
    return None

# @app.route("/competitions")
# def competitions():
#     title = gettext("Competitions")
#     return render_template("pages/competitions.jade", title=title)

@app.errorhandler(404)
def page_not_found(e):
    return pnf()

@app.errorhandler(500)
def site_down(e):
    return render_template("500.jade", error=e), 500

# helper methods
def pnf():
    title = gettext("Page Not Found")
    return render_template("404.jade", title=title), 404

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
                "url": "/add-new-team",
                "title": "Add Your Team",
            },
        ]

        if other_routes:
            self.routes += other_routes
