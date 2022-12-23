from .db import db, SCHEMA, environment, add_prefix_for_prod
from datetime import datetime

class Cart(db.Model):
    __tablename__ = 'carts'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('items.id')), nullable=False)
    qty = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=datetime.utcnow())

    user = db.relationship('User', back_populates='carts')
    items = db.relationship('Item', back_populates='carts')

    @staticmethod
    def save_items(data, user_id):
        try:
            for item_id in data.keys():
                new_item = Cart(user_id=user_id, item_id=int(item_id), qty=data[item_id])
                db.session.add(new_item)

            db.session.commit()

            return True
        except:
            return False
