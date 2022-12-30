from .db import db, SCHEMA, environment, add_prefix_for_prod
from datetime import datetime

class Transaction(db.Model):
    __tablename__ = 'transactions'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('items.id')), nullable=False)
    qty = db.Column(db.Integer, nullable=False)
    shipping_address = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=datetime.utcnow())

    user = db.relationship('User', back_populates='transactions')
    items = db.relationship('Item', back_populates='transactions')

    @staticmethod
    def order(user_id, orders):
        try:
            for item in orders.get('items'):
                db.session.add(Transaction(user_id=user_id, item_id=item['id'], qty=item['qty'], shipping_address=orders['address']))

            db.session.commit()
            return True

        except:
            return False
