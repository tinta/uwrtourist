from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import inspect
from sqlalchemy.orm import relationship, subqueryload, joinedload
import datetime
import json
from pprint import pprint
from inspect import getmembers

db = SQLAlchemy()

class BaseMixin(object):
    id =  db.Column(db.Integer, primary_key=True)
    date_created = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    date_modified = db.Column(db.DateTime, default=datetime.datetime.utcnow())

    # does some recursive business that might be inefficient
    def as_dict(self):
        d = {}
        for attr in inspect(self).attrs:
            value = getattr(self, attr.key)
            if isinstance(value, list):
                d[attr.key] = []
                for elem in value:
                   d[attr.key].append(elem.as_dict())
            elif value is None:
                d[attr.key] = None
            elif isinstance(value, datetime.datetime):
                d[attr.key] = value.strftime("%H:%M %d-%m-%y")
            elif isinstance(value, (int, long, float, complex)):
                d[attr.key] = str(value)
            elif isinstance(value, unicode):
                d[attr.key] = value.encode("utf-8")
            else:
                pass
        return d

class Team(db.Model, BaseMixin):
    __tablename__ = "teams"
    name = db.Column(db.String(128), nullable=False)
    blurb = db.Column(db.String(1024))
    year_established = db.Column(db.Integer)
    year_disbanded = db.Column(db.Integer)
    logo = db.Column(db.String(256))
    photo = db.Column(db.String(256))
    location = db.Column(db.String(256), nullable=False)
    country = db.Column(db.String(256), nullable=False)
    latitude = db.Column(db.Float())
    longitude = db.Column(db.Float())
    status = db.Column(db.Enum("active", "pending", "inactive"), default="pending", nullable=False)

    def __init__(self, club_name, metro_area, country, status):
        self.name = club_name
        self.location = metro_area
        self.country = country
        self.status = status

    practice_locations = relationship("PracticeLocation",
                                      order_by="PracticeLocation.id",
                                      backref="team")
    practice_times = relationship("PracticeTime", order_by="PracticeTime.id",
                                  backref="team")
    contacts = relationship("Contact", order_by="Contact.id", backref="team")
    links = relationship("Link", order_by="Link.id", backref="team")


class PracticeTime(db.Model, BaseMixin):
    __tablename__ = "practice_times"
    day = db.Column(db.Enum("Monday", "Tuesday", "Wednesday", "Thursday",
                          "Friday", "Saturday", "Sunday"))
    start_time = db.Column(db.Time())
    end_time = db.Column(db.Time())
    notes = db.Column(db.String(512))

    team_id = db.Column(db.Integer, db.ForeignKey("teams.id"), index=True, nullable=False)
    practice_location_id = db.Column(db.Integer, db.ForeignKey(
                                     "practice_locations.id"), index=True, nullable=False)

    def __init__(self, day=None, start_time=None, end_time=None, notes=None, team_id=None):
        '''
        Make str to datetime conversions seamless when this obj is created.
        '''
        self.start_time = format_time_strings(start_time)
        self.end_time = format_time_strings(end_time)
        self.day = day
        self.notes = notes
        if team_id:
            self.team_id = team_id

class Link(db.Model, BaseMixin):
    __tablename__ = "links"
    # facebook, twitter, meetup, etc
    link = db.Column(db.String(128), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey("teams.id"), index=True)

    def __init__(self, url):
        self.link= url

class PracticeLocation(db.Model, BaseMixin):
    __tablename__ = "practice_locations"
    name = db.Column(db.String(128))
    street_address = db.Column(db.String(128))
    city = db.Column(db.String(128))
    region = db.Column(db.String(128))
    country = db.Column(db.String(128))
    postal_code = db.Column(db.String(128))
    permalink = db.Column(db.String(1024))

    team_id = db.Column(db.Integer, db.ForeignKey("teams.id"), index=True)
    practice_times = relationship("PracticeTime", order_by="PracticeTime.id", backref="location")

class Contact(db.Model, BaseMixin):
    __tablename__ = "contacts"
    name = db.Column(db.String(128))
    email= db.Column(db.String(128))
    title = db.Column(db.String(128))
    phone = db.Column(db.String(128))
    whatsapp = db.Column(db.String(128))
    facebook = db.Column(db.String(128))
    twitter = db.Column(db.String(128))
    team_id = db.Column(db.Integer, db.ForeignKey("teams.id"), index=True)


# helper method
def format_time_strings(time_str):
    if isinstance(time_str, str) and ":" in time_str:
        hour, minute = time_str.split(":")
        return datetime.time(int(hour), int(minute))
    elif isinstance(time_str, datetime.time):
       return time_str
    else:
       return None

def get_teams(format=None, **kwargs):
    # if no keyword args, don't do any filtering
    if not kwargs:
        teams = db.session.query(Team).all()
    else:
        teams = db.session.query(Team).filter_by(**kwargs).all()

    if format == "json":
        return json.dumps([team.as_dict() for team in teams])

    return teams

def create_team(form_data):
    location = form_data["location"]["metro"]
    country = form_data["location"]["country"] 
    team = Team(form_data["name"], location, country, form_data["status"])
    team.latitude = form_data["location"]["lat"]
    team.longitude = form_data["location"]["lng"]
    team.year_established = form_data.get("yearEstablished")

    contacts = form_data.get("contacts")
    if contacts:
        for contact in contacts:
            new_contact = Contact()
            new_contact.name = contact.get("name")
            new_contact.email = contact.get("email")
            new_contact.title = contact.get("role")

    practice_locations = form_data.get("practiceLocations")
    if practice_locations:
        for location in practice_locations:
            pass

    links = form_data.get("links")
    if links:
        for link in links:
            pass

    db.session.add(team)
    db.session.commit()
    print "Success"
    return "Success!!"
