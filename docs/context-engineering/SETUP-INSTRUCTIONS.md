# 🚀 INSTRUCCIONES DE SETUP - Demo Incolab

## Para ejecutar el demo exitosamente, sigue estos pasos:

### 1. 🌐 Verificar Sistema en Producción
```bash
# URL del sistema: https://incolab.vercel.app
# Base de datos: https://hvndtryxhrkvvlwjwpls.supabase.co
# Estado: ✅ Desplegado y funcionando
```

### 2. 📊 Cargar Datos de Demo
**Opción A: Via API (Recomendado)**
```bash
curl -X POST https://incolab.vercel.app/api/seed-demo
```

**Opción B: SQL Directo**
```bash
# Usando psql con service role key
psql "postgresql://postgres.hvndtryxhrkvvlwjwpls:[SERVICE_ROLE_PASSWORD]@db.hvndtryxhrkvvlwjwpls.supabase.co:5432/postgres" -f supabase/seed.sql
```

**Opción C: Navegador**
- Ir a: https://incolab.vercel.app/api/seed-demo
- Método: POST (usar Postman o similar)

### 3. 🔐 Credenciales de Acceso
```
Usuario: demo@incolab.com
Password: IncolabDemo2025!
```

### 4. 📋 Datos de Demo Cargados
- **6 referencias** con diferentes estados
- **6 operaciones** asignadas a operadores
- **6 análisis de laboratorio** en diferentes fases
- **Clientes reales** del sector minero colombiano

### 5. 🎯 URLs de Navegación del Demo
```
Dashboard: https://incolab.vercel.app/home/dashboard
Referencias: https://incolab.vercel.app/home/references
Operaciones: https://incolab.vercel.app/home/operations
Laboratorio: https://incolab.vercel.app/home/laboratory
```

### 6. ⚡ Reset de Demo (si es necesario)
Si necesitas resetear los datos durante la presentación:
```bash
curl -X POST https://incolab.vercel.app/api/seed-demo
```

### 7. 📱 Backup Plan
Si hay problemas de conectividad:
- Sistema también funciona en: https://nextjs-saas-starter-kit-lite-freddyrs-projects.vercel.app
- Capturas de pantalla disponibles en: `/docs/screenshots/`

## ✅ Checklist Pre-Demo
- [ ] Internet estable (mínimo 10 Mbps)
- [ ] Navegador actualizado (Chrome/Edge recomendado)
- [ ] Datos de demo cargados y verificados
- [ ] URLs principales probadas
- [ ] Script de demo revisado
- [ ] Preguntas frecuentes repasadas

¡Listo para impresionar! 🚀