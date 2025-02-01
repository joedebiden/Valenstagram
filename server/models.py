from config import db
from datetime import datetime


""" 
Table User
"""
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    bio = db.Column(db.Text, nullable=True)
    profile_picture = db.Column(db.String(255), nullable=True, default='default.jpg')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    posts = db.relationship('Post', backref='author', lazy=True)



""" 
Table Post
Publications
"""
class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String(255), nullable=False)
    caption = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    likes = db.relationship('Like', backref='post', lazy=True)
    comments = db.relationship('Comment', backref='post', lazy=True)


"""
Table Like
m'entions j'aime
"""
class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    db.UniqueConstraint(user_id, post_id, name='unique_like')


"""
Table Comment
commentaires d'un post
"""
class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)


"""
Table Follow
les abonnements
"""
class Follow(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    followed_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    db.UniqueConstraint(follower_id, followed_id, name='unique_follow')


"""
Table Notification
les notifs(likes, comments, follows)
"""
class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # À qui appartient la notif
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Qui a généré la notif
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=True)  # Optionnel (si lié à un post)
    type = db.Column(db.String(50), nullable=False)  # Ex: "like", "comment", "follow"
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


"""
Table conversation
discussions entre utilisateurs (entre deux personnes)
Groups implementation to see later
"""
class Conversation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user1_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Premier utilisateur
    user2_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Deuxième utilisateur
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    messages = db.relationship('Message', backref='conversation', lazy=True)

    db.UniqueConstraint(user1_id, user2_id, name='unique_conversation')  # Une seule conv entre deux users


"""
Table Message
messages envoyés à l'utilisateur
"""
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversation.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  
    content = db.Column(db.Text, nullable=False)  
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_read = db.Column(db.Boolean, default=False) 


"""
Exemple d'utilisations
"""
""" 
==> créer une conversation entre deux utilisateurs <==
def get_or_create_conversation(user1_id, user2_id):
    conversation = Conversation.query.filter(
        ((Conversation.user1_id == user1_id) & (Conversation.user2_id == user2_id)) |
        ((Conversation.user1_id == user2_id) & (Conversation.user2_id == user1_id))
    ).first()
    
    if not conversation:
        conversation = Conversation(user1_id=user1_id, user2_id=user2_id)
        db.session.add(conversation)
        db.session.commit()
    
    return conversation
"""
"""
==> envoyer un message <==
def send_message(sender_id, receiver_id, content):
    conversation = get_or_create_conversation(sender_id, receiver_id)
    message = Message(conversation_id=conversation.id, sender_id=sender_id, content=content)
    
    db.session.add(message)
    db.session.commit()
    return message
"""
"""
==> récupérer les messages d'une conversation <==
def get_messages(conversation_id):
    return Message.query.filter_by(conversation_id=conversation_id).order_by(Message.created_at).all()
"""