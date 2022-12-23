from .db import db, SCHEMA, environment, add_prefix_for_prod
from datetime import datetime
from random import randint

class Item(db.Model):
    __tablename__ = 'items'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    shop_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('shops.id')), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('categories.id')), nullable=False)
    price = db.Column(db.Float, nullable=False)
    desc = db.Column(db.Text, nullable=False)
    primary_image = db.Column(db.String, nullable=False)
    secondary_image = db.Column(db.String)
    video = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=datetime.utcnow())

    carts = db.relationship('Cart', back_populates='items', cascade='all, delete-orphan')
    likes = db.relationship('Like', back_populates='items', cascade='all, delete-orphan')
    transactions = db.relationship('Transaction', back_populates='items')
    storages = db.relationship('Storage', back_populates='items', cascade='all, delete-orphan')
    category = db.relationship('Category', back_populates='items')
    shop = db.relationship('Shop', back_populates='items')

    @staticmethod
    def get_items():
        num_of_items = 10

        ids = []
        min = db.session.query(db.func.min(Item.id)).scalar()
        max = db.session.query(db.func.max(Item.id)).scalar()

        while(len(ids) < 10):
            random_id = randint(min, max)
            if random_id not in ids:
                ids.append(random_id)

        res = [{ 'id':item.id, 'image': item.primary_image, 'price': item.price }  for item in Item.query.filter(Item.id.in_(ids)).all()]

        return res
