from app.models import db, Category, environment, SCHEMA
import os
import csv


def seed_categories():
    categories = {}

    with open(f'{os.path.dirname(__file__)}/seed.csv', 'r') as readfile:
        csv_reader = csv.reader(readfile, delimiter=',')
        next(csv_reader)

        for row in csv_reader:
            if row[0] not in categories.keys():
                db.session.add(Category(name=row[0]))
                categories[row[0]] = []

            if row[1] not in categories[row[0]]:
                categories[row[0]].append(row[1])

    db.session.commit()

    for k in categories.keys():
        parent_id = Category.query.filter_by(name = k).first().id

        for c in categories[k]:
            db.session.add(Category(name=c, parent_id=parent_id))

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_categories():
    if environment == 'production':
        db.session.execute(f'TRUNCATE table {SCHEMA}.categories RESTART IDENTITY CASCADE;')
    else:
        db.session.execute('DELETE FROM categories')
    db.session.commit()
