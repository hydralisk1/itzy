from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import Item, Storage, db

item_routes = Blueprint('items', __name__)

@item_routes.route('/', methods=['POST'])
@login_required
def add_item():
    data = request.json

    try:
        shop_id = current_user.shop[0].id

        if shop_id != data['shopId']:
            return {'error': 'You don\'n have permission to add this item to this shop'}, 403

        new_item = Item(name=data['name'], shop_id=shop_id, category_id=data['categoryId'], price=data['price'], desc=data['desc'], primary_image=data['images'][0], secondary_image=data['images'][1], video=data['video'])
        db.session.add(new_item)
        db.session.commit()

        db.session.refresh(new_item)

        db.session.add(Storage(item_id=new_item.id, qty=data['stock'], receiving='receive'))
        db.session.commit()

        return {'message': 'successfully added'}, 201

    except:
        return {'error':'something went wrong'}, 500


@item_routes.route('/<int:item_id>', methods=['DELETE'])
@login_required
def delete_item(item_id):
    try:
        shop_id = current_user.shop[0].id
        item = Item.query.get(item_id)

        if shop_id != item.shop_id:
            return {'error': 'You don\'n have permission to modify this item'}, 403

        db.session.delete(item)
        db.session.commit()

        return {'message': 'Successfully deleted'}
    except:
        return {'error': 'Something went wrong'}, 500


@item_routes.route('/<int:item_id>', methods=['PUT'])
@login_required
def modify_item(item_id):
    data = request.json

    try:
        shop_id = current_user.shop[0].id
        item = Item.query.get(item_id)

        if shop_id != item.shop_id:
            return {'error': 'You don\'n have permission to modify this item'}, 403

        item = Item.query.get(item_id)
        item.name = data['name']
        item.price = data['price']
        item.desc = data['desc']
        item.primary_image, item.secondary_image = data['images']
        item.video = data['video']

        if data.get('categoryId'):
            item.category_id = data['categoryId']

        stock = item.get_stock()


        if stock != data['stock']:
            receiving = 'release' if stock > data['stock'] else 'receive'
            qty = stock - data['stock'] if stock > data['stock'] else data['stock'] - stock
            db.session.add(Storage(item_id=item_id, qty=qty, receiving=receiving))

        db.session.commit()

        return {'message': 'successfully modified'}, 200
    except:
        return {'error': 'something went wrong'}, 500



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
        data = Item.get_all_items()
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
