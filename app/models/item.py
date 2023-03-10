from .db import db, SCHEMA, environment, add_prefix_for_prod
from ..enums.receiving import Receiving
from datetime import datetime
from werkzeug.datastructures import FileStorage

import os
import boto3

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
    def get_all_items():
        res = []

        for item in Item.query.order_by(Item.id.desc()).all():
            stock = sum(i.qty if i.receiving == Receiving.receive else -i.qty for i in item.storages)
            if stock > 0:
                res.append({ 'id':item.id, 'image': item.primary_image, 'price': item.price })
        # res = [{ 'id':item.id, 'image': item.primary_image, 'price': item.price }  for item in Item.query.all()]

        return res

    def get_stock(self):
        return sum(i.qty if i.receiving == Receiving.receive else -i.qty for i in self.storages)

    @staticmethod
    def get_multiple_items(item_ids):
        items = Item.query.filter(Item.id.in_(item_ids)).all()
        res = {}

        res = {item.id: {
            'id': item.id,
            'name': item.name,
            'stock': item.get_stock(),
            'shop_name': item.shop.name,
            # 'category_1': item.category.upper_category.name,
            # 'category_2': item.category.name,
            'price': item.price,
            'image': item.primary_image
            } for item in items}

        return res

    def get_item(self):
        return {
            'id': self.id,
            'name': self.name,
            'stock': sum(i.qty if i.receiving == Receiving.receive else -i.qty for i in self.storages),
            'shop_name': self.shop.name,
            'category_1': self.category.upper_category.name if self.category.upper_category else None,
            'category_2': self.category.name,
            'price': self.price,
            'desc': self.desc,
            'images': [self.primary_image, self.video, self.secondary_image]
        }

    @staticmethod
    def delete_item_files(filenames:list):
        s3 = boto3.client(
            's3',
            region_name = os.environ.get('S3_REGION'),
            aws_access_key_id = os.environ.get('S3_KEY'),
            aws_secret_access_key = os.environ.get('S3_SECRET')
        )

        keys = [{'Key': filename.split('amazonaws.com/')[1]} for filename in filenames if filename]

        s3.delete_objects(
            Bucket = os.environ.get('S3_BUCKET'),
            Delete={'Objects': keys}
        )
