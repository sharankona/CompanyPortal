import os
from datetime import timedelta
import logging

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-please-change'
    
    # Database configuration based on environment variable
    database_type = os.environ.get('DATABASE_TYPE', 'sqlite')
    sqlite_path = os.environ.get('SQLITE_DATABASE_PATH', 'data/app.db')
    
    # Default to SQLite
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{sqlite_path}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    PERMANENT_SESSION_LIFETIME = timedelta(days=1)
    
    # Use PostgreSQL if configured
    if database_type == 'postgres' and os.environ.get('DATABASE_URL'):
        database_url = os.environ.get('DATABASE_URL')
        
        # Handle Heroku-style postgresql URLs
        if database_url.startswith('postgres://'):
            database_url = database_url.replace('postgres://', 'postgresql://', 1)
        
        # Only use PostgreSQL URL if psycopg2 is available
        try:
            import psycopg2
            SQLALCHEMY_DATABASE_URI = database_url
            
            # Additional database settings for PostgreSQL
            SQLALCHEMY_ENGINE_OPTIONS = {
                "pool_recycle": 300,
                "pool_pre_ping": True,
            }
            logging.info("Using PostgreSQL database")
        except ImportError:
            logging.warning("psycopg2 not available, falling back to SQLite")
            logging.info(f"Using SQLite database at {sqlite_path}")
    else:
        logging.info(f"Using SQLite database at {sqlite_path}")
