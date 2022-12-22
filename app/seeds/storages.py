from app.models import db, Storage, Item, environment, SCHEMA


def seed_storages():
    items = Item.query.all()

    for item in items:
        db.session.add(Storage(item_id=item.id, qty=20, receiving='receive'))

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_storages():
    if environment == 'production':
        db.session.execute(f'TRUNCATE table {SCHEMA}.storages RESTART IDENTITY CASCADE;')
    else:
        db.session.execute('DELETE FROM storages')
    db.session.commit()
