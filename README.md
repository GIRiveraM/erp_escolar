# ERP Escolar - Sistema de Gestión Escolar Completo

Un sistema ERP completo para la gestión escolar que incluye autenticación por roles, pagos en línea, mensajería SMS/WhatsApp, y dashboards personalizados para estudiantes, padres, maestros y administradores.

## 🚀 Características Principales

### 🔐 Sistema de Autenticación
- **Roles múltiples**: Estudiantes, Padres, Maestros, Administradores
- **Autenticación segura** con NextAuth.js
- **Dashboards personalizados** según el rol del usuario

### 💳 Sistema de Pagos
- **Integración con Stripe** para pagos en línea
- **Gestión de mensualidades** con estados (Pendiente, Pagado, Vencido)
- **Historial completo** de pagos
- **Notificaciones automáticas** de pagos pendientes

### 📱 Sistema de Mensajería
- **SMS** integrado con Twilio
- **WhatsApp** para comunicación con padres
- **Plantillas predefinidas** para mensajes comunes
- **Historial de mensajes** enviados

### 📊 Dashboards Especializados
- **Administrador**: Métricas generales, gestión completa
- **Maestro**: Gestión de clases, calificaciones, horarios
- **Estudiante**: Calificaciones, horarios, pagos
- **Padre**: Información de hijos, comunicación, pagos

### 🎓 Gestión Académica
- **Calificaciones** por materia y tipo (Examen, Tarea, Proyecto)
- **Horarios de clases** con días y horarios
- **Gestión de estudiantes** por grado y sección
- **Reportes académicos**

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Base de datos**: PostgreSQL con Prisma ORM
- **Autenticación**: NextAuth.js
- **Pagos**: Stripe
- **Mensajería**: Twilio (SMS/WhatsApp)
- **Deployment**: Vercel (recomendado)

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL
- Cuenta de Stripe (para pagos)
- Cuenta de Twilio (para SMS/WhatsApp)

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/GIRiveraM/erp_escolar
cd erp-escolar
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copia el archivo `env.example` a `.env.local` y configura las variables:

```env
# Base de datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/erp_escolar"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secreto-super-seguro-aqui"

# Stripe para pagos
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Twilio para SMS
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+1234567890"

# Configuración de la escuela
SCHOOL_NAME="Escuela Ejemplo"
SCHOOL_PHONE="+1234567890"
SCHOOL_EMAIL="admin@escuela.com"
```

### 4. Configurar la base de datos
```bash
# Generar el cliente de Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# (Opcional) Abrir Prisma Studio para ver la base de datos
npm run db:studio
```

### 5. Ejecutar el proyecto
```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:3000`

## 📱 Configuración de Servicios Externos

### Stripe (Pagos)
1. Crear cuenta en [Stripe](https://stripe.com)
2. Obtener las claves API desde el dashboard
3. Configurar webhook en Stripe apuntando a `/api/webhooks/stripe`
4. Agregar las claves al archivo `.env.local`

### Twilio (SMS/WhatsApp)
1. Crear cuenta en [Twilio](https://twilio.com)
2. Obtener Account SID y Auth Token
3. Comprar un número de teléfono para SMS
4. Configurar WhatsApp Business API (opcional)
5. Agregar las credenciales al archivo `.env.local`

## 👥 Roles de Usuario

### Administrador
- Acceso completo al sistema
- Gestión de estudiantes, maestros y padres
- Configuración de pagos y mensualidades
- Envío de mensajes masivos
- Reportes y métricas

### Maestro
- Gestión de sus clases asignadas
- Ingreso de calificaciones
- Consulta de horarios
- Comunicación con estudiantes

### Estudiante
- Consulta de calificaciones
- Visualización de horarios
- Estado de pagos
- Información personal

### Padre/Madre
- Información de sus hijos
- Calificaciones de hijos
- Estado de pagos
- Comunicación con la escuela

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Construir para producción
npm run start        # Ejecutar versión de producción

# Base de datos
npm run db:generate  # Generar cliente Prisma
npm run db:push      # Sincronizar esquema con DB
npm run db:migrate   # Ejecutar migraciones
npm run db:studio    # Abrir Prisma Studio

# Linting
npm run lint         # Ejecutar ESLint
```

## 📁 Estructura del Proyecto

```
erp-escolar/
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   ├── auth/              # Páginas de autenticación
│   ├── dashboard/         # Dashboards por rol
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
│   ├── ui/               # Componentes UI base
│   ├── auth/             # Componentes de autenticación
│   └── layout/           # Layouts del dashboard
├── lib/                   # Utilidades y configuraciones
│   ├── auth.ts           # Configuración NextAuth
│   ├── prisma.ts         # Cliente Prisma
│   ├── stripe.ts         # Configuración Stripe
│   └── messaging.ts      # Configuración Twilio
├── prisma/               # Esquema de base de datos
│   └── schema.prisma     # Esquema Prisma
└── types/                # Tipos TypeScript
    └── next-auth.d.ts    # Tipos NextAuth
```

## 🚀 Deployment

### Vercel (Recomendado)
1. Conectar repositorio con Vercel
2. Configurar variables de entorno en Vercel
3. Configurar webhook de Stripe con URL de producción
4. Deploy automático en cada push

### Otras plataformas
El proyecto es compatible con cualquier plataforma que soporte Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Seguridad

- **Autenticación**: NextAuth.js con JWT
- **Autorización**: Middleware por roles
- **Validación**: Zod para validación de datos
- **Encriptación**: bcrypt para contraseñas
- **HTTPS**: Obligatorio en producción

## 📞 Soporte

Para soporte técnico o consultas:
- Crear un issue en el repositorio
- Contactar al equipo de desarrollo
- Revisar la documentación de las APIs externas

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

---

**Desarrollado con ❤️ para mejorar la gestión escolar**



