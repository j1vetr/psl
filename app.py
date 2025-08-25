import os
import json
import logging
from datetime import datetime
from flask import Flask, render_template, request, flash, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, emit
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix
import threading
import time
import random

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# SQLAlchemy base class
class Base(DeclarativeBase):
    pass

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Database configuration
database_url = os.environ.get("DATABASE_URL")
if not database_url:
    raise RuntimeError("DATABASE_URL environment variable is not set")

app.config["SQLALCHEMY_DATABASE_URI"] = database_url
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

# Initialize extensions
db = SQLAlchemy(model_class=Base)
db.init_app(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# Configuration
SMTP_CONFIG = {
    'host': os.environ.get('SMTP_HOST', 'smtp.gmail.com'),
    'port': int(os.environ.get('SMTP_PORT', '587')),
    'user': os.environ.get('SMTP_USER', ''),
    'pass': os.environ.get('SMTP_PASS', ''),
    'to_email': os.environ.get('TO_EMAIL', 'info@pslmobilenerji.com')
}

WHATSAPP_PHONE = os.environ.get('WHATSAPP_PHONE', '905335295399')

def send_email(name, phone, email, message):
    """
    Stub function for sending emails. 
    In production, this would use Flask-Mail or similar.
    For now, it saves leads to a JSON file.
    """
    try:
        # Create leads data
        lead_data = {
            'timestamp': datetime.now().isoformat(),
            'name': name,
            'phone': phone,
            'email': email,
            'message': message
        }
        
        # Save to file (in production, this would send email)
        leads_file = '/tmp/leads.json'
        leads = []
        
        if os.path.exists(leads_file):
            with open(leads_file, 'r', encoding='utf-8') as f:
                leads = json.load(f)
        
        leads.append(lead_data)
        
        with open(leads_file, 'w', encoding='utf-8') as f:
            json.dump(leads, f, ensure_ascii=False, indent=2)
        
        app.logger.info(f"Lead saved: {name} - {email}")
        return True
    except Exception as e:
        app.logger.error(f"Error saving lead: {str(e)}")
        return False

@app.route('/')
def index():
    """Home page with hero section and key features"""
    return render_template('index.html')

@app.route('/sektorler')
def sektorler():
    """Sector solutions page"""
    sectors = [
        {
            'id': 'etkinlik',
            'title': 'Etkinlik & Organizasyon',
            'icon': 'calendar',
            'description': 'Konsert, festival, düğün ve kurumsal etkinlikler için kesintisiz güç.',
            'features': [
                'Sessiz çalışma (< 60 dB)',
                'Hızlı kurulum (< 10 dakika)',
                'Çevre dostu emisyon'
            ]
        },
        {
            'id': 'film',
            'title': 'Film/Dizi Seti',
            'icon': 'video',
            'description': 'Profesyonel prodüksiyon için güvenilir, sessiz enerji kaynağı.',
            'features': [
                'Ultra sessiz çalışma',
                'Stabil voltaj çıkışı',
                '7/24 teknik destek'
            ]
        },
        {
            'id': 'insaat',
            'title': 'İnşaat/Şantiye',
            'icon': 'tool',
            'description': 'Ağır inşaat makineleri ve şantiye ihtiyaçları için yüksek güç.',
            'features': [
                'Yüksek kVA kapasitesi',
                'Zorlu arazi koşullarına uygun',
                'Uzun çalışma süresi'
            ]
        },
        {
            'id': 'acil',
            'title': 'Acil Durum & Afet',
            'icon': 'zap',
            'description': 'Acil durumlarda kritik altyapı için anında güç desteği.',
            'features': [
                'Anında devreye alma',
                'Mobil erişim avantajı',
                '24 saat kesintisiz çalışma'
            ]
        },
        {
            'id': 'tarim',
            'title': 'Tarım & Kırsal Alan',
            'icon': 'map',
            'description': 'Tarımsal sulama, hayvancılık ve kırsal tesis ihtiyaçları.',
            'features': [
                'Yakıt ekonomisi (%30 verimli)',
                'Uzak bölge erişimi',
                'Çevre dostu teknoloji'
            ]
        },
        {
            'id': 'saglik',
            'title': 'Sağlık & Hastane',
            'icon': 'heart',
            'description': 'Hastane ve sağlık tesisleri için kritik güç desteği.',
            'features': [
                'UPS entegrasyonu',
                'Tıbbi cihaz uyumluluğu',
                'Kesintisiz güç garantisi'
            ]
        },
        {
            'id': 'telekom',
            'title': 'Telekomünikasyon',
            'icon': 'radio',
            'description': 'Baz istasyon ve telecom altyapısı için sürekli enerji.',
            'features': [
                'DC/AC dönüştürücü',
                'Uzaktan izleme sistemi',
                'Otomatik başlatma'
            ]
        },
        {
            'id': 'egitim',
            'title': 'Eğitim & Kampüs',
            'icon': 'book-open',
            'description': 'Okul, üniversite ve eğitim kurumları için güvenilir enerji.',
            'features': [
                'Çok nokta besleme',
                'Sessiz çalışma',
                'Güvenli kurulum'
            ]
        }
    ]
    return render_template('sektorler.html', sectors=sectors)

@app.route('/teknoloji')
def teknoloji():
    """Technology and specifications page"""
    tech_features = [
        {
            'title': 'Sessiz & Düşük Emisyon',
            'description': 'Modern ses yalıtımı ve çevre dostu motor teknolojisi',
            'specs': [
                {'label': 'Ses Seviyesi', 'value': '< 60 dB'},
                {'label': 'Emisyon Standardı', 'value': 'Euro 5'},
                {'label': 'Yakıt Türü', 'value': 'Dizel/Benzin'}
            ]
        },
        {
            'title': 'Uzaktan İzleme',
            'description': 'GSM tabanlı sistem ile 7/24 durum takibi',
            'specs': [
                {'label': 'Bağlantı', 'value': 'GSM/4G'},
                {'label': 'İzleme', 'value': '7/24 Anlık'},
                {'label': 'Uyarı Sistemi', 'value': 'SMS/E-posta'}
            ]
        },
        {
            'title': 'Yakıt Verimliliği',
            'description': 'Akıllı motor yönetimi ile maksimum verimlilik',
            'specs': [
                {'label': 'Verimlilik', 'value': '%30 Tasarruf'},
                {'label': 'Depo Kapasitesi', 'value': '100-500 Litre'},
                {'label': 'Çalışma Süresi', 'value': '8-24 Saat'}
            ]
        }
    ]
    
    power_ranges = [
        {'range': '5-15 kVA', 'usage': 'Küçük etkinlikler, ofis'},
        {'range': '20-50 kVA', 'usage': 'Orta ölçek projeler'},
        {'range': '60-100 kVA', 'usage': 'Büyük etkinlikler, şantiye'},
        {'range': '125-250 kVA', 'usage': 'Endüstriyel uygulamalar'}
    ]
    
    return render_template('teknoloji.html', tech_features=tech_features, power_ranges=power_ranges)

@app.route('/galeri')
def galeri():
    """Gallery page with image lightbox"""
    # Placeholder gallery items - in production, these would be real images
    gallery_items = [
        {
            'id': 1,
            'title': 'Mobil Jeneratör Van',
            'category': 'equipment',
            'thumbnail': '/static/img/gallery-1.jpeg',
            'full': '/static/img/gallery-1.jpeg'
        },
        {
            'id': 2,
            'title': 'Elektrik Sistemi',
            'category': 'setup',
            'thumbnail': '/static/img/gallery-2.jpeg',
            'full': '/static/img/gallery-2.jpeg'
        },
        {
            'id': 3,
            'title': 'Araç Üstü Jeneratör',
            'category': 'equipment',
            'thumbnail': '/static/img/gallery-3.jpeg',
            'full': '/static/img/gallery-3.jpeg'
        },
        {
            'id': 4,
            'title': 'Kontrol Paneli',
            'category': 'projects',
            'thumbnail': '/static/img/gallery-4.jpeg',
            'full': '/static/img/gallery-4.jpeg'
        }
    ]
    
    categories = ['all', 'equipment', 'setup', 'projects']
    
    return render_template('galeri.html', gallery_items=gallery_items, categories=categories)

@app.route('/iletisim', methods=['GET', 'POST'])
def iletisim():
    """Contact page with form handling"""
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        phone = request.form.get('phone', '').strip()
        email = request.form.get('email', '').strip()
        message = request.form.get('message', '').strip()
        
        # Basic validation
        errors = []
        if not name:
            errors.append('Ad Soyad alanı gereklidir.')
        if not phone:
            errors.append('Telefon alanı gereklidir.')
        if not email:
            errors.append('E-posta alanı gereklidir.')
        if not message:
            errors.append('Mesaj alanı gereklidir.')
        
        if '@' not in email:
            errors.append('Geçerli bir e-posta adresi giriniz.')
        
        if errors:
            for error in errors:
                flash(error, 'error')
        else:
            # Try to send email
            if send_email(name, phone, email, message):
                flash('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.', 'success')
                return redirect(url_for('iletisim'))
            else:
                flash('Mesaj gönderimi sırasında bir hata oluştu. Lütfen tekrar deneyiniz.', 'error')
    
    return render_template('iletisim.html', whatsapp_phone=WHATSAPP_PHONE)


# API Endpoints for Generator Management
@app.route('/api/generators', methods=['GET'])
def get_generators():
    """Get all generators"""
    from models import Generator
    generators = Generator.query.filter_by(is_active=True).all()
    return jsonify([gen.to_dict() for gen in generators])

@app.route('/api/generators', methods=['POST'])
def create_generator():
    """Create a new generator"""
    from models import Generator
    data = request.get_json()
    
    try:
        generator = Generator()
        generator.name = data['name']
        generator.location = data['location']
        generator.model = data['model']
        generator.max_power_kva = data['max_power_kva']
        generator.fuel_type = data.get('fuel_type', 'Diesel')
        
        db.session.add(generator)
        db.session.commit()
        return jsonify(generator.to_dict()), 201
    except Exception as e:
        app.logger.error(f"Error creating generator: {str(e)}")
        return jsonify({'error': 'Failed to create generator'}), 400

@app.route('/api/generators/<generator_id>', methods=['GET'])
def get_generator(generator_id):
    """Get specific generator details"""
    from models import Generator
    generator = Generator.query.get_or_404(generator_id)
    return jsonify(generator.to_dict())

@app.route('/api/generators/<generator_id>/monitoring-data', methods=['GET'])
def get_monitoring_data(generator_id):
    """Get recent monitoring data for a generator"""
    from models import MonitoringData
    limit = request.args.get('limit', 50, type=int)
    data = MonitoringData.query.filter_by(generator_id=generator_id)\
                              .order_by(MonitoringData.recorded_at.desc())\
                              .limit(limit).all()
    return jsonify([item.to_dict() for item in data])

@app.route('/api/monitoring-data', methods=['POST'])
def add_monitoring_data():
    """Add new monitoring data point"""
    from models import MonitoringData
    data = request.get_json()
    
    try:
        monitoring_data = MonitoringData(**data)
        db.session.add(monitoring_data)
        db.session.commit()
        
        # Emit real-time update via WebSocket
        socketio.emit('generator_data', monitoring_data.to_dict())
        
        return jsonify(monitoring_data.to_dict()), 201
    except Exception as e:
        app.logger.error(f"Error adding monitoring data: {str(e)}")
        return jsonify({'error': 'Failed to add monitoring data'}), 400

# WebSocket Event Handlers
@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    app.logger.info('Client connected')
    emit('connected', {'message': 'Connected to monitoring system'})

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    app.logger.info('Client disconnected')

@socketio.on('request_generators')
def handle_request_generators():
    """Send list of generators to client"""
    from models import Generator
    generators = Generator.query.filter_by(is_active=True).all()
    emit('generators_list', [gen.to_dict() for gen in generators])

@socketio.on('request_initial_data')
def handle_request_initial_data():
    """Send initial monitoring data to client"""
    from models import Generator, MonitoringData
    generators = Generator.query.filter_by(is_active=True).all()
    
    for generator in generators:
        latest_data = MonitoringData.query.filter_by(generator_id=generator.id)\
                                         .order_by(MonitoringData.recorded_at.desc())\
                                         .first()
        if latest_data:
            emit('generator_data', {
                'generator_id': generator.id,
                'power': latest_data.current_power_kva,
                'load': latest_data.load_percentage,
                'temperature': latest_data.engine_temperature,
                'fuel': latest_data.fuel_level
            })

@app.errorhandler(404)
def not_found(error):
    """Custom 404 page"""
    return render_template('404.html'), 404

@app.context_processor
def utility_processor():
    """Add utility functions to template context"""
    return {
        'whatsapp_phone': WHATSAPP_PHONE,
        'current_year': datetime.now().year
    }

# Data simulation functions
def create_sample_generators():
    """Create sample generators for demonstration"""
    from models import Generator
    
    sample_generators = [
        {
            'name': 'Jeneratör Alpha',
            'location': 'İstanbul Beşiktaş Şantiye',
            'model': 'PSL-250-D',
            'max_power_kva': 250,
            'fuel_type': 'Diesel',
            'status': 'online'
        },
        {
            'name': 'Jeneratör Beta',
            'location': 'Ankara Etkinlik Alanı',
            'model': 'PSL-150-D',
            'max_power_kva': 150,
            'fuel_type': 'Diesel',
            'status': 'online'
        },
        {
            'name': 'Jeneratör Gamma',
            'location': 'İzmir Fuar Alanı',
            'model': 'PSL-100-D',
            'max_power_kva': 100,
            'fuel_type': 'Diesel',
            'status': 'warning'
        }
    ]
    
    for gen_data in sample_generators:
        existing = Generator.query.filter_by(name=gen_data['name']).first()
        if not existing:
            generator = Generator()
            for key, value in gen_data.items():
                setattr(generator, key, value)
            db.session.add(generator)
    
    try:
        db.session.commit()
    except Exception as e:
        app.logger.error(f"Error creating sample generators: {str(e)}")
        db.session.rollback()

def generate_monitoring_data(generator):
    """Generate realistic monitoring data for a generator"""
    from models import MonitoringData
    
    # Simulate realistic data based on generator status
    if generator.status == 'online':
        load_percentage = random.uniform(40, 95)
        current_power = (load_percentage / 100) * generator.max_power_kva
        engine_temp = random.uniform(75, 95)
        fuel_level = max(20, random.uniform(50, 100))
        is_healthy = True
    elif generator.status == 'warning':
        load_percentage = random.uniform(85, 100)
        current_power = (load_percentage / 100) * generator.max_power_kva
        engine_temp = random.uniform(90, 105)
        fuel_level = max(10, random.uniform(15, 50))
        is_healthy = fuel_level > 20 and engine_temp < 100
    else:  # offline
        load_percentage = 0
        current_power = 0
        engine_temp = random.uniform(20, 40)
        fuel_level = random.uniform(0, 30)
        is_healthy = False
    
    return {
        'generator_id': generator.id,
        'current_power_kva': round(current_power, 2),
        'load_percentage': round(load_percentage, 2),
        'voltage_l1': random.uniform(220, 240),
        'voltage_l2': random.uniform(220, 240),
        'voltage_l3': random.uniform(220, 240),
        'frequency': random.uniform(49.5, 50.5),
        'engine_temperature': round(engine_temp, 1),
        'oil_pressure': random.uniform(3.5, 5.0),
        'fuel_level': round(fuel_level, 1),
        'runtime_hours': random.uniform(0, 1000),
        'ambient_temperature': random.uniform(15, 35),
        'noise_level': random.uniform(45, 65),
        'is_healthy': is_healthy
    }

def background_data_simulator():
    """Background thread to simulate real-time data"""
    while True:
        try:
            with app.app_context():
                from models import Generator, MonitoringData
                
                generators = Generator.query.filter_by(is_active=True).all()
                
                for generator in generators:
                    # Generate new monitoring data
                    data = generate_monitoring_data(generator)
                    
                    # Save to database
                    monitoring_data = MonitoringData(**data)
                    db.session.add(monitoring_data)
                    
                    # Emit real-time data via WebSocket
                    socketio.emit('generator_data', {
                        'generator_id': generator.id,
                        'power': data['current_power_kva'],
                        'load': data['load_percentage'],
                        'temperature': data['engine_temperature'],
                        'fuel': data['fuel_level'],
                        'timestamp': datetime.now().isoformat()
                    })
                
                db.session.commit()
                
        except Exception as e:
            app.logger.error(f"Error in background data simulator: {str(e)}")
            db.session.rollback()
        
        time.sleep(5)  # Update every 5 seconds

# Initialize application
with app.app_context():
    # Import models to ensure table creation
    import models
    db.create_all()
    
    # Create sample generators
    create_sample_generators()
    
    # Start background data simulation
    simulator_thread = threading.Thread(target=background_data_simulator, daemon=True)
    simulator_thread.start()

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, use_reloader=False, log_output=True)
