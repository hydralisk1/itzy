from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import Shop

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
