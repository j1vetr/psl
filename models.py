from app import db
from datetime import datetime
import uuid

class Generator(db.Model):
    __tablename__ = 'generators'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    model = db.Column(db.String(100), nullable=False)
    max_power_kva = db.Column(db.Float, nullable=False)
    fuel_type = db.Column(db.String(50), nullable=False, default='Diesel')
    status = db.Column(db.String(20), nullable=False, default='offline')  # online, offline, maintenance, warning
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    installed_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    last_maintenance = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with monitoring data
    monitoring_data = db.relationship('MonitoringData', backref='generator', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'model': self.model,
            'max_power_kva': self.max_power_kva,
            'fuel_type': self.fuel_type,
            'status': self.status,
            'is_active': self.is_active,
            'installed_date': self.installed_date.isoformat() if self.installed_date else None,
            'last_maintenance': self.last_maintenance.isoformat() if self.last_maintenance else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class MonitoringData(db.Model):
    __tablename__ = 'monitoring_data'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    generator_id = db.Column(db.String(36), db.ForeignKey('generators.id'), nullable=False)
    
    # Power metrics
    current_power_kva = db.Column(db.Float, nullable=False, default=0.0)
    load_percentage = db.Column(db.Float, nullable=False, default=0.0)
    voltage_l1 = db.Column(db.Float, nullable=False, default=0.0)
    voltage_l2 = db.Column(db.Float, nullable=False, default=0.0)
    voltage_l3 = db.Column(db.Float, nullable=False, default=0.0)
    frequency = db.Column(db.Float, nullable=False, default=50.0)
    
    # Engine metrics
    engine_temperature = db.Column(db.Float, nullable=False, default=0.0)
    oil_pressure = db.Column(db.Float, nullable=False, default=0.0)
    fuel_level = db.Column(db.Float, nullable=False, default=100.0)  # Percentage
    runtime_hours = db.Column(db.Float, nullable=False, default=0.0)
    
    # Environmental metrics
    ambient_temperature = db.Column(db.Float, nullable=False, default=25.0)
    noise_level = db.Column(db.Float, nullable=False, default=0.0)  # dB
    
    # Status and alerts
    alerts = db.Column(db.Text)  # JSON string of active alerts
    is_healthy = db.Column(db.Boolean, nullable=False, default=True)
    
    # Timestamp
    recorded_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, index=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'generator_id': self.generator_id,
            'current_power_kva': self.current_power_kva,
            'load_percentage': self.load_percentage,
            'voltage_l1': self.voltage_l1,
            'voltage_l2': self.voltage_l2,
            'voltage_l3': self.voltage_l3,
            'frequency': self.frequency,
            'engine_temperature': self.engine_temperature,
            'oil_pressure': self.oil_pressure,
            'fuel_level': self.fuel_level,
            'runtime_hours': self.runtime_hours,
            'ambient_temperature': self.ambient_temperature,
            'noise_level': self.noise_level,
            'alerts': self.alerts,
            'is_healthy': self.is_healthy,
            'recorded_at': self.recorded_at.isoformat() if self.recorded_at else None
        }