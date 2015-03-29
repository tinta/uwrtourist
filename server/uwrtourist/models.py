from routes import db
from sqlalchemy.orm import relationship
import datetime

class BaseMixin(object):
    id =  db.Column(db.Integer, primary_key=True)
    date_created = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    date_modified = db.Column(db.DateTime, default=datetime.datetime.utcnow())

class Team(db.Model, BaseMixin):
    __tablename__ = "teams"
    name = db.Column(db.String(128))
    blurb = db.Column(db.String(1024))
    logo = db.Column(db.String(256))
    photo = db.Column(db.String(256))
    location = db.Column(db.String(256))

    def __init__(self, club_name, city):
        self.name = club_name
        self.location = city

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

    team_id = db.Column(db.Integer, db.ForeignKey("teams.id"), index=True)
    practice_location_id = db.Column(db.Integer, db.ForeignKey(
                                     "practice_locations.id"), index=True)

    def __init__(self, day=None, start_time=None, end_time=None, notes=None):
        '''
        Make str to datetime conversions seamless when this obj is created.
        '''
        self.start_time = format_time_strings(start_time)
        self.end_time = format_time_strings(end_time)
        self.day = day
        self.notes = notes

class Link(db.Model, BaseMixin):
    __tablename__ = "links"
    # facebook, twitter, meetup, etc
    link = db.Column(db.String(128))
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

