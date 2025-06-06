
from app import create_app, db
from app.models import User

app = create_app()

with app.app_context():
    users = User.query.all()
    print(f"Found {len(users)} users:")
    
    for user in users:
        print(f"ID: {user.id}")
        print(f"Username: {user.username}")
        print(f"Full Name: {user.full_name}")
        print(f"Email: {user.email}")
        print(f"Department: {user.department}")
        print(f"Title: {user.title}")
        print(f"Role: {user.role}")
        print("-" * 30)
