# 🔍 VALIDACIÓN FINAL DEL SCHEMA - Script de Seed Data

## ✅ **SCHEMA COMPLETAMENTE CORREGIDO**

### **1. service_references - ✅ CORRECTO**
```sql
INSERT INTO service_references (
  id,                    -- UUID ✅
  reference_number,      -- VARCHAR(50) ✅
  client_name,           -- TEXT ✅
  client_contact,        -- VARCHAR(255) ✅ (NO client_email)
  service_type,          -- service_type ENUM ✅
  sample_description,    -- TEXT ✅
  location,              -- TEXT ✅
  status,                -- reference_status ENUM ✅
  created_at             -- TIMESTAMPTZ ✅
)
```

**Campos ELIMINADOS (no existen en schema real):**
- ❌ `client_email`
- ❌ `sample_weight`
- ❌ `urgent`
- ❌ `special_instructions`

### **2. operations - ✅ CORRECTO**
```sql
INSERT INTO operations (
  reference_id,          -- UUID REFERENCES service_references(id) ✅
  operation_type,        -- VARCHAR(100) ✅
  status,                -- operation_status ENUM ✅
  started_at,            -- TIMESTAMPTZ ✅ (NO scheduled_date)
  completed_at,          -- TIMESTAMPTZ ✅ (NO completed_date)
  notes,                 -- TEXT ✅ (incluye info del operador)
  created_at             -- TIMESTAMPTZ ✅
)
```

**Campos ELIMINADOS (no existen en schema real):**
- ❌ `assigned_operator` → Info movida a `notes`
- ❌ `scheduled_date` → Debe ser `started_at`
- ❌ `completed_date` → Debe ser `completed_at`

**ENUMs Validados:**
- ✅ `'pending'`, `'in_progress'`, `'completed'` (válidos)
- ❌ `'assigned'`, `'urgent'` (NO EXISTEN) → cambiados a `'pending'`

### **3. lab_analysis - ✅ CORREGIDO COMPLETAMENTE**
```sql
INSERT INTO lab_analysis (
  reference_id,          -- UUID REFERENCES service_references(id) ✅
  status,                -- lab_status ENUM ✅
  sample_received_at,    -- TIMESTAMPTZ ✅ (NO sample_received_date)
  started_at,            -- TIMESTAMPTZ ✅ (NO analysis_start_date)
  completed_at,          -- TIMESTAMPTZ ✅ (NO analysis_completion_date)
  results,               -- JSONB ✅ (NO campos individuales)
  notes,                 -- TEXT ✅ (incluye info del analista)
  created_at             -- TIMESTAMPTZ ✅
)
```

**Campos ELIMINADOS (no existen en schema real):**
- ❌ `assigned_analyst` → Info movida a `notes`
- ❌ `sample_received_date` → Debe ser `sample_received_at`
- ❌ `analysis_start_date` → Debe ser `started_at`
- ❌ `analysis_completion_date` → Debe ser `completed_at`
- ❌ `moisture_content`, `ash_content`, `volatile_matter`, `fixed_carbon`, `sulfur_content`, `calorific_value`, `lab_notes` → TODO va en `results` JSONB

**Estructura JSONB `results`:**
```json
{
  "humedad": {"value": 8.2, "unit": "%", "method": "ISO 589"},
  "cenizas": {"value": 12.5, "unit": "%", "method": "ISO 1171"},
  "azufre": {"value": 0.65, "unit": "%", "method": "ISO 19579"},
  "poder_calorifico": {"value": 6250, "unit": "kcal/kg", "method": "ISO 1928"},
  "carbono_fijo": {"value": 43.5, "unit": "%"},
  "materia_volatil": {"value": 35.8, "unit": "%"},
  "observaciones": "Carbón de excelente calidad para exportación"
}
```

### **4. Limpieza de Datos - ✅ CORRECTO**
```sql
-- Estrategia correcta: usar reference_id para relaciones
DELETE FROM lab_analysis WHERE reference_id IN (
  SELECT id FROM service_references WHERE reference_number LIKE 'REF-2025-%'
);
DELETE FROM operations WHERE reference_id IN (
  SELECT id FROM service_references WHERE reference_number LIKE 'REF-2025-%'
);
DELETE FROM service_references WHERE reference_number LIKE 'REF-2025-%';
```

### **5. UUIDs - ✅ CORRECTO**
- **Auto-generación**: PostgreSQL genera UUIDs automáticamente
- **Sin IDs manuales**: No más `'op001'`, `'lab001'`
- **Referencias válidas**: Solo UUIDs reales de `service_references`

### **6. ENUMs Validados - ✅ CORRECTO**

#### **operation_status:**
```sql
-- ✅ VÁLIDOS (usados en script):
'pending', 'in_progress', 'completed'

-- ❌ DISPONIBLES PERO NO USADOS:
'failed', 'rescheduled'

-- ❌ INVÁLIDOS (corregidos):
'assigned' → 'pending'
'urgent' → 'pending'
```

#### **lab_status:**
```sql
-- ✅ VÁLIDOS (usados en script):
'waiting_sample', 'in_analysis', 'completed'

-- ❌ DISPONIBLES PERO NO USADOS:
'failed', 'requires_retest'
```

#### **service_type:**
```sql
-- ✅ VÁLIDOS (usados en script):
'quality_analysis', 'quantity_certification', 'both'

-- ❌ DISPONIBLE PERO NO USADO:
'custom'
```

### **7. Datos Demo Realistas - ✅ CORRECTO**

#### **6 Referencias:**
1. **REF-2025-001** - Minera El Cerrejón (Completado)
2. **REF-2025-002** - Industria Carboquímica (Completado)
3. **REF-2025-003** - Drummond Company (En Progreso)
4. **REF-2025-004** - Carbones del Caribe (Pendiente)
5. **REF-2025-005** - Ecopetrol (Pendiente)
6. **REF-2025-006** - Grupo Prodeco (Pendiente)

#### **6 Operaciones:**
- **2 Completadas** con fechas reales
- **1 En Progreso** (Carlos Mendoza en puerto)
- **3 Pendientes** con diferente urgencia

#### **6 Análisis:**
- **2 Completados** con datos JSONB técnicos
- **1 En Análisis**
- **3 Esperando Muestras**

---

## 🎯 **SCRIPT 100% VALIDADO CONTRA SCHEMA REAL**

### **Archivos Actualizados:**
- ✅ `supabase/seed.sql` - SQL directo corregido
- ✅ `apps/web/app/api/seed-demo/route.ts` - API endpoint corregido

### **Próximo Paso:**
Una vez que Vercel complete el deployment:

```bash
curl -X POST https://incolab.vercel.app/api/seed-demo
```

**El script ahora coincide EXACTAMENTE con el schema real de la base de datos.**