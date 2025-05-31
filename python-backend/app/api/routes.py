from flask import jsonify, request
from flask_login import login_required, current_user
from app.api import bp
from app.models import User, Document, Announcement
from app import db

def check_admin():
    return current_user.role == 'admin'

@bp.route('/api/employees')
@login_required
def get_employees():
    users = User.query.all()
    return jsonify([{
        'id': user.id,
        'username': user.username,
        'fullName': user.full_name,
        'email': user.email,
        'department': user.department,
        'title': user.title,
        'role': user.role
    } for user in users])

@bp.route('/api/documents')
@login_required
def get_documents():
    documents = Document.query.all()
    return jsonify([{
        'id': doc.id,
        'title': doc.title,
        'description': doc.description,
        'fileName': doc.file_name,
        'mimeType': doc.mime_type,
        'uploadedBy': doc.uploaded_by,
        'createdAt': doc.created_at.isoformat()
    } for doc in documents])

@bp.route('/api/documents', methods=['POST'])
@login_required
def create_document():
    data = request.get_json()
    doc = Document(
        title=data['title'],
        description=data.get('description'),
        file_name=data['fileName'],
        mime_type=data['mimeType'],
        uploaded_by=current_user.id
    )
    db.session.add(doc)
    db.session.commit()
    return jsonify({
        'id': doc.id,
        'title': doc.title,
        'description': doc.description,
        'fileName': doc.file_name,
        'mimeType': doc.mime_type,
        'uploadedBy': doc.uploaded_by,
        'createdAt': doc.created_at.isoformat()
    }), 201

@bp.route('/api/documents/<int:id>', methods=['DELETE'])
@login_required
def delete_document(id):
    if not check_admin():
        return '', 403
    doc = Document.query.get_or_404(id)
    db.session.delete(doc)
    db.session.commit()
    return '', 204

@bp.route('/api/announcements')
@login_required
def get_announcements():
    announcements = Announcement.query.all()
    return jsonify([{
        'id': ann.id,
        'title': ann.title,
        'content': ann.content,
        'createdBy': ann.created_by,

@bp.route('/api/financials/metrics')
def get_financial_metrics():
    """Get financial metrics data"""
    try:
        # Add your financial metrics logic here
        metrics = {
            "totalRevenue": 0,
            "totalExpenses": 0,
            "profit": 0,
            "profitMargin": 0
        }
        return jsonify(metrics)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@login_required
def get_financial_metrics():
    metrics = FinancialMetric.query.order_by(FinancialMetric.display_order).all()
    return jsonify([{
        'id': metric.id,
        'name': metric.name,
        'value': metric.value,
        'description': metric.description,
        'icon': metric.icon,
        'displayOrder': metric.display_order,
        'createdAt': metric.created_at.isoformat() if metric.created_at else None,
    } for metric in metrics])

@bp.route('/api/financials/revenue-breakdown')
@login_required
def get_revenue_breakdown():
    breakdown = RevenueBreakdown.query.order_by(RevenueBreakdown.display_order).all()
    return jsonify([{
        'id': item.id,
        'category': item.category,
        'percentage': item.percentage,
        'colorClass': item.color_class,
        'displayOrder': item.display_order,
        'year': item.year,
        'createdAt': item.created_at.isoformat() if item.created_at else None,
    } for item in breakdown])

@bp.route('/api/financials/yearly')
@login_required
def get_yearly_financials():
    yearly = YearlyFinancial.query.order_by(YearlyFinancial.year.desc()).all()
    return jsonify([{
        'id': item.id,
        'year': item.year,
        'revenue': item.revenue,
        'growthPercentage': item.growth_percentage,
        'profit': item.profit,
        'createdAt': item.created_at.isoformat() if item.created_at else None,
    } for item in yearly])

@bp.route('/api/financials/investor-events')
@login_required
def get_investor_events():
    events = InvestorEvent.query.order_by(InvestorEvent.event_date).all()
    return jsonify([{
        'id': event.id,
        'title': event.title,
        'description': event.description,
        'eventDate': event.event_date.isoformat() if event.event_date else None,
        'createdAt': event.created_at.isoformat() if event.created_at else None,
    } for event in events])

@bp.route('/api/financials/metrics', methods=['POST'])
@login_required
def create_financial_metric():
    if not check_admin():
        return '', 403
    
    data = request.get_json()
    metric = FinancialMetric(
        name=data['name'],
        value=data['value'],
        description=data.get('description', ''),
        icon=data.get('icon', 'fas fa-dollar-sign'),
        display_order=data.get('displayOrder', 0)
    )
    db.session.add(metric)
    db.session.commit()
    
    return jsonify({
        'id': metric.id,
        'name': metric.name,
        'value': metric.value,
        'description': metric.description,
        'icon': metric.icon,
        'displayOrder': metric.display_order,
        'createdAt': metric.created_at.isoformat() if metric.created_at else None,
    }), 201

        'createdAt': ann.created_at.isoformat(),
        'isImportant': ann.is_important
    } for ann in announcements])

@bp.route('/api/announcements', methods=['POST'])
@login_required
def create_announcement():
    if not check_admin():
        return '', 403
    data = request.get_json()
    announcement = Announcement(
        title=data['title'],
        content=data['content'],
        created_by=current_user.id,
        is_important=data.get('isImportant', False)
    )
    db.session.add(announcement)
    db.session.commit()
    return jsonify({
        'id': announcement.id,
        'title': announcement.title,
        'content': announcement.content,
        'createdBy': announcement.created_by,
        'createdAt': announcement.created_at.isoformat(),
        'isImportant': announcement.is_important
    }), 201

@bp.route('/api/announcements/<int:id>', methods=['DELETE'])
@login_required
def delete_announcement(id):
    if not check_admin():
        return '', 403
    announcement = Announcement.query.get_or_404(id)
    db.session.delete(announcement)
    db.session.commit()
    return '', 204
