from flask import Flask, render_template, request
from flask.ext.babel import Babel, gettext

app = Flask(__name__)

app.jinja_env.add_extension('pyjade.ext.jinja.PyJadeExtension')
babel = Babel(app)

pages = {
    'about': {
        'title': 'about',
        'link': '/about',
        'current': False
    },
    'teams': {
        'title': 'teams',
        'link': '/teams',
        'current': False
    },
    'add_team': {
        'title': 'add team',
        'link': '/add-team',
        'current': False
    }
}

@app.route("/")
def homepage():
    title = "Underwater Rugby Tourist"
    return render_template("pages/home.jade", title=title, pages=pages)

@app.route("/about")
def about():
    title = gettext("About")
    return render_template("about.html", title=title, pages=pages)

@app.route("/countries")
def countries():
    title = gettext("Countries")
    return render_template("countries.html", title=title, pages=pages)

@app.route("/teams")
def teams():
    title = gettext("Teams")
    return render_template("pages/teams.jade", title=title, pages=pages)

@app.route("/add-new-team", methods=["GET", "POST"])
def addform():
    if request.method == "POST":
        # process the submission
        pass
    else:
        # show the login form
        title = gettext("Add a new team")
        return render_template("add.html", title=title)

@app.route("/competitions")
def competitions():
    title = gettext("Competitions")
    return render_template("competitions.html", title=title, pages=pages)

@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.jade"), 404

@app.errorhandler(500)
def site_down(e):
    return render_template("500.jade", error=e), 500