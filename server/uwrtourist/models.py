from routes import db
import datetime

class BaseMixin(object):
    id =  db.Column(db.Integer, primary_key=True)
    date_created = db.Column(db.DateTime, default=datetime.utcnow())
    date_modified = db.Column(db.DateTime, default=datetime.utcnow())

class Team(db.Model, BaseMixin):
    __tablename__ = "teams"
    name = db.Column(db.String(128))
    blurb = db.Column(db.String(1024))
    logo = db.Column(db.String(256))
    photo = db.Column(db.String(256))
    location = db.Column(db.String(256))

class PracticeTime(db.model, BaseMixin):
    __tablename__ = "practice_times"
    day = db.Column(db.Enum("Monday", "Tuesday", "Wednesday", "Thursday",
                          "Friday", "Saturday", "Sunday"))
    start_time = db.Column(db.Time())
    end_time = db.Column(db.Time())
    notes = db.Column(db.String(512))

    team_id = db.Column(db.Integer, db.ForeignKey("teams.id"), index=True)
    practice_location_id = db.Column(db.Integer, db.ForeignKey(
                                     "practice_locations.id"), index=True)

class Link(db.model, BaseMixin):
    __tablename__ = "links"
    # facebook, twitter, etc
    link = db.Column(db.String(128))
    team_id = db.Column(db.Integer, db.ForeignKey("teams.id"), index=True)

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

class Contact(db.Model, BaseMixin):
    __tablename__ = "contacts"
    name = db.Column(db.String(128))
    email= db.Column(db.String(128))
    title = db.Column(db.String(128))
    phone = db.Column(db.String(128))
    whatsapp = db.Column(db.String(128))
    facebook = db.Column(db.String(128))
    team_id = db.Column(db.Integer, db.ForeignKey("teams.id"), index=True)
