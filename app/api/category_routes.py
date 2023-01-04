from flask import Blueprint, jsonify, request
from app.models import Category, Item

category_routes = Blueprint('categories', __name__)


@category_routes.route('/')
def get_all_categories():
    return {'categories': [{
        'category': c.name,
        'category_id': c.id,
        'upper_category': c.upper_category.name if c.upper_category else None,
        'upper_category_id': c.upper_category.id if c.upper_category else None
        } for c in Category.query.all()]}

@category_routes.route('/<int:category_id>')
def get_category_items(category_id):
    categories = Category.query.filter((Category.id == category_id) | (Category.parent_id == category_id)).all()
    name = Category.query.get(category_id).name
    items = []

    if categories:
        for category in categories:
            items += [item.get_item() for item in category.items]

        return {'items': items, 'name': name}

    return {'error': 'no category id'}, 404


@category_routes.route('/upper')
def get_upper_categories():
    return { c.id: c.name for c in Category.query.filter(Category.parent_id == None).all() }
