from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import Transaction

order_routes = Blueprint('orders', __name__)


@order_routes.route('/', methods=['POST'])
@login_required
def order():
    orders = request.json

    res = Transaction.order(current_user.id, orders)

    if res:
        return {'message': 'order successfully placed'}, 201

    return {'error': 'something went wrong'}, 500
