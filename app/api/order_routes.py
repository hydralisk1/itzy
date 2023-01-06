from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import Transaction, db
from app.forms import OrderForm

order_routes = Blueprint('orders', __name__)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@order_routes.route('/')
@login_required
def get_order_history():
    return {'orders': [{
        'id': order.id,
        'item': order.items.get_item(),
        'qty': order.qty,
        'address': order.shipping_address,
        'time': order.created_at
        } for order in current_user.transactions]}


@order_routes.route('/', methods=['POST'])
@login_required
def order():
    form = OrderForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        res = Transaction.order(current_user.id, form.data['items'], form.data['address'])
        if res:
            return {'message': 'order successfully placed'}, 201
        else:
            return {'error': 'something went wrong'}, 500

    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@order_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def remove_item(id):
    try:
        order = Transaction.query.filter(Transaction.user_id == current_user.id, Transaction.id == id).first()
        if not order:
            return {'error': 'can\'t cancel this item'}, 403

        db.session.delete(order)
        db.session.commit()

        return {'message': 'successfully canceled'}
    except Exception as e:
        print(e)
        return {'error': 'error occured while cancel'}, 500
