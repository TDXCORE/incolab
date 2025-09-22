# 🚀 Guía de Configuración de Variables de Entorno - Incolab

## ⚡ Problema Resuelto
El deployment en Vercel falló porque faltaban variables de entorno requeridas. Este archivo te guía para configurarlas correctamente.

## 📋 Lista de Variables Requeridas

### 🔴 CRÍTICAS (Deben ser configuradas antes del deploy)

| Variable | Descripción | Valor de Ejemplo |
|----------|-------------|------------------|
| `NEXT_PUBLIC_SITE_URL` | URL del sitio (HTTPS en producción) | `https://incolab.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública de Supabase | `eyJhbGciOiJIUzI1Ni...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave privada de Supabase | `eyJhbGciOiJIUzI1Ni...` |

### 🟡 CONFIGURACIÓN DE PRODUCTO

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_PRODUCT_NAME` | Nombre del producto | `Incolab` |
| `NEXT_PUBLIC_SITE_TITLE` | Título del sitio | `Incolab - Sistema de Gestión` |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | Descripción del sitio | `Plataforma centralizada...` |

### 🟢 OPCIONALES (Ya configuradas con valores por defecto)

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_DEFAULT_THEME_MODE` | Tema por defecto | `light` |
| `NEXT_PUBLIC_AUTH_PASSWORD` | Habilitar auth con password | `true` |
| `NEXT_PUBLIC_ENABLE_THEME_TOGGLE` | Habilitar cambio de tema | `true` |

## 🔧 Pasos de Configuración

### 1. ✅ Archivo Local Ya Creado
Se ha creado el archivo `.env.local` con todas las variables necesarias.

### 2. 🔑 Configurar Supabase (OBLIGATORIO)

#### A. Crear Proyecto en Supabase
1. Ve a https://supabase.com
2. Crea una cuenta o inicia sesión
3. Haz clic en "New Project"
4. Elige una organización y configura:
   - **Project Name**: `incolab`
   - **Database Password**: Genera una segura
   - **Region**: Elige la más cercana

#### B. Obtener Credenciales
1. Una vez creado el proyecto, ve a **Settings > API**
2. Copia estos valores:
   - **URL**: `https://xxxxxxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIs...`
   - **service_role secret**: `eyJhbGciOiJIUzI1NiIs...`

#### C. Actualizar .env.local
Reemplaza los valores en `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=tu-url-real-aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-real-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-real-aqui
```

### 3. 🌐 Configurar Vercel (PARA DEPLOY)

#### A. Obtener URL de Vercel
1. Una vez que hagas deploy, obtendrás una URL como: `https://incolab-xxx.vercel.app`
2. O si tienes dominio personalizado: `https://tudominio.com`

#### B. Configurar Variables en Vercel
1. Ve a tu proyecto en Vercel Dashboard
2. **Settings > Environment Variables**
3. Añade **TODAS** las variables del archivo `.env.local`
4. **IMPORTANTE**: Cambia `NEXT_PUBLIC_SITE_URL` por tu URL real de Vercel

#### Lista de variables para copiar a Vercel:
```
NEXT_PUBLIC_SITE_URL=https://TU-URL-REAL.vercel.app
NEXT_PUBLIC_PRODUCT_NAME=Incolab
NEXT_PUBLIC_SITE_TITLE=Incolab - Sistema de Gestión de Referencias
NEXT_PUBLIC_SITE_DESCRIPTION=Plataforma centralizada para la gestión de referencias y certificaciones de laboratorio ISO 17025
NEXT_PUBLIC_DEFAULT_THEME_MODE=light
NEXT_PUBLIC_THEME_COLOR=#ffffff
NEXT_PUBLIC_THEME_COLOR_DARK=#0a0a0a
NEXT_PUBLIC_AUTH_PASSWORD=true
NEXT_PUBLIC_AUTH_MAGIC_LINK=false
NEXT_PUBLIC_CAPTCHA_SITE_KEY=
NEXT_PUBLIC_ENABLE_THEME_TOGGLE=true
NEXT_PUBLIC_LANGUAGE_PRIORITY=application
NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_DELETION=true
NEXT_PUBLIC_LOCALES_PATH=apps/web/public/locales
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SUPABASE_URL=TU-URL-DE-SUPABASE
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU-ANON-KEY
SUPABASE_SERVICE_ROLE_KEY=TU-SERVICE-ROLE-KEY
```

## 🚨 Errores Comunes y Soluciones

### Error: "Please provide a valid HTTPS URL"
**Causa**: `NEXT_PUBLIC_SITE_URL` está vacía o usa HTTP en lugar de HTTPS
**Solución**: Configurar con una URL HTTPS válida

### Error: "Supabase client not configured"
**Causa**: Variables de Supabase no están configuradas
**Solución**: Seguir el paso 2 para configurar Supabase

### Error: "Missing environment variables"
**Causa**: Alguna variable requerida falta en Vercel
**Solución**: Verificar que todas las variables estén en Vercel Settings

## 🔒 Seguridad

- ✅ `.env.local` está en `.gitignore` (no se commitea)
- ✅ Variables públicas (`NEXT_PUBLIC_*`) son seguras para el frontend
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` es privada - solo para el servidor
- 🚫 NUNCA commitees archivos `.env` con valores reales

## ✅ Verificación

Para verificar que todo está configurado correctamente:

1. **Local**: Ejecuta `npm run dev` y verifica que no hay errores
2. **Vercel**: Después de configurar las variables, haz un nuevo deploy
3. **Supabase**: Verifica conectividad en el dashboard de tu proyecto

## 🆘 Si Sigues Teniendo Problemas

1. Verifica que todas las variables estén exactamente como se muestran
2. Asegúrate de que la URL de Supabase termine en `.supabase.co`
3. Confirma que las keys de Supabase sean las correctas (empiezan con `eyJ`)
4. Verifica que `NEXT_PUBLIC_SITE_URL` use HTTPS en producción