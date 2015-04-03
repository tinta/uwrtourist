from uwrtourist.models import db
from uwrtourist.routes import app
import uwrtourist.models as um

# team data
from uwrtourist.fixtures.teams import seed
from uwrtourist.fixtures.geo_data import all_teams

# other libraries
import requests

def init_db():
    # do this import so that all models are create when create_all is called
    db.create_all()

def populate_db():
    # iterate over fixtures and add to db
    for team in seed:
        new_team = um.Team(team.get("name"), team.get("city"),
                           team.get("country"))

        for l in team["locations"]:
            new_team.practice_locations.append(
               um.PracticeLocation(name=l.get("name"),
                                   street_address=l.get("address"),
                                   city=l.get("city"), region=l.get("region"),
                                   country=l.get("country"),
                                   postal_code=l.get("postalCode"))
            )
            # yolo
            for t in team["schedule"]:
                if t["location"] == l["uid"]:
                    new_team.practice_locations[-1].practice_times.append(
                        um.PracticeTime(day=t.get("day"),
                                        start_time=t.get("start"),
                                        end_time=t.get("end"),
                                        notes=t.get("note")
                                        )
                    )

        for u in team["links"]:
            new_team.links.append(um.Link(u))

        for c in team["contacts"]:
            new_team.contacts.append(
                um.Contact(name=c.get("name"), email=c.get("email"),
                           phone=c.get("tel"))
            )

        db.session.add(new_team)
    db.session.commit()

    # Now add geodata
    base_url = "http://maps.googleapis.com/maps/api/geocode/json"
    for team in all_teams:
        team_name = team[0].decode("utf-8")
        coordinates = ",".join(str(v) for v in team[1:3])
        team_links = team[3:]
        response = requests.get(base_url, params={"latlng": coordinates, "sensor": False})
        # simply grab first result
        if response.json()["status"] == "OK":
            geodata = response.json()["results"][0]["address_components"]
            country = ""
            city = ""
            state = ""
            for data in geodata:
                if "country" in data["types"]:
                    country = data["short_name"]
                elif "locality" in data["types"]:
                    city = data["short_name"]
                elif "administrative_area_level_1" in data["types"]:
                    state = data["short_name"]

            location = ", ".join([city, state])
            new_team = um.Team(team_name, location, country)
            for l in team_links:
                if "uwr1.de" not in l:
                    new_team.links.append(um.Link(l.decode("utf-8")))
            db.session.add(new_team)
        else:
            print "error: ", team

    db.session.commit()

def main():
    with app.app_context():
        init_db()
        populate_db()

if __name__ == "__main__":
    main()


