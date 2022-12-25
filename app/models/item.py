from .db import db, SCHEMA, environment, add_prefix_for_prod
from ..enums.receiving import Receiving
from datetime import datetime

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
        res = [{ 'id':item.id, 'image': item.primary_image, 'price': item.price }  for item in Item.query.all()]

        return res

    @staticmethod
    def get_multiple_items(item_ids):
        items = Item.query.filter(Item.id.in_(item_ids)).all()
        res = {item.id: {
            'id': item.id,
            'name': item.name,
            'stock': sum(i.qty if i.receiving == Receiving.receive else -i.qty for i in item.storages),
            'shop_name': item.shop.name,
            # 'category_1': item.category.upper_category.name,
            # 'category_2': item.category.name,
            'price': item.price,
            'image': item.primary_image
            } for item in items}

        return res

    def get_item(self):
        return {
            'name': self.name,
            'stock': sum(i.qty if i.receiving == Receiving.receive else -i.qty for i in self.storages),
            'shop_name': self.shop.name,
            'category_1': self.category.upper_category.name,
            'category_2': self.category.name,
            'price': self.price,
            'desc': self.desc,
            'images': [self.primary_image, self.video, self.secondary_image]
        }
