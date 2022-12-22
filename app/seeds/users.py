from app.models import db, User, environment, SCHEMA
import csv
import os

# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        name='Demo', email='demo@aa.io', password='password')
    marnie = User(
        name='marnie', email='marnie@aa.io', password='password')
    bobbie = User(
        name='bobbie', email='bobbie@aa.io', password='password')

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)

    name_duplicate = []

    with open(f'{os.path.dirname(__file__)}/seed.csv', 'r') as readfile:
        csv_reader = csv.reader(readfile, delimiter=',')
        next(csv_reader)

        for row in csv_reader:
            name = row[4]
            if name not in name_duplicate:
                email = name.lower() + '@itzy.com'
                password = 'password'
                db.session.add(User(name=name, email=email, password=password))
                name_duplicate.append(name)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_users():
    if environment == 'production':
        db.session.execute(f'TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;')
    else:
        db.session.execute('DELETE FROM users')
    db.session.commit()
