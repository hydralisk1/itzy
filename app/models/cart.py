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
        for item_id in data.keys():
            item = Cart.query.filter(Cart.user_id == user_id, Cart.item_id == int(item_id)).first()
            if not item:
                new_item = Cart(user_id=user_id, item_id=int(item_id), qty=data[item_id])
                db.session.add(new_item)
            else:
                item.qty += data[item_id]

        db.session.commit()

    @staticmethod
    def remove_items(item_ids, user_id):
        Cart.query.filter(Cart.user_id == user_id, Cart.item_id.in_(item_ids)).delete()
        db.session.commit()


    @staticmethod
    def load_items(user_id):
        return {i.item_id : i.qty for i in Cart.query.filter_by(user_id = user_id).all()}

    @staticmethod
    def modify_qty(data, user_id):
        item_id = list(data.keys())[0]
        item = Cart.query.filter(Cart.user_id == user_id, Cart.item_id == int(item_id)).first()
        item.qty = data[item_id]

        db.session.commit()
