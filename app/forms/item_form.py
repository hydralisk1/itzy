from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FloatField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import Item


# def item_owned(form, field):
#     shop_id = field.data
#     id = field.data
#     item = Item.query.

class ItemForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()], nullable=False)
    category_id = IntegerField('category_id', validators=[DataRequired()], nullable=False)
