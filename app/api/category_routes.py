from flask import Blueprint, jsonify, request
from app.models import Category

category_routes = Blueprint('categories', __name__)


@category_routes.route('/')
def get_all_categories():
    return {'categories': [{
        'category': c.name,
        'category_id': c.id,
        'upper_category': c.upper_category.name if c.upper_category else None,
        'upper_category_id': c.upper_category.id if c.upper_category else None
        } for c in Category.query.all()]}
