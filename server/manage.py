from uwrtourist.routes import db
import uwrtourist.models as um
import click

@click.command()
@click.option('--env', default="dev", help="Create the database")
def init_db(env):
    # do this import so that all models are create when create_all is called
    db.create_all()

@click.command()
@click.option('--env', default="dev", help="Create the database")
def populate_db(env):
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

        #for t in team["schedule"]:

        db.session.add(new_team)

    db.session.commit()

def main():
    init_db()
    populate_db()

if __name__ == "__main__":
    main()


