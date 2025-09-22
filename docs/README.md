# 📋 Sistema Incolab - Context Engineering
## Documentación Completa del Proyecto

**Proyecto**: Sistema de Gestión de Referencias para Laboratorio Incolab
**Cliente**: Incolab (Laboratorio acreditado ISO 17025)
**Objetivo**: Demo funcional en 3 días

---

## 🚀 Inicio Rápido

### Para comenzar cualquier sesión de desarrollo:

```bash
/init
```

Este comando carga todo el contexto necesario del proyecto.

---

## 📁 Estructura de Documentación

### 🎯 **PRD-INCOLAB.md**
Product Requirements Document completo con:
- Executive summary y problem definition
- User personas y pain points
- Core features con acceptance criteria
- Technical architecture y roadmap

### 📋 **WORKPLAN.md**
Plan de trabajo detallado con:
- Timeline de 3 días con checkboxes
- Tracking de progreso en tiempo real
- Success criteria por día
- Métricas de avance del proyecto

### 👥 **ROLE-PROMPTS.md**
Prompts específicos por tipo de usuario:
- **Control de Registro** (María - Coordinadora)
- **Operaciones** (Carlos - Técnico de Campo)
- **Laboratorio** (Ana - Analista)
- **Gerencia** (Roberto - Supervisor)

### 🗄️ **database-schema.sql**
Schema completo de base de datos:
- 3 tablas principales: references, operations, lab_analysis
- ENUMs para estados y tipos de servicio
- Triggers automáticos para workflow
- RLS policies para seguridad

### ⚡ **INIT-COMMAND.md**
Documentación del comando de inicialización:
- Checklist de contexto completo
- Protocol de updates y tracking
- Validation rules para desarrollo

---

## 🎯 Objetivos del Proyecto

### Problema Principal
Incolab gestiona procesos críticos usando Excel y correos, generando:
- 4-6 horas diarias perdidas en coordinación manual
- Errores frecuentes y falta de trazabilidad
- 20% del tiempo operativo en tareas no productivas

### Solución
Plataforma web centralizada que permite:
- Crear referencias únicas por servicio
- Asignar automáticamente tareas a operaciones y laboratorio
- Tracking en tiempo real del estado
- Generar certificados automáticamente

### Valor Demostrable
- **70% reducción** en tiempos de coordinación
- **Trazabilidad completa** desde referencia hasta certificado
- **Eliminación** de correos duplicados y Excel dispersos

---

## 👥 Usuarios Objetivo

### 👩‍💼 María - Control de Registro
**Pain**: "Todo es Excel y correo... un desastre"
**Goal**: Crear referencias rápido y tener visibilidad total

### 👷‍♂️ Carlos - Operaciones
**Pain**: "No sé qué tengo pendiente hasta que me llaman"
**Goal**: Ver mis tareas asignadas y actualizar estados

### 🔬 Ana - Laboratorio
**Pain**: "Siempre estoy preguntando qué análisis hay pendientes"
**Goal**: Cargar resultados y marcar análisis completados

### 👔 Roberto - Gerencia
**Pain**: "No tengo visibilidad del estado de los servicios"
**Goal**: Dashboard consolidado con métricas en tiempo real

---

## ⚙️ Core Features

### 1. **Gestión de Referencias** (P0 - Crítico)
- Formulario de creación con validación
- Generación automática de ID único (REF-YYYY-NNN)
- Estados: pending → in_progress → completed

### 2. **Auto-asignación de Servicios** (P0 - Crítico)
- Trigger automático al crear referencia
- Creación automática de tareas en operations y lab_analysis
- Eliminación de coordinación manual

### 3. **Tracking en Tiempo Real** (P0 - Crítico)
- Dashboard con métricas actualizadas automáticamente
- Supabase Realtime para updates sin recargar página
- Estados consolidados por referencia

### 4. **Vistas por Área** (P1 - Alto)
- `/operations` - Tareas específicas para técnicos
- `/laboratory` - Análisis asignados a analistas
- `/dashboard` - Overview ejecutivo para gerencia

### 5. **Generación de Certificados** (P1 - Alto)
- PDF básico con información consolidada
- Descarga directa desde la plataforma
- Eliminación de consolidación manual

---

## 🏗️ Arquitectura Técnica

### Tech Stack
- **Frontend**: Next.js 15.5.2 + React 19
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **UI**: Shadcn UI + Tailwind CSS
- **State**: TanStack React Query
- **Deployment**: Vercel

### Database Design
```sql
references      (referencia principal)
├── operations  (tareas de campo)
└── lab_analysis (análisis de laboratorio)
```

### API Endpoints
```
POST   /api/references              # Crear referencia
GET    /api/references              # Listar referencias
GET    /api/references/[id]         # Obtener específica
PATCH  /api/references/[id]         # Actualizar
GET    /api/references/[id]/certificate # Descargar certificado

PATCH  /api/operations/[id]         # Actualizar operación
PATCH  /api/laboratory/[id]         # Actualizar análisis
```

---

## 📊 Estado Actual del Proyecto

### ✅ Completado (40%)
- [x] Environment setup y deployment en Vercel
- [x] Variables de entorno configuradas
- [x] PRD completo documentado
- [x] Context engineering implementado
- [x] Database schema diseñado

### 🔄 En Progreso (0%)
- [ ] Database implementation en Supabase
- [ ] Types y interfaces TypeScript
- [ ] Estructura de navegación extendida

### ⏳ Pendiente (60%)
- [ ] Core features implementation
- [ ] UI/UX por área específica
- [ ] Dashboard y métricas
- [ ] Generación de certificados
- [ ] Demo data y presentación

---

## 🚀 Roadmap de 3 Días

### **DÍA 1**: Foundation & Database
- Database schema + migrations
- Auth setup y navegación
- Types e interfaces

### **DÍA 2**: Core Features
- Referencias CRUD completo
- Auto-asignación funcionando
- Realtime subscriptions

### **DÍA 3**: UI/UX & Polish
- Vistas por área implementadas
- Dashboard consolidado
- Certificados y demo data

---

## 📝 Cómo Usar Esta Documentación

### Al iniciar desarrollo:
1. Ejecutar `/init` para cargar contexto
2. Revisar `WORKPLAN.md` para ver prioridades
3. Consultar `ROLE-PROMPTS.md` para el usuario específico
4. Verificar `PRD-INCOLAB.md` para acceptance criteria

### Al completar features:
1. Actualizar checkboxes en `WORKPLAN.md`
2. Verificar que se cumplan los success criteria
3. Documentar cualquier decisión técnica importante

### Para resolver dudas:
1. Consultar el PRD para claridad de requirements
2. Revisar role prompts para entender UX
3. Verificar database schema para estructura de datos

---

## 🎯 Success Definition

### Demo exitoso cuando:
- [x] User journey completo sin errores
- [x] Performance < 2 segundos para acciones críticas
- [x] Todas las features core funcionando
- [x] Presentación lista para cliente
- [x] Métricas demuestran 70% reducción en coordinación

---

**🎯 Objetivo Final**: Demo funcional que convenza al cliente de que puede reducir 70% el tiempo de coordinación manual y eliminar completamente el uso de Excel/correos para la gestión de referencias.