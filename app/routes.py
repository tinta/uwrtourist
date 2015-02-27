from flask import Flask, render_template, request
from flask.ext.babel import Babel, gettext, format_date
from config import LANGUAGES

app = Flask(__name__)
app.jinja_env.add_extension('pyjade.ext.jinja.PyJadeExtension')
babel = Babel(app)

@babel.localeselector
def get_locale():
    return request.accept_languages.best_match(LANGUAGES.keys())

@app.route("/")
def homepage():
    title = "Underwater Rugby Tourist"
    return render_template("home.jade", title=title)

@app.route("/about")
def about():
    title = gettext("About")
    return render_template("about.html", title=title)

@app.route("/countries")
def countries():
    title = gettext("Countries")
    return render_template("countries.html", title=title)

@app.route("/teams")
def teams():
    title = gettext("Teams")
    return render_template("teams.html", title=title)

@app.route("/competitions")
def competitions():
    title = gettext("Competitions")
    return render_template("competitions.html", title=title)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def site_down(e):
    return render_template('500.html', error=e), 500

if __name__ == "__main__":
    app.run(debug=True)
