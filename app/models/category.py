from .db import db, SCHEMA, environment, add_prefix_for_prod
from datetime import datetime

class Category(db.Model):
    __tablename__ = 'categories'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    parent_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('categories.id')))
    created_at = db.Column(db.DateTime, default=datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=datetime.utcnow())

    upper_category = db.relationship('Category', remote_side=[id])
    items = db.relationship('Item', back_populates='category')

    @staticmethod
    def get_all_categories():
        return [{'category': c.name, 'upper_category':c.upper_category.name} for c in Category.query.all()]
