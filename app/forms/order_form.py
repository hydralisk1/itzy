from flask_wtf import FlaskForm
from wtforms import Field, StringField
from wtforms.validators import DataRequired

class OrderItemForm(Field):
    # id = IntegerField('id', validators=[DataRequired()])
    # qty = IntegerField('qty', validators=[DataRequired()])
    def process_formdata(self, datalist):
        self.data = datalist


class OrderForm(FlaskForm):
    # user_id = IntegerField('user_id', validators=[DataRequired()])
    address = StringField('address', validators=[DataRequired()])
    items = OrderItemForm()
