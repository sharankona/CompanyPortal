from flask import jsonify, request
from flask_login import login_user, logout_user, current_user
from app.auth import bp
from app.models import User
from app import db

@bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    user = User(
        username=data['username'],
        full_name=data['fullName'],
        email=data['email'],
        department=data['department'],
        title=data['title'],
        role=data.get('role', 'employee')
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    login_user(user)
    return jsonify({
        'id': user.id,
        'username': user.username,
        'fullName': user.full_name,
        'email': user.email,
        'department': user.department,
        'title': user.title,
        'role': user.role
    }), 201

@bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user is None or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid username or password'}), 401
    
    login_user(user)
    return jsonify({
        'id': user.id,
        'username': user.username,
        'fullName': user.full_name,
        'email': user.email,
        'department': user.department,
        'title': user.title,
        'role': user.role
    })

@bp.route('/api/logout', methods=['POST'])
def logout():
    logout_user()
    return '', 204

@bp.route('/api/user')
def get_user():
    if not current_user.is_authenticated:
        return '', 401
    
    return jsonify({
        'id': current_user.id,
        'username': current_user.username,
        'fullName': current_user.full_name,
        'email': current_user.email,
        'department': current_user.department,
        'title': current_user.title,
        'role': current_user.role
    })
