from uwrtourist.routes import db
import click

@click.command()
@click.option('--env', default="dev", help="Create the database")
def init_db(env):
    db.create_all()

@click.option('--env', default="dev", help="Create the database")
def populate_db(env):

def main():
    init_db()

if __name__ == "__main__":
    main()


