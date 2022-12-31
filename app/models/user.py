from .db import db, SCHEMA, environment, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime
from ..enums.gender import Gender


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, nullable=False, unique=True)
    hashed_password = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable=False)
    profile_picture = db.Column(db.String)
    gender = db.Column(db.Enum(Gender))
    city = db.Column(db.String)
    birthday = db.Column(db.DateTime)
    about = db.Column(db.Text)
    # shop_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('shops.id')))
    shipping_address = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=datetime.utcnow())

    shop = db.relationship('Shop', back_populates='user')
    carts = db.relationship('Cart', back_populates='user', cascade='all, delete-orphan')
    likes = db.relationship('Like', back_populates='user', cascade='all, delete-orphan')
    transactions = db.relationship('Transaction', back_populates='user', cascade='all, delete-orphan')


    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'shop': self.shop[0].id if self.shop else None
        }
