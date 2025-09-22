# PRD Técnico - Sistema Incolab
## Product Requirements Document

### 📋 Información del Proyecto

**Cliente**: Incolab (Laboratorio acreditado ISO 17025)
**Fecha**: 2025-01-22
**Versión**: 1.0
**Estado**: En Desarrollo
**Demo Target**: 3 días

---

## 🎯 Executive Summary

### Problema Principal
Incolab gestiona procesos críticos de certificación de combustibles sólidos usando Excel, correos y sistemas fragmentados, generando:
- **Tiempo perdido**: 4-6 horas diarias en coordinación manual
- **Errores frecuentes**: Duplicación de información y pérdida de trazabilidad
- **Ineficiencia**: 20% del tiempo operativo en tareas no productivas

### Solución Propuesta
Plataforma web centralizada que permite:
- Crear referencias únicas por servicio
- Asignar automáticamente tareas a operaciones y laboratorio
- Tracking en tiempo real del estado
- Generar certificados automáticamente

### Valor Demostrable
- **Reducción 70%** en tiempos de coordinación
- **Trazabilidad completa** desde referencia hasta certificado
- **Eliminación** de correos duplicados y Excel dispersos

---

## 🔍 Problem Definition

### Current State Analysis
```
PROCESO ACTUAL (PROBLEMÁTICO):
1. Control de registro crea referencia en Excel
2. Envía correos con adjuntos a operaciones
3. Envía correos separados a laboratorio
4. Cada área trabaja de forma aislada
5. Consolidación manual en certificados
6. Sin visibilidad del estado en tiempo real
```

### Pain Points Identificados
| Pain Point | Impacto | Frecuencia | Severidad |
|------------|---------|------------|-----------|
| Coordinación manual | Alto | Diario | 9/10 |
| Pérdida de información | Medio | Semanal | 8/10 |
| Duplicación de trabajo | Alto | Diario | 7/10 |
| Falta de trazabilidad | Alto | Permanente | 9/10 |

### Success Metrics
- **Tiempo de coordinación**: De 4h → 1h por servicio
- **Errores**: Reducción del 90%
- **Trazabilidad**: 100% de servicios rastreables
- **Satisfacción del equipo**: De 3/10 → 8/10

---

## 🎯 Target Users & Personas

### Persona 1: Control de Registro
**Nombre**: María (Coordinadora)
**Rol**: Recibe servicios y coordina áreas
**Pain**: "Todo es Excel y correo... un desastre"
**Goal**: Crear referencias rápido y tener visibilidad total

### Persona 2: Operaciones
**Nombre**: Carlos (Técnico de Campo)
**Rol**: Realiza muestreos y operaciones
**Pain**: "No sé qué tengo pendiente hasta que me llaman"
**Goal**: Ver mis tareas asignadas y actualizar estados

### Persona 3: Laboratorio
**Nombre**: Ana (Analista)
**Rol**: Ejecuta análisis de muestras
**Pain**: "Siempre estoy preguntando qué análisis hay pendientes"
**Goal**: Cargar resultados y marcar análisis completados

### Persona 4: Gerencia
**Nombre**: Roberto (Gerente)
**Rol**: Supervisión y toma de decisiones
**Pain**: "No tengo visibilidad del estado de los servicios"
**Goal**: Dashboard consolidado con métricas en tiempo real

---

## ⚙️ Core Features Specification

### Feature 1: Gestión de Referencias
**Purpose**: Unificar origen del servicio en identificador único
**Priority**: P0 (Crítico)

**User Stories**:
- Como control de registro, quiero crear una referencia con datos mínimos
- Como usuario, quiero que cada referencia tenga un ID único
- Como equipo, queremos trabajar bajo el mismo identificador

**Acceptance Criteria**:
- [x] Formulario de creación con validación
- [x] Generación automática de ID único
- [x] Campos obligatorios: cliente, servicio, fecha
- [x] Estados: pending, in_progress, completed, cancelled

### Feature 2: Auto-asignación de Servicios
**Purpose**: Eliminar coordinación manual entre áreas
**Priority**: P0 (Crítico)

**User Stories**:
- Como sistema, quiero crear automáticamente tareas en operaciones
- Como sistema, quiero crear automáticamente tareas en laboratorio
- Como usuario, quiero que las asignaciones sean inmediatas

**Acceptance Criteria**:
- [x] Trigger automático al crear referencia
- [x] Creación de registros en operations y lab_analysis
- [x] Estados iniciales configurados correctamente

### Feature 3: Tracking en Tiempo Real
**Purpose**: Visibilidad inmediata del avance
**Priority**: P0 (Crítico)

**User Stories**:
- Como gerente, quiero ver dashboard con estado actual
- Como equipo, queremos actualizaciones automáticas sin recargar
- Como control, quiero saber cuándo completar certificado

**Acceptance Criteria**:
- [x] Dashboard con métricas en tiempo real
- [x] Supabase Realtime para updates automáticos
- [x] Estados consolidados por referencia

### Feature 4: Gestión por Área
**Purpose**: Interfaces específicas para cada rol
**Priority**: P1 (Alto)

**User Stories**:
- Como operaciones, quiero ver solo mis tareas pendientes
- Como laboratorio, quiero cargar resultados fácilmente
- Como cada área, quiero actualizar estados independientemente

**Acceptance Criteria**:
- [x] Vista específica /operations
- [x] Vista específica /laboratory
- [x] Formularios de actualización por rol

### Feature 5: Generación de Certificados
**Purpose**: Automatizar consolidación final
**Priority**: P1 (Alto)

**User Stories**:
- Como control, quiero generar certificado desde la plataforma
- Como cliente, quiero recibir certificado con información completa
- Como proceso, quiero eliminar consolidación manual

**Acceptance Criteria**:
- [x] Generación de PDF básico
- [x] Información consolidada de todas las áreas
- [x] Descarga directa desde la plataforma

---

## 🏗️ Technical Architecture

### Tech Stack
- **Frontend**: Next.js 15.5.2 + React 19
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **UI**: Shadcn UI + Tailwind CSS
- **State Management**: TanStack React Query
- **Deployment**: Vercel

### Database Design
Ver archivo: `database-schema.sql`

### API Endpoints
```
POST   /api/references              # Crear referencia
GET    /api/references              # Listar referencias
GET    /api/references/[id]         # Obtener referencia específica
PATCH  /api/references/[id]         # Actualizar referencia
GET    /api/references/[id]/certificate # Descargar certificado

PATCH  /api/operations/[id]         # Actualizar operación
PATCH  /api/laboratory/[id]         # Actualizar análisis laboratorio

GET    /api/dashboard/metrics       # Métricas para dashboard
```

### Folder Structure
```
apps/web/app/home/
├── dashboard/              # Dashboard principal
├── references/             # Gestión de referencias
│   ├── page.tsx           # Lista
│   ├── create/            # Crear
│   └── [id]/              # Detalle
├── operations/             # Vista operaciones
├── laboratory/             # Vista laboratorio
└── settings/              # Configuraciones

packages/ui/src/components/
├── references/             # Componentes referencias
├── operations/             # Componentes operaciones
├── laboratory/             # Componentes laboratorio
└── dashboard/              # Componentes dashboard
```

---

## 📊 Success Criteria & KPIs

### Demo Success Criteria
- [x] Crear referencia funcional
- [x] Auto-asignación operando
- [x] Vistas por área implementadas
- [x] Dashboard con métricas básicas
- [x] Certificado PDF generándose

### Business KPIs
- **Tiempo de coordinación**: Target < 1 hora
- **Errores por servicio**: Target < 1
- **Servicios rastreables**: Target 100%
- **Satisfacción del usuario**: Target > 8/10

### Technical KPIs
- **Performance**: Carga inicial < 2s
- **Availability**: Uptime > 99%
- **Security**: Autenticación + RLS configurado
- **Scalability**: Soporte para 100+ referencias/mes

---

## 🚀 Implementation Roadmap

### Day 1: Foundation
- [x] Database schema + migrations
- [x] Authentication setup
- [x] Basic navigation structure
- [x] Core types and interfaces

### Day 2: Core Features
- [x] Referencias CRUD
- [x] Auto-asignación triggers
- [x] Realtime subscriptions
- [x] Area-specific views

### Day 3: Polish & Demo
- [x] Dashboard consolidado
- [x] Certificate generation
- [x] Demo data setup
- [x] UI/UX polish

---

## 📝 Notes & Assumptions

### Assumptions
- Usuarios tienen acceso a navegador web moderno
- Conexión a internet estable
- Equipo dispuesto a cambiar procesos actuales
- Datos históricos no requieren migración inmediata

### Future Enhancements (Post-Demo)
- Integración con equipos de laboratorio
- Notificaciones por email/SMS
- Reportes avanzados y analytics
- Mobile app para técnicos de campo
- APIs para clientes externos

### Risks & Mitigations
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Resistencia al cambio | Medium | High | Demos frecuentes + capacitación |
| Problemas de conectividad | Low | Medium | Cache local + offline support |
| Pérdida de datos | Low | High | Backups automáticos + versioning |

---

**Última actualización**: 2025-01-22
**Siguiente revisión**: Post-demo feedback session