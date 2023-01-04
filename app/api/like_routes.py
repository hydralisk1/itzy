from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import Like, db

like_routes = Blueprint('likes', __name__)


@like_routes.route('/<int:item_id>', methods=['POST', 'DELETE'])
@login_required
def add_item(item_id):
    try:
        liked_item = Like.query.filter(Like.user_id == current_user.id, Like.item_id == item_id).first()
        if request.method == 'POST':
            if not liked_item:
                db.session.add(Like(user_id=current_user.id, item_id=item_id))
        else:
            if liked_item:
                db.session.delete(liked_item)

        db.session.commit()

        return {'message': 'successfully done'}, 201
    except:
        return {'error': 'something went wrong'}, 500
