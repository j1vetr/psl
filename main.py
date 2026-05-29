import os
import json
import logging
from datetime import datetime
from flask import Flask, render_template, request, flash, redirect, url_for, send_from_directory
from werkzeug.middleware.proxy_fix import ProxyFix

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

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
        },
        {
            'id': 5,
            'title': 'Etkinlik — Konser Sahnesi',
            'category': 'projects',
            'thumbnail': '/static/img/gallery/galeri-etkinlik-1.png',
            'full': '/static/img/gallery/galeri-etkinlik-1.png'
        },
        {
            'id': 6,
            'title': 'Gece Konseri Güç Desteği',
            'category': 'projects',
            'thumbnail': '/static/img/gallery/galeri-etkinlik-2.png',
            'full': '/static/img/gallery/galeri-etkinlik-2.png'
        },
        {
            'id': 7,
            'title': 'Tünel Çalışması — Kurulum',
            'category': 'setup',
            'thumbnail': '/static/img/gallery/galeri-tünel.png',
            'full': '/static/img/gallery/galeri-tünel.png'
        },
        {
            'id': 8,
            'title': 'Film Seti Güç Sistemi',
            'category': 'projects',
            'thumbnail': '/static/img/gallery/galeri-film.png',
            'full': '/static/img/gallery/galeri-film.png'
        },
        {
            'id': 9,
            'title': 'Plaza — Gece Kurulumu',
            'category': 'setup',
            'thumbnail': '/static/img/gallery/galeri-plaza.png',
            'full': '/static/img/gallery/galeri-plaza.png'
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

@app.errorhandler(404)
def not_found(error):
    """Custom 404 page"""
    return render_template('404.html'), 404

@app.route('/robots.txt')
def robots_txt():
    """Serve robots.txt file"""
    return send_from_directory(app.static_folder or 'static', 'robots.txt')

@app.route('/sitemap.xml')
def sitemap_xml():
    """Serve sitemap.xml file"""
    return send_from_directory(app.static_folder or 'static', 'sitemap.xml')

@app.context_processor
def utility_processor():
    """Add utility functions to template context"""
    return {
        'whatsapp_phone': WHATSAPP_PHONE,
        'current_year': datetime.now().year
    }

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
