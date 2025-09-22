# 🚀 COMANDO /init - Sistema Incolab
## Context Engineering Initialization Command

**Propósito**: Comando que debe ejecutarse al inicio de cada sesión de desarrollo
**Función**: Cargar todo el contexto del proyecto para mantener consistencia

---

## 📋 Comando de Inicialización

### Ejecutar al inicio de cada sesión:
```bash
/init
```

Este comando debe cargar automáticamente:
1. **PRD completo** con especificaciones técnicas
2. **Workplan actualizado** con estado de tareas
3. **Role prompts** para desarrollo orientado por usuario
4. **Database schema** y estructura de datos
5. **Context de desarrollo** y decisiones técnicas

---

## 📁 Archivos de Context Engineering

### 1. **PRD-INCOLAB.md**
- Product Requirements Document completo
- Especificaciones técnicas detalladas
- User stories y acceptance criteria
- Arquitectura y tech stack

### 2. **WORKPLAN.md**
- Plan de trabajo con checkboxes
- Tracking de progreso por día
- Métricas de avance
- Success criteria

### 3. **ROLE-PROMPTS.md**
- Prompts específicos por rol de usuario
- Contexto para cada feature
- UX requirements por persona
- Technical requirements específicos

### 4. **database-schema.sql**
- Schema completo de base de datos
- Triggers y funciones
- Políticas de seguridad RLS
- Datos de ejemplo

### 5. **INIT-COMMAND.md** (este archivo)
- Documentación del comando /init
- Lista de verificación de contexto
- Instrucciones de uso

---

## 🎯 Context Loading Checklist

Cuando ejecutes `/init`, verifica que tienes acceso a:

### ✅ Información del Proyecto
- [x] Cliente: Incolab (Laboratorio ISO 17025)
- [x] Objetivo: Centralizar gestión de referencias
- [x] Timeline: Demo funcional en 3 días
- [x] Stack: Next.js + Supabase + Shadcn UI

### ✅ Problem Definition
- [x] Pain: Procesos manuales con Excel y correos
- [x] Impact: 4-6 horas diarias perdidas en coordinación
- [x] Solution: Plataforma centralizada con tracking en tiempo real
- [x] Value: 70% reducción en tiempo de coordinación

### ✅ User Personas
- [x] **María (Control de Registro)**: Coordinadora que crea referencias
- [x] **Carlos (Operaciones)**: Técnico de campo que ejecuta muestreos
- [x] **Ana (Laboratorio)**: Analista que ejecuta análisis
- [x] **Roberto (Gerencia)**: Supervisor que necesita métricas

### ✅ Core Features
- [x] **Gestión de Referencias**: CRUD completo con auto-ID
- [x] **Auto-asignación**: Triggers para crear tareas automáticamente
- [x] **Tracking Real-time**: Supabase Realtime para updates
- [x] **Vistas por Área**: /operations, /laboratory, /dashboard
- [x] **Certificados**: Generación automática de PDF

### ✅ Technical Architecture
- [x] **Database**: PostgreSQL con 3 tablas principales
- [x] **Auth**: Supabase Auth + RLS policies
- [x] **Frontend**: Next.js 15 + React 19
- [x] **UI**: Shadcn UI + Tailwind CSS
- [x] **State**: TanStack React Query

### ✅ Current Status
- [x] **Environment**: Configurado y deployado en Vercel
- [x] **Documentation**: PRD y context engineering completos
- [x] **Next Steps**: Database implementation

---

## 🔄 Context Update Protocol

### Cuando completar una funcionalidad:
1. **Actualizar WORKPLAN.md** marcando checkboxes completados
2. **Verificar PRD** que acceptance criteria se cumplan
3. **Revisar ROLE-PROMPTS** que UX requirements estén satisfechos
4. **Documentar cambios** si hay desviaciones del plan original

### Template para updates:
```markdown
## [FECHA] - [FUNCIONALIDAD COMPLETADA]

### ✅ Completado:
- [Lista específica de lo que se terminó]

### 🔄 Estado actual:
- [Progreso general del proyecto]

### 🎯 Siguiente prioridad:
- [Qué sigue en el workplan]

### 📝 Notas:
- [Cualquier decisión técnica o cambio importante]
```

---

## 🎭 Role-Based Context Loading

### Para desarrollar features de Control de Registro:
```bash
/init + revisar ROLE-PROMPTS.md sección "Control de Registro"
```

### Para desarrollar features de Operaciones:
```bash
/init + revisar ROLE-PROMPTS.md sección "Operaciones"
```

### Para desarrollar features de Laboratorio:
```bash
/init + revisar ROLE-PROMPTS.md sección "Laboratorio"
```

### Para desarrollar Dashboard/Gerencia:
```bash
/init + revisar ROLE-PROMPTS.md sección "Gerencia"
```

---

## 🛠️ Development Context

### Current Tech Decisions:
- **Database**: Usar ENUMs para estados (mejor performance)
- **IDs**: UUID v4 para todas las primary keys
- **Files**: Supabase Storage para fotos y documentos
- **Realtime**: Supabase subscriptions para updates automáticos
- **UI**: Reutilizar componentes existentes de MarketKit

### Current Business Rules:
- **Auto-creation**: Cada referencia crea automáticamente tasks en operations + lab
- **State flow**: pending → in_progress → completed
- **Security**: RLS policies basadas en autenticación
- **Reference numbers**: Formato REF-YYYY-NNN

### Current UX Patterns:
- **Navigation**: Sidebar con áreas específicas
- **Forms**: React Hook Form + Zod validation
- **Tables**: Shadcn DataTable con sorting/filtering
- **Feedback**: Toast notifications para acciones
- **Loading**: Skeleton components durante fetch

---

## 📊 Progress Tracking

### Verificar progreso actual:
```bash
grep -E "✅|🔄|⏳" docs/context-engineering/WORKPLAN.md
```

### Ver next priorities:
```bash
grep -A 5 "🎯 Siguiente" docs/context-engineering/WORKPLAN.md
```

---

## 🚨 Context Validation

### Antes de empezar cualquier desarrollo, verificar:

1. **¿Tengo el contexto completo?**
   - [x] He ejecutado `/init`
   - [x] Revisé el PRD específico de la feature
   - [x] Entiendo el rol de usuario objetivo
   - [x] Conozco los acceptance criteria

2. **¿Entiendo la arquitectura?**
   - [x] Sé qué tablas de BD necesito
   - [x] Conozco los endpoints API requeridos
   - [x] Entiendo el flujo de estados
   - [x] Sé qué componentes UI reutilizar

3. **¿Tengo claridad del objetivo?**
   - [x] Sé exactamente qué pain point resuelvo
   - [x] Entiendo el valor para el usuario
   - [x] Conozco los success criteria
   - [x] Sé cómo se mide el éxito

### Si algo no está claro:
```bash
# Revisar documentación específica
cat docs/context-engineering/[ARCHIVO-RELEVANTE].md
```

---

## 🎯 Success Definition

**Context Engineering es exitoso cuando**:
- Todo el equipo tiene el mismo entendimiento del proyecto
- No hay ambigüedad en requirements o especificaciones
- Cada feature desarrollada está alineada con user needs
- El progreso es trackeable y predecible
- Las decisiones técnicas están documentadas y son consistentes

---

**📍 Recordatorio**: Ejecutar `/init` al inicio de cada sesión de desarrollo para cargar el contexto completo del proyecto Incolab.