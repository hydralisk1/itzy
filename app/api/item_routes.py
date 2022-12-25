from flask import Blueprint, jsonify, request
from app.models import Item

item_routes = Blueprint('items', __name__)


@item_routes.route('/get/<int:item_id>')
def get_item(item_id):
    item = Item.query.get(item_id)
    try:
        return item.get_item()
    except:
        return {'error': 'Something went wrong'}, 500

@item_routes.route('/get')
def get_items():
    try:
        data = Item.get_items()
        return jsonify(data)
    except:
        return {'error': 'something went wrong'}, 500

@item_routes.route('/get', methods=['POST'])
def get_multiple_items():
    data = request.json
    if data.get('itemIds'):
        try:
            res = Item.get_multiple_items(data['itemIds'])
            return res
        except:
            return {'error': 'something went wrong'}, 500
    else:
        return {'error': 'data doesn\'t exist'}, 404
