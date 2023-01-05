from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import Item, Storage, db
from datetime import datetime
from werkzeug.datastructures import FileStorage

import os
import boto3

item_routes = Blueprint('items', __name__)


def upload_item_image(name, file: FileStorage):
    filename = 'item-images/' + name[:8] + str(datetime.now()) + '.' + file.filename.split('.')[-1]

    s3 = boto3.client(
        's3',
        region_name = os.environ.get('S3_REGION'),
        aws_access_key_id = os.environ.get('S3_KEY'),
        aws_secret_access_key = os.environ.get('S3_SECRET')
    )

    s3.upload_fileobj(
        file,
        os.environ.get('S3_BUCKET'),
        filename,
        ExtraArgs = {
            "ContentType": file.content_type
        }
    )

    return f"{os.environ.get('S3_LOCATION')}/{filename}"


def delete_item_image(filename):
    s3 = boto3.client(
        's3',
        region_name = os.environ.get('S3_REGION'),
        aws_access_key_id = os.environ.get('S3_KEY'),
        aws_secret_access_key = os.environ.get('S3_SECRET')
    )

    s3.delete_object(
        Bucket = os.environ.get('S3_BUCKET'),
        Key = filename.split('amazonaws.com/')[1]
    )


@item_routes.route('/', methods=['POST'])
@login_required
def add_item():
    try:
        shop_id = current_user.shop[0].id

        if shop_id != int(request.form['shopId']):
            return {'error': 'You don\'n have permission to add this item to this shop'}, 403

        image1 = request.files.to_dict().get('primaryImg')
        image2 = request.files.to_dict().get('secondaryImg')
        video = request.files.to_dict().get('video')

        image1 = upload_item_image(request.form['name'], image1)

        if image2:
            image2 = upload_item_image(request.form['name'], image2)

        if video:
            video = upload_item_image(request.form['name'], video)

        new_item = Item(name=request.form['name'], shop_id=shop_id, category_id=request.form['categoryId'], price=float(request.form['price']), desc=request.form['desc'], primary_image=image1, secondary_image=image2, video=video)

        db.session.add(new_item)
        db.session.commit()

        db.session.refresh(new_item)

        db.session.add(Storage(item_id=new_item.id, qty=int(request.form['stock']), receiving='receive'))
        db.session.commit()

        return {'message': 'successfully added'}, 201

    except Exception as e:
        print(e)
        return {'error':'something went wrong'}, 500


@item_routes.route('/<int:item_id>', methods=['PUT'])
@login_required
def modify_item(item_id):
    try:
        shop_id = current_user.shop[0].id
        item = Item.query.get(item_id)

        if shop_id != item.shop_id:
            return {'error': 'You don\'n have permission to modify this item'}, 403

        item = Item.query.get(item_id)
        item.name = request.form['name']
        item.price = float(request.form['price'])
        item.desc = request.form['desc']

        image1 = request.files.to_dict().get('primaryImg')
        image2 = request.files.to_dict().get('secondaryImg')
        video = request.files.to_dict().get('video')


        if request.form.get('primaryImg') and request.form.get('secondaryImg') == 'undefined':
            if request.form.get('primaryImg') == item.secondary_image:
                delete_item_image(item.primary_image)
                item.primary_image = item.secondary_image
                item.secondary_image = None

        if image1:
            image1 = upload_item_image(request.form['name'], image1)
            delete_item_image(item.primary_image)
            item.primary_image = image1

        if item.secondary_image and request.form.get('secondaryImg') != item.secondary_image:
            delete_item_image(item.secondary_image)
            item.secondary_image = None

        if image2:
            image2 = upload_item_image(request.form['name'], image2)
            item.secondary_image = image2

        if item.video and request.form.get('video') != item.video:
            delete_item_image(item.video)
            item.video = None

        if video:
            video = upload_item_image(request.form['name'], video)
            item.video = video


        if request.form.get('categoryId'):
            item.category_id = request.form['categoryId']

        stock = item.get_stock()

        stock_from_form = int(request.form['stock'])
        if stock != stock_from_form:
            receiving = 'release' if stock > stock_from_form else 'receive'
            qty = stock - stock_from_form if stock > stock_from_form else stock_from_form - stock
            db.session.add(Storage(item_id=item_id, qty=qty, receiving=receiving))

        db.session.commit()

        return {'message': 'successfully modified'}, 200
    except:
        return {'error': 'something went wrong'}, 500


@item_routes.route('/<int:item_id>', methods=['DELETE'])
@login_required
def delete_item(item_id):
    try:
        shop_id = current_user.shop[0].id
        item = Item.query.get(item_id)

        if shop_id != item.shop_id:
            return {'error': 'You don\'n have permission to modify this item'}, 403

        for filename in [item.primary_image, item.secondary_image, item.video]:
            if filename:
                delete_item_image(filename)

        db.session.delete(item)
        db.session.commit()

        return {'message': 'Successfully deleted'}
    except:
        return {'error': 'Something went wrong'}, 500


@item_routes.route('/search/<keyword>')
def search_items(keyword):
    items = Item.query.filter(Item.name.ilike(f'%{keyword}%')).limit(10)
    return {item.id: item.name for item in items}

@item_routes.route('/search-all/<keyword>')
def search_all_items(keyword):
    items = Item.query.filter(Item.name.ilike(f'%{keyword}%')).all()
    return {item.id: item.get_item() for item in items}

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
    except Exception as e:
        print(e)
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
