from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from server.models import User
from server.config import db
import jwt 
import datetime
import dotenv
import os
dotenv.load_dotenv()

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/auth')

secret_key = os.environ.get('SECRET_KEY_JWT')

"""
Inscription
L"utilisateur remplit le formulaire dans React et clique sur "S"inscrire".
React envoie une requête POST /auth/register avec email, username, password.
Flask hache le mot de passe, stocke l"utilisateur en base et renvoie une réponse 201 Created.
React redirige vers la page de connexion.
"""
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({"message": "username or email already exists."}), 400

    try:
        new_user = User(
            username=username,
            email=email,
            password_hash=generate_password_hash(password)
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "account created successfully."}), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"an error occurred: {str(e)}"}), 500
    
    

"""
Connexion
L"utilisateur entre son email/mot de passe et clique sur "Se connecter".
React envoie une requête POST /auth/login.
Flask vérifie les identifiants et utilise login_user(user) pour enregistrer la session.
Flask renvoie une réponse 200 OK et React stocke l"état utilisateur.
React redirige vers la page d"accueil.
"""
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password_hash, password):
        token = jwt.encode({
            'username': username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, secret_key, algorithm='HS256')
        return jsonify({"token": token}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

"""
Vérification de l"utilisateur connecté
Lors du chargement de la page, React envoie GET /auth/user.
Flask vérifie si une session existe avec current_user.is_authenticated.
Si oui, Flask retourne les infos de l"utilisateur, sinon il envoie 401 Unauthorized.
React met à jour l"état global (ex : setUser(userData)).
"""
@auth_bp.route('/user', methods=['GET'])
def user():
    user = get_current_user()
    
    if not user:
        return jsonify({"message": "Unauthorized"}), 401
    
    return jsonify({
        "username": user.username,
        "email": user.email,
        "id": user.id
    }), 200



"""
Route de lecture de l'entête pour décoder le token JWT
"""
@auth_bp.route('/protected', methods=['GET'])
def protected():
    token = request.headers.get('Authorization').split()[1]
    try:
        data = jwt.decode(token, secret_key, algorithms=['HS256'])
        return jsonify({"message": "Protected route accessed", "data": data}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401
    


"""
DEBUGGING
curl -X POST http://127.0.0.1:5000/auth/login -H "Content-Type: application/json" -d '{"username": "jean", "password": "password"}'
curl -X GET http://127.0.0.1:5000/auth/user -H "Authorization: Bearer TOKEN"
"""
def get_current_user():
    token = request.headers.get('Authorization')
    
    if not token:
        return None      
    try:
        token = token.split()[1] 
        data = jwt.decode(token, secret_key, algorithms=['HS256'])
        user = User.query.filter_by(username=data['username']).first()
        return user
    except jwt.ExpiredSignatureError:
        return None  
    except jwt.InvalidTokenError:
        return None 


# TODO: refactor function for jwt decoding 
# TODO: randomize the user id 