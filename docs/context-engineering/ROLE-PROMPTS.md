# 👥 ROLE PROMPTS - Sistema Incolab
## Prompts Específicos por Rol y Responsabilidad

**Proyecto**: Sistema de Gestión de Referencias Incolab
**Propósito**: Definir comportamientos y responsabilidades específicas por rol
**Uso**: Guía para implementación de features y UX por usuario

---

## 🎭 Definición de Roles

### 👩‍💼 Control de Registro (Coordinadora - María)
**Responsabilidad Principal**: Recibir servicios y coordinar todas las áreas
**Context**: Usuario central que inicia todo el proceso

#### 🎯 Prompt para Features de Control de Registro
```
CONTEXT: Eres el desarrollador implementando features para Control de Registro en Incolab.

USUARIO: María - Coordinadora que recibe servicios de clientes y debe distribuir trabajo a operaciones y laboratorio.

PAIN POINTS:
- "Todo es Excel y correo... un desastre"
- Pierde tiempo coordinando manualmente entre áreas
- No tiene visibilidad del estado en tiempo real
- Consolida información manualmente para certificados

OBJETIVOS:
- Crear referencias rápido y sin errores
- Tener visibilidad total del estado de servicios
- Eliminar coordinación manual via correos
- Generar certificados automáticamente

FEATURES A IMPLEMENTAR:
1. Formulario de creación de referencias intuitivo
2. Dashboard con estado consolidado de todos los servicios
3. Vista de detalle con timeline completo
4. Generación automática de certificados
5. Notificaciones cuando servicios están listos

UX REQUIREMENTS:
- Proceso de creación debe ser < 2 minutos
- Dashboard debe mostrar estado en tiempo real
- Interfaz simple, sin opciones técnicas complejas
- Feedback visual claro del progreso
- Acceso rápido a certificados generados

TECHNICAL REQUIREMENTS:
- CRUD completo para referencias
- Integración con dashboard metrics
- Realtime updates via Supabase
- PDF generation para certificados
- Formularios con validación robusta
```

### 👷‍♂️ Operaciones (Técnico - Carlos)
**Responsabilidad Principal**: Ejecutar muestreos y tareas operativas

#### 🎯 Prompt para Features de Operaciones
```
CONTEXT: Eres el desarrollador implementando features para el área de Operaciones en Incolab.

USUARIO: Carlos - Técnico de campo que ejecuta muestreos y operaciones físicas.

PAIN POINTS:
- "No sé qué tengo pendiente hasta que me llaman"
- Recibe instrucciones por correo de forma desordenada
- No puede reportar estado de avance fácilmente
- Información dispersa en múltiples correos

OBJETIVOS:
- Ver claramente qué tareas tiene asignadas
- Actualizar estado de operaciones fácilmente
- Recibir instrucciones claras y organizadas
- Reportar problemas o notas importantes

FEATURES A IMPLEMENTAR:
1. Vista específica /operations con tareas asignadas
2. Lista filtrable por estado y fecha
3. Formulario simple para actualizar estados
4. Campo de notas para observaciones
5. Indicadores visuales de prioridad

UX REQUIREMENTS:
- Lista clara de "Mis tareas pendientes"
- Estados simples: Pendiente → En Proceso → Completado
- Formulario de actualización en un solo paso
- Interfaz optimizada para mobile/tablet (campo)
- Confirmaciones visuales de cambios guardados

TECHNICAL REQUIREMENTS:
- Vista filtrada por user_id del técnico
- Updates optimistas para mejor UX
- Sync con realtime para coordinación
- Validaciones de estado (no retroceder)
- Logs de cambios para auditoría
```

### 🔬 Laboratorio (Analista - Ana)
**Responsabilidad Principal**: Ejecutar análisis y cargar resultados

#### 🎯 Prompt para Features de Laboratorio
```
CONTEXT: Eres el desarrollador implementando features para el área de Laboratorio en Incolab.

USUARIO: Ana - Analista que ejecuta análisis químicos y físicos de muestras.

PAIN POINTS:
- "Siempre estoy preguntando qué análisis hay pendientes"
- No sabe cuándo llegan muestras de operaciones
- Carga resultados en Excel separado
- Falta coordinación con timing de certificados

OBJETIVOS:
- Ver análisis pendientes automáticamente
- Cargar resultados de forma estructurada
- Saber cuándo operaciones completó muestreo
- Indicar cuándo análisis está listo para certificado

FEATURES A IMPLEMENTAR:
1. Vista específica /laboratory con análisis asignados
2. Indicador de cuándo muestra está lista (operaciones completó)
3. Formulario estructurado para cargar resultados
4. Diferentes tipos de análisis con campos específicos
5. Estado de "Análisis Completado" para notificar a control

UX REQUIREMENTS:
- Separación clara: Esperando Muestra vs Lista para Analizar
- Formularios específicos por tipo de análisis
- Campos numéricos con validaciones (rangos esperados)
- Upload de archivos para gráficos/reportes detallados
- Confirmación visual cuando análisis se marca completo

TECHNICAL REQUIREMENTS:
- Vista dependiente del estado de operations
- JSONB para resultados flexibles por tipo de análisis
- File upload integration con Supabase Storage
- Validaciones específicas por tipo de servicio
- Triggers para notificar a control cuando está listo
```

### 👔 Gerencia (Supervisor - Roberto)
**Responsabilidad Principal**: Supervisión y métricas del proceso

#### 🎯 Prompt para Features de Gerencia
```
CONTEXT: Eres el desarrollador implementando features para Gerencia en Incolab.

USUARIO: Roberto - Gerente que necesita supervisar y tomar decisiones basadas en métricas.

PAIN POINTS:
- "No tengo visibilidad del estado de los servicios"
- No puede medir eficiencia del proceso actual
- Falta información para detectar cuellos de botella
- No hay métricas para mostrar a clientes

OBJETIVOS:
- Dashboard ejecutivo con KPIs principales
- Visibilidad de cuellos de botella en el proceso
- Métricas de tiempo por etapa del servicio
- Información para reportar a clientes/directivos

FEATURES A IMPLEMENTAR:
1. Dashboard ejecutivo con métricas consolidadas
2. Gráficos de tiempo promedio por etapa
3. Análisis de cuellos de botella
4. Vista de servicios retrasados o problemáticos
5. Reportes exportables para presentaciones

UX REQUIREMENTS:
- Dashboard tipo "executive summary"
- Gráficos visuales claros (charts con Recharts)
- Filtros por período de tiempo
- Drill-down desde métricas a detalles específicos
- Exportación de reportes en PDF

TECHNICAL REQUIREMENTS:
- Queries agregadas optimizadas
- Cálculos de métricas en tiempo real
- Charts con data actualizada automáticamente
- Filtros eficientes por fecha/período
- Export functionality para reportes
```

---

## 🔄 Prompts para Funcionalidades Transversales

### 🔧 Prompt para Real-time Features
```
CONTEXT: Implementando funcionalidades de tiempo real para todo el sistema Incolab.

OBJETIVO: Eliminar necesidad de recargar páginas o preguntar por estados.

REQUIREMENTS:
- Cuando operaciones actualiza → laboratorio ve cambio inmediato
- Cuando laboratorio completa → control ve certificado listo
- Dashboard de gerencia actualiza métricas automáticamente
- Notificaciones visuales sutiles (no intrusivas)

TECHNICAL APPROACH:
- Supabase Realtime subscriptions por tabla
- React Query invalidation para cache updates
- Toast notifications para cambios importantes
- Optimistic updates para mejor UX

UX APPROACH:
- Indicadores visuales de "actualización disponible"
- Animaciones sutiles para cambios de estado
- Badges de notificación en navegación
- No interrumpir trabajo del usuario
```

### 📊 Prompt para Dashboard & Analytics
```
CONTEXT: Implementando dashboards y analytics para diferentes roles en Incolab.

MULTI-ROLE REQUIREMENTS:
- Control: Estado actual de todos los servicios
- Operaciones: Mis tareas y workload
- Laboratorio: Cola de análisis y resultados
- Gerencia: KPIs y métricas de proceso

SHARED COMPONENTS:
- Cards con métricas numéricas
- Charts para tendencias temporales
- Tables con filtros avanzados
- Export functionality

TECHNICAL APPROACH:
- Recharts para visualizaciones
- Shared chart components en packages/ui
- Optimized queries para agregaciones
- Caching strategy para performance
```

---

## 🎨 Design System Prompts

### 🎨 Prompt para UI Consistency
```
CONTEXT: Manteniendo consistencia visual across all user roles en Incolab.

DESIGN PRINCIPLES:
- Simplicidad: Interfaces limpias, sin complejidad innecesaria
- Consistencia: Mismos patterns de navegación y interacción
- Feedback: Siempre confirmar acciones del usuario
- Accesibilidad: Usable en desktop y mobile

COMPONENT STRATEGY:
- Reutilizar componentes existentes de MarketKit
- Extender Shadcn UI components cuando sea necesario
- Consistent spacing con Tailwind
- Same color scheme para todos los roles

ROLE-SPECIFIC COLORS:
- Control de Registro: Blue (primary)
- Operaciones: Green (operations)
- Laboratorio: Purple (analysis)
- Gerencia: Gray (executive)
```

---

## 🔄 Workflow Integration Prompts

### 🔄 Prompt para Estado Management
```
CONTEXT: Coordinando estados entre diferentes roles en Incolab.

WORKFLOW:
1. Control crea referencia → auto-crea tasks en operations + lab
2. Operations actualiza estado → laboratorio ve update
3. Lab completa análisis → control puede generar certificado
4. Gerencia ve métricas actualizadas en tiempo real

STATE COORDINATION:
- Referencias tienen estado master
- Operations y Lab tienen estados específicos
- Dashboard agrega todos los estados
- Realtime sync mantiene coherencia

TECHNICAL IMPLEMENTATION:
- Database triggers para auto-creation
- RLS policies por rol
- Supabase Realtime para sync
- React Query para cache management
```

---

## ✅ Validation Prompts

### ✅ Prompt para Testing & Validation
```
CONTEXT: Validando que cada rol puede cumplir sus objetivos en Incolab.

TESTING SCENARIOS POR ROL:

Control de Registro:
- ✅ Puede crear referencia en < 2 minutos
- ✅ Ve estado actualizado automáticamente
- ✅ Genera certificado sin errores

Operaciones:
- ✅ Ve sus tareas asignadas inmediatamente
- ✅ Puede actualizar estado fácilmente
- ✅ Cambios se reflejan en otras áreas

Laboratorio:
- ✅ Sabe cuándo muestras están listas
- ✅ Puede cargar resultados estructuradamente
- ✅ Notifica completion automáticamente

Gerencia:
- ✅ Dashboard muestra métricas correctas
- ✅ Puede identificar cuellos de botella
- ✅ Exporta reportes exitosamente

ACCEPTANCE CRITERIA:
- User journey completo sin errores
- Todos los roles pueden completar sus tareas
- Performance < 2 segundos para acciones críticas
- No data loss en actualizaciones concurrentes
```

---

**📍 Uso de estos Prompts**: Cada desarrollador debe revisar el prompt específico del rol antes de implementar features relacionadas. Esto asegura que la implementación esté alineada con las necesidades reales del usuario final.