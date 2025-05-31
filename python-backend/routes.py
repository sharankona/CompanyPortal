from flask import render_template, request, redirect, url_for, flash
from app import app, db
from models import ContactForm
import logging

@app.route('/')
def index():
    return render_template('index.html', active_page='home')

@app.route('/about')
def about():
    return render_template('about.html', active_page='about')

@app.route('/services')
def services():
    return render_template('services.html', active_page='services')

@app.route('/team')
def team():
    return render_template('team.html', active_page='team')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        try:
            # Get form data
            name = request.form.get('name')
            email = request.form.get('email')
            subject = request.form.get('subject')
            message = request.form.get('message')
            
            # Validate form data
            if not name or not email or not subject or not message:
                flash('Please fill in all fields', 'danger')
                return render_template('contact.html', active_page='contact')
            
            # Create new contact form submission
            new_contact = ContactForm(
                name=name,
                email=email,
                subject=subject,
                message=message
            )
            
            # Save to database
            db.session.add(new_contact)
            db.session.commit()
            
            flash('Your message has been sent! We will get back to you soon.', 'success')
            return redirect(url_for('contact'))
        
        except Exception as e:
            logging.error(f"Error in contact form submission: {str(e)}")
            db.session.rollback()
            flash('There was an error sending your message. Please try again later.', 'danger')
            
    return render_template('contact.html', active_page='contact')

@app.route('/careers')
def careers():
    return render_template('careers.html', active_page='careers')

@app.route('/financials')
def financials():
    return render_template('financials.html', active_page='financials')

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404
