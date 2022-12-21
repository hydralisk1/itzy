from flask_sqlalchemy import SQLAlchemy
import os

environment = os.environ.get('FLASK_ENV')
SCHEMA = os.environ.get('SCHEMA')

db = SQLAlchemy()

def add_prefix_for_prod(attr):
    return f'{SCHEMA}.{attr}' if environment == 'production' else attr
