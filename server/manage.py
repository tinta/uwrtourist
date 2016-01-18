from uwrtourist.models import db
from uwrtourist.routes import app
import uwrtourist.models as um

# team data
from uwrtourist.fixtures.teams import seed
from uwrtourist.fixtures.geo_data import all_teams

# other libraries
import requests
import time
import os.path
import json

def init_db():
    # do this import so that all models are create when create_all is called
    db.create_all()

def export(file_path="uwrtourist/fixtures/teams.json"):
    # export all teams and team data
    all_teams = db.getgg_teams()
    with open(path, "w") as fixtures_file:
        json.dump(all_teams, fixtures_file)

#def import(file_path="uwrtourist/fixtures/teams.json"):
#    with open(path, "r") as fixtures_file:
#        data = json.load(fixtures_file)
#
#    for team in data:
#        pass

def populate_db():
    # iterate over fixtures and add to db
    for team in seed:
        name = team.get("name").decode("utf-8")
        city = team.get("city").decode("utf-8")
        country = team.get("country").decode("utf-8")

        new_team = um.Team(name, city, country, "active")

        params = {
            "address": ", ".join([city, country]),
            "sensor": False,
        }
        geodata = get_geodata(params)
        new_team.latitude = geodata["geometry"]["location"]["lat"]
        new_team.longitude = geodata["geometry"]["location"]["lng"]

        db.session.add(new_team)
        db.session.flush()

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
                                        notes=t.get("note"),
                                        team_id = new_team.id
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

    for team in all_teams:
        team_name = team[0].decode("utf-8")
        coordinates = ",".join(str(v) for v in team[1:3])
        team_links = team[3:]
        geodata = get_geodata(params={"latlng": coordinates, "sensor": False})
        country = ""
        city = ""
        state = []
        # simply use first result
        for data in geodata["address_components"]:
            if "country" in data["types"]:
                country = data["long_name"]
            elif "locality" in data["types"]:
                city = data["short_name"]
            elif "administrative_area_level_1" in data["types"]:
                state.append(data["long_name"])
            elif "administrative_area_level_2" in data["types"]:
                state.append(data["long_name"])
            elif "administrative_area_level_3" in data["types"]:
                state.append(data["long_name"])
        else:
            state = state[0] if len(state) else city
            location = ", ".join([city, state])
            new_team = um.Team(team_name, location, country, "active")
            new_team.longitude = team[2]
            new_team.latitude = team[1]
            for l in team_links:
                if "uwr1.de" not in l and l is not "":
                    new_team.links.append(um.Link(l.decode("utf-8")))
            db.session.add(new_team)

    db.session.commit()

def get_geodata(params):
    # do this to avoid hititng google maps api limit
    time.sleep(.5)
    geocode_url = "http://maps.googleapis.com/maps/api/geocode/json"
    response = requests.get(geocode_url, params=params)
    if response and response.json()["status"] == u"OK":
        # always just grab the first result
        return response.json()["results"][0]
    else:
        raise Exception("Error: ", response.json()["status"])
        

def main():
    with app.app_context():
        init_db()
        populate_db()

if __name__ == "__main__":
    main()


