from flask import Flask, render_template, request, redirect, url_for, flash, Response, jsonify
from flask.ext.babel import Babel, gettext
from flask_mail import Mail, Message

from models import db, get_teams, create_team
import os
import json
from pprint import pprint

mail = Mail()

# set up app
app = Flask(__name__)
db.init_app(app)
mail.init_app(app)

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
    return { "pages" : Navbar().routes}

@app.route("/")
def homepage():
    title = False
    teams = get_teams(format="json", status="active")
    return render_template("pages/home.jade", title=title, teams=teams)

@app.route("/about")
def about():
    title = gettext("About")
    return render_template("pages/about.jade", title=title)

@app.route("/teams")
def teams():
    title = gettext("Teams")
    teams = get_teams(format="json", status="active")
    return render_template("pages/teams/index.jade", title=title, teams=teams)

@app.route("/team/<tid>")
def team(tid):
    teams = get_teams(id=tid, status="active")
    if not teams or not teams[0]:
        return pnf()
    team = teams[0];

    return render_template("pages/team/index.jade", title=team.name, team=team)

@app.route("/team/add", methods=["GET", "POST"])
def addform():
    if request.method == "POST":
        # synchronous mail sending is totally slow, considering putting this in a queue
        msg = Message("New team")
        msg.body = "testing"
        msg.recipients = ["bananaunderpants@googlegroups.com"]
        msg.sender = "no-reply@validation.uwrtourist.org"
        mail.send(msg)

        title = gettext("Add a New Team")
        return render_template("pages/add-team/submission-confirmation.jade", title=title)
    else:
        # show the login form
        title = gettext("Add a New Team")
        return render_template("pages/add-team/index.jade", title=title)

@app.route("/admin")
def admin():
    title = gettext("Pending Teams")
    teams = get_teams(status="pending", format="json")
    return render_template("pages/teams/index.jade", title=title, teams=teams)

@app.route("/admin/team/add", methods=["GET", "POST"])
def admin_add():
    if request.method == "POST":
        result = create_team(request.json)
        response_json = jsonify({"result": result})
        response_json.status_code = 200
        return response_json 
    else:
        # show the add team form
        title = gettext("Add a new team")
        return render_template("pages/add-team/index.jade", title=title)

@app.route("/admin/team/edit/<tid>", methods=["GET", "POST"])
def admin_edit(tid):
    title = gettext("Edit Team")
    if request.method == "POST":
        # process post data and display a success message
        msg = "Success!"
        result_json = jsonify({"result": msg})
        result_json.status_code = 200
        return result_json
    else:
        teams = get_teams(id=tid)
        team_is_found = len(teams) is 1
        if (team_is_found):
            team = json.dumps(teams[0].as_dict())
            return render_template("pages/add-team/index.jade", title=title, team=team)
        else:
            return pnf()

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
    def __init__(self):
        routes = [
            {
                "url": "/about",
                "title": "About"
            },
            {
                "url": "/teams",
                "title": "Teams"
            },
            {
                "url": "/team/add",
                "title": "Add Your Team"
            },
        ]

        self.routes = routes
