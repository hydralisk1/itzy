from flask import Blueprint, jsonify, request
from app.models import Cart

cart_routes = Blueprint('carts', __name__)

@cart_routes.route('/')
def test():
    return {'hello': 'world'}

@cart_routes.route('/', methods=['POST'])
def save_items():
    try:
        Cart.save_items(request.json)
        return {'message': 'Successfully saved'}
    except:
        return {'error': 'Something went wrong'}, 500
