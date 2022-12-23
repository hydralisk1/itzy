from flask import Blueprint, jsonify
from app.models import Item

item_routes = Blueprint('items', __name__)


@item_routes.route('/get')
def get_items():
    try:
        data = Item.get_items()
        return jsonify(data)
    except:
        return {'error': 'something went wrong'}, 500
