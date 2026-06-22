# Mezanine — Sistema de Gestión de Reservas

Monorepo MERN (MongoDB Atlas + Express + React + Node.js) con diseño minimalista, dashboard administrativo y características avanzadas de MongoDB (capped collection, vistas nativas, triggers a nivel de aplicación).

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React + Vite + TailwindCSS | 19 / 6 / 3.4 |
| Backend | Express + Mongoose + JWT | 4.19 / 8.3 / 9.0 |
| Base de Datos | MongoDB Atlas | — |
| Lenguaje | JavaScript (ESM + CommonJS) | — |

## Estructura del Proyecto

```
SistemaGestionReservas/
├── backend/
│   ├── server.js              # Entry point
│   ├── src/
│   │   ├── app.js             # Configuración Express
│   │   ├── config/db.js       # Conexión MongoDB + capped collection + vista
│   │   ├── middleware/authMiddleware.js
│   │   ├── models/            # Mongoose: Usuario, Cliente, Reserva, Menu, Resena, AuditoriaLog, Campana
│   │   ├── controllers/       # Lógica de negocio por recurso
│   │   └── routes/            # auth, usuario, menu, reserva, dashboard, cliente, resena, campana
│   └── scripts/seed.js        # Población inicial de datos de prueba
├── frontend/
│   ├── src/
│   │   ├── pages/             # LandingPage, LoginPage, DashboardPage
│   │   ├── components/        # auth, layout, landing, dashboard (subcarpetas)
│   │   └── services/api.js    # Axios instance con interceptors JWT
│   └── vite.config.js
└── README.md
```

## Funcionalidades Especiales (MongoDB)

- **Capped Collection `auditoria_logs`**: 1 MB, máximo 1000 documentos, TTL de 30 días
- **Vista Nativa `v_reservas_hoy`**: Creada automáticamente en `db.js`, filtra reservas confirmadas del día actual
- **Trigger post-save (Reserva)**: Incrementa `total_reservas_historicas` del cliente y registra en auditoría
- **Trigger post-findOneAndUpdate (Reserva)**: Log automático al cambiar estado (confirmar/cancelar)
- **Agregación de Ocupación**: Pipeline con `$match`, `$group`, `$sum` por franja horaria

## API Endpoints

### Públicos
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/menu` | Obtener platos del menú |
| POST | `/api/reservas` | Crear reserva |
| GET | `/api/resenas` | Obtener reseñas aprobadas |
| GET | `/health` | Health check |

### Protegidos (JWT)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/dashboard/reservas-hoy` | Vista nativa de reservas del día |
| GET | `/api/dashboard/reservas?fecha=` | Reservas por fecha |
| GET | `/api/dashboard/ocupacion-por-hora?fecha=` | Ocupación agregada por hora |
| GET | `/api/dashboard/actividad` | Feed de auditoría (últimos 20) |
| GET/POST/PUT/DELETE | `/api/menu/:id` | CRUD de menú |
| PATCH | `/api/reservas/:id` | Actualizar estado de reserva |
| GET/POST | `/api/clientes` | Listar / crear clientes |
| POST/DELETE | `/api/clientes/:id/notas` | Notas por cliente |
| GET/POST | `/api/campanas` | Campañas de fidelización |
| GET/POST/DELETE/PATCH | `/api/usuarios/:id/password` | CRUD de usuarios staff (solo admin) |

## Requisitos e Instalación

### 1. Variables de Entorno

**Backend** (`backend/.env`):
```env
PORT=5000
MONGO_URI=tu_connection_string_de_mongodb_atlas
JWT_SECRET=un_secreto_largo_y_aleatorio
JWT_EXPIRES_IN=8h
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
```

### 2. Instalación de Dependencias

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Poblar Base de Datos (Seed)

```bash
cd backend
npm run seed
```

Inserta 2 usuarios, 8 platos, 4 clientes, 6 reservas (con fechas dinámicas) y 3 reseñas.

### 4. Iniciar Servidores de Desarrollo

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd backend && npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend && npm run dev
```

## Credenciales de Acceso

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| `admin` | `admin123` | admin (acceso completo) |
| `staff01` | `staff123` | staff (sin gestión de usuarios) |

Ruta: `/login` → redirige a `/dashboard`.

## Colecciones MongoDB

| Colección | Tipo |
|-----------|------|
| `usuarios` | Documento |
| `clientes` | Documento |
| `reservas` | Documento |
| `menu` | Documento |
| `resenas` | Documento |
| `campanas` | Documento |
| `auditoria_logs` | **Capped** (1 MB, max 1000 docs, TTL 30d) |
| `v_reservas_hoy` | **Vista** (sobre `reservas`) |

## Scripts Disponibles

### Backend
| Comando | Descripción |
|---------|-------------|
| `npm start` | `node server.js` |
| `npm run dev` | `nodemon server.js` |
| `npm run seed` | `node scripts/seed.js` |

### Frontend
| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo Vite |
| `npm run build` | Build producción |
| `npm run preview` | Previsualizar build |
| `npm run lint` | ESLint |
