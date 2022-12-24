from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Cart

cart_routes = Blueprint('carts', __name__)

@cart_routes.route('/')
@login_required
def load_items():
    try:
        res = Cart.load_items(current_user.id)
        return res
    except:
        return {'error': 'Something went wrong'}, 500

@cart_routes.route('/', methods=['POST'])
@login_required
def save_items():
    try:
        Cart.save_items(request.json, current_user.id)
        return {'message': 'Successfully saved'}
    except:
        return {'error': 'Something went wrong'}, 500

@cart_routes.route('/', methods=['DELETE'])
@login_required
def remove_items():
    try:
        Cart.remove_items(request.json, current_user.id)
        return {'message': 'Successfully deleted'}
    except:
        return {'error': 'Something went wrong'}, 500

@cart_routes.route('/', methods=['PUT'])
@login_required
def modify_qty():
    try:
        Cart.modify_qty(request.json, current_user.id)
        return {'message': 'Successfully modified'}
    except:
        return {'error': 'Something went wrong'}, 500
