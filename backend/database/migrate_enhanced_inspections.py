"""
Database migration for enhanced inspection features.
Adds tables for professional testing, tool integration, and system diagnostics.
"""

from sqlalchemy import create_engine, text
from backend.database.database import engine
from config.settings import get_settings

settings = get_settings()


def migrate_enhanced_inspections():
    """Add enhanced inspection tables to the database."""
    
    print("🔧 Starting enhanced inspections migration...")
    
    try:
        with engine.connect() as conn:
            # Create inspection_checklists table
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS inspection_checklists (
                    id SERIAL PRIMARY KEY,
                    checklist_id VARCHAR UNIQUE NOT NULL,
                    name VARCHAR NOT NULL,
                    description TEXT,
                    property_types JSON,
                    applicable_years JSON,
                    climate_zones JSON,
                    estimated_time INTEGER,
                    required_certifications JSON,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            print("✅ Created inspection_checklists table")
            
            # Create inspection_tests table
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS inspection_tests (
                    id SERIAL PRIMARY KEY,
                    checklist_id INTEGER REFERENCES inspection_checklists(id),
                    test_id VARCHAR NOT NULL,
                    name VARCHAR NOT NULL,
                    description TEXT,
                    category VARCHAR NOT NULL,
                    test_type VARCHAR NOT NULL,
                    instructions TEXT NOT NULL,
                    safety_notes TEXT,
                    required_tools JSON,
                    expected_result TEXT,
                    acceptable_range JSON,
                    measurement_unit VARCHAR,
                    order_index INTEGER DEFAULT 0,
                    is_required BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            print("✅ Created inspection_tests table")
            
            # Create test_results table
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS test_results (
                    id SERIAL PRIMARY KEY,
                    inspection_id INTEGER REFERENCES inspections(id),
                    test_id INTEGER REFERENCES inspection_tests(id),
                    result VARCHAR DEFAULT 'not_tested',
                    measured_value REAL,
                    notes TEXT,
                    photos JSON,
                    ai_analysis TEXT,
                    risk_level VARCHAR,
                    tested_by INTEGER REFERENCES users(id),
                    tested_at TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            print("✅ Created test_results table")
            
            # Create system_diagnostics table
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS system_diagnostics (
                    id SERIAL PRIMARY KEY,
                    inspection_id INTEGER REFERENCES inspections(id),
                    system_name VARCHAR NOT NULL,
                    overall_condition VARCHAR,
                    efficiency_rating REAL,
                    safety_score REAL,
                    code_compliance BOOLEAN,
                    critical_issues JSON,
                    warnings JSON,
                    recommendations JSON,
                    immediate_repairs REAL,
                    preventive_maintenance REAL,
                    replacement_timeline VARCHAR,
                    ai_summary TEXT,
                    confidence_score REAL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            print("✅ Created system_diagnostics table")
            
            # Create measurement_readings table
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS measurement_readings (
                    id SERIAL PRIMARY KEY,
                    test_result_id INTEGER REFERENCES test_results(id),
                    measurement_type VARCHAR NOT NULL,
                    value REAL NOT NULL,
                    unit VARCHAR NOT NULL,
                    location VARCHAR,
                    tool_used VARCHAR,
                    calibration_date DATE,
                    conditions TEXT,
                    notes TEXT,
                    measured_at TIMESTAMP NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            print("✅ Created measurement_readings table")
            
            # Create inspection_templates table
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS inspection_templates (
                    id SERIAL PRIMARY KEY,
                    template_id VARCHAR UNIQUE NOT NULL,
                    name VARCHAR NOT NULL,
                    description TEXT,
                    property_types JSON,
                    inspection_purposes JSON,
                    visual_inspection BOOLEAN DEFAULT TRUE,
                    system_testing BOOLEAN DEFAULT TRUE,
                    measurements BOOLEAN DEFAULT TRUE,
                    code_compliance BOOLEAN DEFAULT TRUE,
                    required_checklists JSON,
                    optional_checklists JSON,
                    custom_tests JSON,
                    regional_requirements JSON,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_by INTEGER REFERENCES users(id),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            print("✅ Created inspection_templates table")
            
            # Add indexes for better performance
            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_test_results_inspection ON test_results(inspection_id)"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_test_results_test ON test_results(test_id)"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_system_diagnostics_inspection ON system_diagnostics(inspection_id)"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_measurement_readings_test_result ON measurement_readings(test_result_id)"))
            print("✅ Created database indexes")
            
            # Update existing inspections table to support enhanced features
            try:
                conn.execute(text("ALTER TABLE inspections ADD COLUMN IF NOT EXISTS inspection_type VARCHAR DEFAULT 'routine'"))
                conn.execute(text("ALTER TABLE inspections ADD COLUMN IF NOT EXISTS enhanced_features_enabled BOOLEAN DEFAULT FALSE"))
                print("✅ Updated inspections table")
            except Exception as e:
                print(f"⚠️  Inspections table update warning: {e}")
            
            conn.commit()
            print("🎉 Enhanced inspections migration completed successfully!")
            
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        raise


def populate_default_checklists():
    """Populate database with default inspection checklists."""
    
    print("📋 Populating default inspection checklists...")
    
    try:
        with engine.connect() as conn:
            # Insert HVAC checklist
            conn.execute(text("""
                INSERT INTO inspection_checklists (
                    checklist_id, name, description, property_types, 
                    applicable_years, climate_zones, estimated_time, required_certifications
                ) VALUES (
                    'hvac_comprehensive',
                    'HVAC System Comprehensive Inspection',
                    'Complete heating, ventilation, and air conditioning system evaluation',
                    '["single_family", "condo", "townhouse"]',
                    '{"min": 1950, "max": 2024}',
                    '["all"]',
                    45,
                    '[]'
                ) ON CONFLICT (checklist_id) DO NOTHING
            """))
            
            # Insert Electrical checklist
            conn.execute(text("""
                INSERT INTO inspection_checklists (
                    checklist_id, name, description, property_types, 
                    applicable_years, climate_zones, estimated_time, required_certifications
                ) VALUES (
                    'electrical_comprehensive',
                    'Electrical System Safety Inspection',
                    'Comprehensive electrical safety and functionality testing',
                    '["single_family", "condo", "townhouse"]',
                    '{"min": 1950, "max": 2024}',
                    '["all"]',
                    60,
                    '["electrical_safety"]'
                ) ON CONFLICT (checklist_id) DO NOTHING
            """))
            
            # Insert Plumbing checklist
            conn.execute(text("""
                INSERT INTO inspection_checklists (
                    checklist_id, name, description, property_types, 
                    applicable_years, climate_zones, estimated_time, required_certifications
                ) VALUES (
                    'plumbing_comprehensive',
                    'Plumbing System Performance Inspection',
                    'Water pressure, flow, and system integrity testing',
                    '["single_family", "condo", "townhouse"]',
                    '{"min": 1950, "max": 2024}',
                    '["all"]',
                    40,
                    '[]'
                ) ON CONFLICT (checklist_id) DO NOTHING
            """))
            
            # Insert Safety checklist
            conn.execute(text("""
                INSERT INTO inspection_checklists (
                    checklist_id, name, description, property_types, 
                    applicable_years, climate_zones, estimated_time, required_certifications
                ) VALUES (
                    'safety_systems',
                    'Safety Systems Inspection',
                    'Smoke detectors, carbon monoxide, and safety equipment testing',
                    '["single_family", "condo", "townhouse", "commercial"]',
                    '{"min": 1950, "max": 2024}',
                    '["all"]',
                    20,
                    '[]'
                ) ON CONFLICT (checklist_id) DO NOTHING
            """))
            
            conn.commit()
            print("✅ Default checklists populated")
            
    except Exception as e:
        print(f"❌ Checklist population failed: {e}")
        raise


if __name__ == "__main__":
    migrate_enhanced_inspections()
    populate_default_checklists()
    print("🚀 Enhanced inspections system ready!")