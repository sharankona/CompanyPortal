from flask import render_template, request, redirect, url_for, flash
from app.main import bp
from app import db
from app.models import ContactForm, FinancialMetric, RevenueBreakdown, YearlyFinancial, InvestorEvent
from datetime import datetime
import logging

@bp.route('/')
def index():
    return render_template('index.html', active_page='home')

@bp.route('/about')
def about():
    return render_template('about.html', active_page='about')

@bp.route('/services')
def services():
    return render_template('services.html', active_page='services')

@bp.route('/team')
def team():
    return render_template('team.html', active_page='team')

@bp.route('/contact', methods=['GET', 'POST'])
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
            return redirect(url_for('main.contact'))
        
        except Exception as e:
            logging.error(f"Error in contact form submission: {str(e)}")
            db.session.rollback()
            flash('There was an error sending your message. Please try again later.', 'danger')
            
    return render_template('contact.html', active_page='contact')

@bp.route('/careers')
def careers():
    return render_template('careers.html', active_page='careers')

@bp.route('/financials')
def financials():
    """Render the financials page with data from the database if available."""
    try:
        # Fetch financial metrics from database
        financial_metrics = FinancialMetric.query.order_by(FinancialMetric.display_order).all()
        
        # Fetch revenue breakdown from database
        revenue_breakdown = RevenueBreakdown.query.order_by(RevenueBreakdown.display_order).all()
        
        # Fetch yearly financial data from database
        yearly_financials = YearlyFinancial.query.order_by(YearlyFinancial.year.desc()).limit(5).all()
        
        # Fetch upcoming investor events from database
        investor_events = InvestorEvent.query.filter(
            InvestorEvent.event_date >= datetime.now().date()
        ).order_by(InvestorEvent.event_date).limit(3).all()
        
        # If we don't have any data yet, we'll fall back to the template's static data
        has_dynamic_data = (
            financial_metrics and revenue_breakdown and 
            yearly_financials and investor_events
        )
        
        return render_template(
            'financials.html', 
            active_page='financials',
            financial_metrics=financial_metrics if has_dynamic_data else [],
            revenue_breakdown=revenue_breakdown if has_dynamic_data else [],
            yearly_financials=yearly_financials if has_dynamic_data else [],
            investor_events=investor_events if has_dynamic_data else [],
            has_dynamic_data=has_dynamic_data
        )
    except Exception as e:
        logging.error(f"Error fetching financial data: {str(e)}")
        # On error, fall back to the static template data
        return render_template('financials.html', active_page='financials', has_dynamic_data=False)

@bp.route('/admin/init-financial-data')
def init_financial_data():
    try:
        # Clear existing data
        FinancialMetric.query.delete()
        RevenueBreakdown.query.delete()
        YearlyFinancial.query.delete()
        InvestorEvent.query.delete()
        
        # Add financial metrics
        metrics = [
            FinancialMetric(
                name="Revenue Growth",
                value=24.0,
                description="Year-over-year revenue growth, outperforming industry average of 18%",
                icon="fas fa-dollar-sign",
                display_order=1
            ),
            FinancialMetric(
                name="Profit Margin",
                value=18.5,
                description="Strong profit margins reflecting our operational efficiency",
                icon="fas fa-chart-pie",
                display_order=2
            ),
            FinancialMetric(
                name="Return on Investment",
                value=21.2,
                description="Strong returns for our investors across all business units",
                icon="fas fa-hand-holding-usd",
                display_order=3
            )
        ]
        
        # Add revenue breakdown
        revenue_categories = [
            RevenueBreakdown(
                category="Product Sales",
                percentage=45.0,
                color_class="bg-primary",
                display_order=1,
                year=2024
            ),
            RevenueBreakdown(
                category="Service Contracts",
                percentage=30.0,
                color_class="bg-success",
                display_order=2,
                year=2024
            ),
            RevenueBreakdown(
                category="Consulting",
                percentage=15.0,
                color_class="bg-info",
                display_order=3,
                year=2024
            ),
            RevenueBreakdown(
                category="Licensing",
                percentage=10.0,
                color_class="bg-warning",
                display_order=4,
                year=2024
            )
        ]
        
        # Add yearly financial data
        yearly_data = [
            YearlyFinancial(year=2024, revenue=152.4, growth_percentage=24.0, profit=28.2),
            YearlyFinancial(year=2023, revenue=122.9, growth_percentage=20.0, profit=22.1),
            YearlyFinancial(year=2022, revenue=102.4, growth_percentage=18.0, profit=18.4),
            YearlyFinancial(year=2021, revenue=86.8, growth_percentage=15.0, profit=15.2),
            YearlyFinancial(year=2020, revenue=75.5, growth_percentage=12.0, profit=12.8)
        ]
        
        # Add investor events
        from datetime import date
        events = [
            InvestorEvent(
                title="Q1 2025 Earnings Release",
                description="First quarter financial results announcement",
                event_date=date(2025, 4, 15)
            ),
            InvestorEvent(
                title="Annual Shareholders Meeting",
                description="Annual meeting for all shareholders",
                event_date=date(2025, 5, 20)
            ),
            InvestorEvent(
                title="Q2 2025 Earnings Release",
                description="Second quarter financial results announcement",
                event_date=date(2025, 7, 15)
            )
        ]
        
        # Add all data to session
        for metric in metrics:
            db.session.add(metric)
        
        for category in revenue_categories:
            db.session.add(category)
        
        for yearly in yearly_data:
            db.session.add(yearly)
        
        for event in events:
            db.session.add(event)
        
        # Commit to database
        db.session.commit()
        
        return "Financial data initialized successfully!"
    
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error initializing financial data: {str(e)}")
        return f"Error initializing financial data: {str(e)}"

@bp.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404
from flask import render_template
from app.main import bp
from app.models import FinancialMetric, RevenueBreakdown, YearlyFinancial, InvestorEvent
from flask_login import login_required

@bp.route('/financials')
@login_required
def financials():
    # Fetch real data from the database
    financial_metrics = FinancialMetric.query.order_by(FinancialMetric.display_order).all()
    revenue_breakdown = RevenueBreakdown.query.order_by(RevenueBreakdown.display_order).all()
    yearly_financials = YearlyFinancial.query.order_by(YearlyFinancial.year.desc()).limit(5).all()
    investor_events = InvestorEvent.query.order_by(InvestorEvent.event_date).all()
    
    has_dynamic_data = bool(financial_metrics and revenue_breakdown and yearly_financials)
    
    return render_template('financials.html', 
                           active_page='financials',
                           has_dynamic_data=has_dynamic_data,
                           financial_metrics=financial_metrics,
                           revenue_breakdown=revenue_breakdown,
                           yearly_financials=yearly_financials,
                           investor_events=investor_events)
