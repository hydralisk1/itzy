from .db import db, SCHEMA, environment, add_prefix_for_prod
from datetime import datetime

class Category(db.Model):
    __tablename__ = 'categories'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('categories.id')))
    created_at = db.Column(db.DateTime, default=datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=datetime.utcnow())

    upper_category = db.relationship('Category', remote_side=[id])
    items = db.relationship('Item', back_populates='category')
