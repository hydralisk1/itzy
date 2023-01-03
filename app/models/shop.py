from .db import db, SCHEMA, environment, add_prefix_for_prod
from datetime import datetime

class Shop(db.Model):
    __tablename__ = 'shops'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), unique=True)
    name = db.Column(db.String, nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=datetime.utcnow())

    user = db.relationship('User', back_populates='shop')
    items = db.relationship('Item', back_populates='shop', cascade='all, delete-orphan')

    @staticmethod
    def create_shop(name, user_id):
        if Shop.query.filter(db.func.lower(Shop.name) == name.lower()).first():
            return False

        new_shop = Shop(name=name, user_id=user_id)

        db.session.add(new_shop)
        db.session.commit()

        db.session.refresh(new_shop)

        return new_shop.id
