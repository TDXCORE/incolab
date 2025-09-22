-- ============================================================================
-- INCOLAB DATABASE SCHEMA - FIXED VERSION
-- Sistema de Gestión de Referencias para Laboratorio ISO 17025
-- ============================================================================

-- ============================================================================
-- EXTENSIONES REQUERIDAS
-- ============================================================================

-- UUID extension para generar IDs únicos
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

-- Estados de referencias
DO $$ BEGIN
    CREATE TYPE reference_status AS ENUM (
        'pending',      -- Creada, esperando inicio
        'in_progress',  -- En proceso (operaciones o lab trabajando)
        'completed',    -- Completada, lista para certificado
        'cancelled',    -- Cancelada por algún motivo
        'on_hold'       -- En espera (problemas, falta información)
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tipos de servicio que ofrece Incolab
DO $$ BEGIN
    CREATE TYPE service_type AS ENUM (
        'quality_analysis',        -- Solo análisis de calidad
        'quantity_certification',  -- Solo certificación de cantidad
        'both',                   -- Ambos servicios
        'custom'                  -- Servicio personalizado
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Estados de operaciones de campo
DO $$ BEGIN
    CREATE TYPE operation_status AS ENUM (
        'pending',      -- Asignada, no iniciada
        'in_progress',  -- Técnico en campo
        'completed',    -- Muestreo completado
        'failed',       -- No se pudo completar
        'rescheduled'   -- Reprogramada
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Estados de análisis de laboratorio
DO $$ BEGIN
    CREATE TYPE lab_status AS ENUM (
        'waiting_sample',  -- Esperando que llegue muestra de operaciones
        'in_analysis',     -- Muestra en proceso de análisis
        'completed',       -- Análisis completado
        'failed',          -- Análisis falló/no válido
        'requires_retest'  -- Requiere nuevo análisis
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Prioridades para gestión de workload
DO $$ BEGIN
    CREATE TYPE priority_level AS ENUM (
        'low',
        'normal',
        'high',
        'urgent'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- TABLA PRINCIPAL: SERVICE_REFERENCES (evitar palabra reservada 'references')
-- ============================================================================

CREATE TABLE IF NOT EXISTS service_references (
    -- Identificadores únicos
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_number VARCHAR(50) UNIQUE NOT NULL, -- REF-2024-001, REF-2024-002, etc.

    -- Información del cliente y servicio
    client_name TEXT NOT NULL,
    client_contact VARCHAR(255), -- email o teléfono
    service_type service_type NOT NULL DEFAULT 'both',

    -- Detalles del servicio
    sample_description TEXT, -- Descripción de qué se va a analizar
    location TEXT, -- Dirección o ubicación del muestreo
    priority priority_level DEFAULT 'normal',

    -- Estados y tracking
    status reference_status DEFAULT 'pending',
    estimated_completion_date DATE,
    actual_completion_date DATE,

    -- Notas y observaciones
    notes TEXT, -- Observaciones generales
    internal_notes TEXT, -- Notas internas, no visibles para cliente

    -- Metadata y auditoría
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id), -- Usuario que creó la referencia

    -- Validaciones
    CONSTRAINT valid_completion_dates CHECK (
        actual_completion_date IS NULL OR
        actual_completion_date >= created_at::date
    )
);

-- ============================================================================
-- TABLA: OPERATIONS (Tareas de Campo)
-- ============================================================================

CREATE TABLE IF NOT EXISTS operations (
    -- Identificadores
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_id UUID NOT NULL REFERENCES service_references(id) ON DELETE CASCADE,

    -- Asignación y responsabilidad
    assigned_to UUID REFERENCES auth.users(id), -- Técnico asignado
    assigned_at TIMESTAMPTZ,

    -- Estado y progreso
    status operation_status DEFAULT 'pending',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,

    -- Detalles de la operación
    operation_type VARCHAR(100) DEFAULT 'muestreo', -- "muestreo", "inspección", "medición"
    equipment_used TEXT[], -- Array de equipos utilizados
    sample_quantity DECIMAL, -- Cantidad de muestra tomada
    sample_units VARCHAR(20), -- kg, L, m3, etc.

    -- Ubicación y condiciones
    actual_location TEXT, -- Ubicación real del muestreo
    weather_conditions TEXT,
    environmental_notes TEXT,

    -- Documentación
    photos_urls TEXT[], -- URLs de fotos tomadas en campo
    notes TEXT, -- Notas del técnico
    issues_found TEXT, -- Problemas encontrados

    -- Calidad y validación
    quality_check_passed BOOLEAN,
    supervisor_approval BOOLEAN DEFAULT FALSE,
    supervisor_approved_by UUID REFERENCES auth.users(id),
    supervisor_approved_at TIMESTAMPTZ,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Validaciones
    CONSTRAINT valid_operation_dates CHECK (
        completed_at IS NULL OR started_at IS NULL OR completed_at >= started_at
    ),
    CONSTRAINT valid_assignment CHECK (
        assigned_to IS NULL OR assigned_at IS NOT NULL
    )
);

-- ============================================================================
-- TABLA: LAB_ANALYSIS (Análisis de Laboratorio)
-- ============================================================================

CREATE TABLE IF NOT EXISTS lab_analysis (
    -- Identificadores
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_id UUID NOT NULL REFERENCES service_references(id) ON DELETE CASCADE,
    operation_id UUID REFERENCES operations(id), -- Qué operación generó la muestra

    -- Asignación y responsabilidad
    analyst_id UUID REFERENCES auth.users(id), -- Analista asignado
    assigned_at TIMESTAMPTZ,

    -- Estado y progreso
    status lab_status DEFAULT 'waiting_sample',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,

    -- Información de la muestra
    sample_id VARCHAR(50), -- ID interno de laboratorio para la muestra
    sample_received_at TIMESTAMPTZ,
    sample_condition TEXT, -- Estado de la muestra al recibirla

    -- Análisis específicos
    analysis_type TEXT[], -- ["humedad", "cenizas", "azufre", etc.]
    test_methods TEXT[], -- Métodos/normas utilizadas

    -- Resultados (JSON flexible para diferentes tipos de análisis)
    results JSONB, -- Estructura flexible para diferentes tipos de resultados
    /*
    Ejemplo de estructura de results:
    {
        "humedad": {"value": 12.5, "unit": "%", "method": "ISO 589"},
        "cenizas": {"value": 8.2, "unit": "%", "method": "ISO 1171"},
        "azufre": {"value": 0.8, "unit": "%", "method": "ISO 19579"},
        "poder_calorifico": {"value": 6200, "unit": "kcal/kg", "method": "ISO 1928"},
        "observaciones": "Muestra homogénea, sin irregularidades"
    }
    */

    -- Control de calidad
    qc_passed BOOLEAN,
    qc_notes TEXT,

    -- Certificación y aprobación
    certified_by UUID REFERENCES auth.users(id), -- Quien certifica los resultados
    certified_at TIMESTAMPTZ,
    certificate_number VARCHAR(50), -- Número de certificado generado

    -- Documentación adicional
    reports_urls TEXT[], -- URLs de reportes detallados o gráficos
    notes TEXT, -- Notas del analista
    issues_found TEXT, -- Problemas durante el análisis

    -- Re-análisis si es necesario
    requires_reanalysis BOOLEAN DEFAULT FALSE,
    reanalysis_reason TEXT,
    original_analysis_id UUID REFERENCES lab_analysis(id), -- Si es un re-análisis

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Validaciones
    CONSTRAINT valid_analysis_dates CHECK (
        completed_at IS NULL OR started_at IS NULL OR completed_at >= started_at
    ),
    CONSTRAINT valid_sample_reception CHECK (
        sample_received_at IS NULL OR sample_received_at >= created_at
    ),
    CONSTRAINT valid_certification CHECK (
        certified_by IS NULL OR certified_at IS NOT NULL
    )
);

-- ============================================================================
-- FUNCIONES AUXILIARES
-- ============================================================================

-- Función para actualizar timestamps automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para crear automáticamente tareas de operaciones y laboratorio
CREATE OR REPLACE FUNCTION create_service_tasks()
RETURNS TRIGGER AS $$
BEGIN
    -- Crear automáticamente tarea en operaciones
    INSERT INTO operations (reference_id, operation_type, status)
    VALUES (NEW.id, 'muestreo', 'pending');

    -- Crear automáticamente entrada en laboratorio (esperando muestra)
    INSERT INTO lab_analysis (reference_id, status)
    VALUES (NEW.id, 'waiting_sample');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Eliminar triggers existentes si existen
DROP TRIGGER IF EXISTS update_references_updated_at ON service_references;
DROP TRIGGER IF EXISTS update_operations_updated_at ON operations;
DROP TRIGGER IF EXISTS update_lab_analysis_updated_at ON lab_analysis;
DROP TRIGGER IF EXISTS auto_create_service_tasks ON service_references;

-- Crear triggers para actualizar timestamps automáticamente
CREATE TRIGGER update_references_updated_at
    BEFORE UPDATE ON service_references
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_operations_updated_at
    BEFORE UPDATE ON operations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lab_analysis_updated_at
    BEFORE UPDATE ON lab_analysis
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para auto-crear tareas cuando se crea una referencia
CREATE TRIGGER auto_create_service_tasks
    AFTER INSERT ON service_references
    FOR EACH ROW
    EXECUTE FUNCTION create_service_tasks();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE service_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_analysis ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Referencias visibles para usuarios autenticados" ON service_references;
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear referencias" ON service_references;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar referencias" ON service_references;
DROP POLICY IF EXISTS "Operaciones visibles para usuarios autenticados" ON operations;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar operaciones" ON operations;
DROP POLICY IF EXISTS "Análisis visibles para usuarios autenticados" ON lab_analysis;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar análisis" ON lab_analysis;

-- Políticas básicas de seguridad (permitir acceso autenticado inicialmente)
-- Referencias: Usuarios autenticados pueden ver todas las referencias
CREATE POLICY "Referencias visibles para usuarios autenticados" ON service_references
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados pueden crear referencias" ON service_references
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados pueden actualizar referencias" ON service_references
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Operaciones: Acceso para usuarios autenticados
CREATE POLICY "Operaciones visibles para usuarios autenticados" ON operations
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados pueden actualizar operaciones" ON operations
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Análisis de laboratorio: Acceso para usuarios autenticados
CREATE POLICY "Análisis visibles para usuarios autenticados" ON lab_analysis
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados pueden actualizar análisis" ON lab_analysis
    FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================================

-- Eliminar índices si existen
DROP INDEX IF EXISTS idx_references_status;
DROP INDEX IF EXISTS idx_references_created_at;
DROP INDEX IF EXISTS idx_references_client_name;
DROP INDEX IF EXISTS idx_references_reference_number;
DROP INDEX IF EXISTS idx_operations_reference_id;
DROP INDEX IF EXISTS idx_operations_assigned_to;
DROP INDEX IF EXISTS idx_operations_status;
DROP INDEX IF EXISTS idx_lab_analysis_reference_id;
DROP INDEX IF EXISTS idx_lab_analysis_analyst_id;
DROP INDEX IF EXISTS idx_lab_analysis_status;
DROP INDEX IF EXISTS idx_lab_analysis_sample_id;
DROP INDEX IF EXISTS idx_operations_status_assigned;
DROP INDEX IF EXISTS idx_lab_analysis_status_analyst;

-- Crear índices para búsquedas frecuentes
CREATE INDEX idx_references_status ON service_references(status);
CREATE INDEX idx_references_created_at ON service_references(created_at);
CREATE INDEX idx_references_client_name ON service_references(client_name);
CREATE INDEX idx_references_reference_number ON service_references(reference_number);

CREATE INDEX idx_operations_reference_id ON operations(reference_id);
CREATE INDEX idx_operations_assigned_to ON operations(assigned_to);
CREATE INDEX idx_operations_status ON operations(status);

CREATE INDEX idx_lab_analysis_reference_id ON lab_analysis(reference_id);
CREATE INDEX idx_lab_analysis_analyst_id ON lab_analysis(analyst_id);
CREATE INDEX idx_lab_analysis_status ON lab_analysis(status);
CREATE INDEX idx_lab_analysis_sample_id ON lab_analysis(sample_id);

-- Índices compuestos para queries complejas
CREATE INDEX idx_operations_status_assigned ON operations(status, assigned_to);
CREATE INDEX idx_lab_analysis_status_analyst ON lab_analysis(status, analyst_id);

-- ============================================================================
-- FUNCIÓN PARA GENERAR NÚMEROS DE REFERENCIA
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_reference_number()
RETURNS TEXT AS $$
DECLARE
    year_str TEXT;
    counter INTEGER;
    ref_number TEXT;
BEGIN
    -- Obtener año actual
    year_str := EXTRACT(YEAR FROM NOW())::TEXT;

    -- Contar referencias del año actual y agregar 1
    SELECT COUNT(*) + 1 INTO counter
    FROM service_references
    WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());

    -- Formatear número de referencia: REF-2024-001
    ref_number := 'REF-' || year_str || '-' || LPAD(counter::TEXT, 3, '0');

    RETURN ref_number;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- ============================================================================

COMMENT ON TABLE service_references IS 'Tabla principal que almacena todas las referencias de servicios de Incolab';
COMMENT ON TABLE operations IS 'Tareas de campo, muestreos e inspecciones realizadas por técnicos';
COMMENT ON TABLE lab_analysis IS 'Análisis de laboratorio realizados sobre las muestras';

COMMENT ON COLUMN service_references.reference_number IS 'Número único de referencia formato REF-YYYY-NNN';
COMMENT ON COLUMN service_references.service_type IS 'Tipo de servicio: análisis de calidad, certificación de cantidad, o ambos';
COMMENT ON COLUMN service_references.priority IS 'Prioridad del servicio para gestión de workload';

COMMENT ON COLUMN operations.equipment_used IS 'Array de equipos utilizados en la operación de campo';
COMMENT ON COLUMN operations.photos_urls IS 'URLs de fotos tomadas durante la operación';

COMMENT ON COLUMN lab_analysis.results IS 'Resultados del análisis en formato JSON flexible';
COMMENT ON COLUMN lab_analysis.analysis_type IS 'Array de tipos de análisis realizados';

-- ============================================================================
-- DATOS DE EJEMPLO PARA DEMO
-- ============================================================================

-- Insertar algunas referencias de ejemplo
-- Nota: Estos datos se pueden insertar una vez que haya usuarios en el sistema

INSERT INTO service_references (reference_number, client_name, service_type, sample_description, location, status, notes)
VALUES
    ('REF-2025-001', 'Empresa ABC S.A.', 'both', 'Carbón bituminoso para análisis completo', 'Mina El Cerrejón, La Guajira', 'completed', 'Cliente preferencial, priorizar'),
    ('REF-2025-002', 'Industria XYZ Ltda.', 'quality_analysis', 'Biomasa pelletizada', 'Planta Industrial, Bogotá', 'in_progress', 'Requiere análisis de humedad urgente'),
    ('REF-2025-003', 'Compañía 123 S.A.S.', 'quantity_certification', 'Carbón térmico exportación', 'Puerto de Cartagena', 'pending', 'Certificación para exportación a Europa');

-- ============================================================================
-- VERIFICACIÓN DEL SCHEMA
-- ============================================================================

-- Query para verificar que todas las tablas se crearon correctamente
SELECT
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name IN ('service_references', 'operations', 'lab_analysis')
ORDER BY table_name;