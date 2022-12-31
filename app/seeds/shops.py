from app.models import db, Shop, User, environment, SCHEMA
import os
import csv


def seed_shops():
    with open(f'{os.path.dirname(__file__)}/seed.csv', 'r') as readfile:
        csv_reader = csv.reader(readfile, delimiter=',')
        next(csv_reader)

        shop_duplicated = []

        for row in csv_reader:
            name = row[4]
            if name not in shop_duplicated:
                user_id = User.query.filter_by(name = name).first().id
                db.session.add(Shop(name=name, user_id=user_id))
                shop_duplicated.append(name)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_shops():
    if environment == 'production':
        db.session.execute(f'TRUNCATE table {SCHEMA}.shops RESTART IDENTITY CASCADE;')
    else:
        db.session.execute('DELETE FROM shops')
    db.session.commit()
