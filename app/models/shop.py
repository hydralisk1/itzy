from .db import db, SCHEMA, environment, add_prefix_for_prod
from datetime import datetime

class Shop(db.Model):
    __tablename__ = 'shops'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    name = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=datetime.utcnow())

    user = db.relationship('User', back_populates='shop')
    items = db.relationship('Item', back_populates='shop', cascade='all, delete-orphan')
