from .db import db, SCHEMA, environment, add_prefix_for_prod
from ..enums.receiving import Receiving
from datetime import datetime

class Storage(db.Model):
    __tablename__ = 'storages'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('items.id')), nullable=False)
    qty = db.Column(db.Integer, nullable=False)
    receiving = db.Column(db.Enum(Receiving), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=datetime.utcnow())
