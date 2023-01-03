from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import Shop, db

shop_routes = Blueprint('shop', __name__)


@shop_routes.route('/', methods=['POST'])
@login_required
def create_shop():
    try:
        name = request.json.get('name')
        user_id = current_user.id
        res = Shop.create_shop(name, user_id)

        if res:
            return {'id': res}, 201
        else:
            return {'error': 'shop name duplicated'}, 409
    except:
        return {'error': 'something went wrong'}, 500


@shop_routes.route('/', methods=['PUT'])
@login_required
def change_shop_name():
    try:
        name = request.json.get('name')

        if Shop.query.filter(db.func.lower(Shop.name) == name.lower()).first():
            return {'error': 'Shop name duplicate'}, 409

        current_user.shop[0].name = name
        db.session.commit()

        return {'message': 'successfully modified'}
    except Exception as e:
        print(e)
        return {'error': 'something went wrong'}, 500


@shop_routes.route('/', methods=['GET'])
@login_required
def get_shop_info():
    try:
        my_shop = current_user.shop[0].name
        return {'name': my_shop}
    except:
        return {'error': 'Something went wrong'}, 500

@shop_routes.route('/', methods=['DELETE'])
@login_required
def delete_shop():
    try:
        my_shop = current_user.shop[0]
        db.session.delete(my_shop)
        db.session.commit()

        return {'message': 'successfully closed'}

    except:
        return {'error': 'something went wrong'}, 500


@shop_routes.route('/items', methods=['GET'])
@login_required
def get_items():
    try:
        return {'items': [item.get_item() for item in current_user.shop[0].items]}
    except:
        return {'error': 'Something went wrong'}, 500
