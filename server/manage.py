from uwrtourist.routes import db
import uwrtourist.models as um

def init_db():
    # do this import so that all models are create when create_all is called
    db.create_all()

def populate_db():
    from uwrtourist.fixtures.teams import seed
    # iterate over fixtures and add to db
    for team in seed:
        new_team = um.Team(team.get("name"), team.get("city"))

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


def main():
    init_db()
    populate_db()

if __name__ == "__main__":
    main()


