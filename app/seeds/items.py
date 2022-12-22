from app.models import db, Shop, Category, Item, environment, SCHEMA
import os
import csv


def seed_items():
    with open(f'{os.path.dirname(__file__)}/seed.csv', 'r') as readfile:
        csv_reader = csv.reader(readfile, delimiter=',')
        next(csv_reader)

        for row in csv_reader:
            name = row[2]
            shop_id = Shop.query.filter_by(name=row[4]).first().id
            category_id = Category.query.filter_by(name=row[1]).first().id
            price = float(row[5].replace('$', '').replace('+', '')) if row[5] else 15.99
            desc = row[3]
            primary_image = row[6]
            secondary_image = row[7]
            video = row[8]

            db.session.add(Item(name=name, shop_id=shop_id, category_id=category_id, price=price, desc=desc, primary_image=primary_image, secondary_image=secondary_image, video=video))

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_items():
    if environment == 'production':
        db.session.execute(f'TRUNCATE table {SCHEMA}.items RESTART IDENTITY CASCADE;')
    else:
        db.session.execute('DELETE FROM items')
    db.session.commit()
