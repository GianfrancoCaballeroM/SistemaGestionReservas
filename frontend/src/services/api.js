import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api` 
    : 'http://localhost:5000/api',
});

// Interceptor para inyectar automáticamente el token JWT en las cabeceras
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para manejar errores comunes de autenticación
API.interceptors.response.use((response) => response, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

const apiService = {
  // Autenticación
  login: async (username, password) => {
    const response = await API.post('/auth/login', { username, password });
    return response.data;
  },

  // Menú (Público)
  obtenerMenu: async () => {
    const response = await API.get('/menu');
    return response.data;
  },

  // Reservas (Público / Privado)
  crearReserva: async (datos) => {
    const response = await API.post('/reservas', datos);
    return response.data;
  },
  actualizarEstadoReserva: async (id, estado) => {
    const response = await API.patch(`/reservas/${id}`, { estado });
    return response.data;
  },

  // Reseñas (Público)
  obtenerResenas: async () => {
    const response = await API.get('/resenas');
    return response.data;
  },

  // Dashboard (Privado - requiere JWT)
  obtenerReservasHoy: async () => {
    const response = await API.get('/dashboard/reservas-hoy');
    return response.data;
  },
  obtenerTodasReservas: async (fecha) => {
    const response = await API.get(`/dashboard/reservas?fecha=${fecha}`);
    return response.data;
  },
  obtenerOcupacionPorHora: async (fecha) => {
    const response = await API.get(`/dashboard/ocupacion-por-hora?fecha=${fecha}`);
    return response.data;
  },
  obtenerActividad: async () => {
    const response = await API.get('/dashboard/actividad');
    return response.data;
  },

  // CRM Clientes (Privado - requiere JWT)
  obtenerClientes: async () => {
    const response = await API.get('/clientes');
    return response.data;
  },
  agregarNotaCliente: async (id, comentario) => {
    const response = await API.post(`/clientes/${id}/notas`, { comentario });
    return response.data;
  },
  eliminarNotaCliente: async (id, notaId) => {
    const response = await API.delete(`/clientes/${id}/notas/${notaId}`);
    return response.data;
  },

  // Campañas de fidelización (NUEVO)
  obtenerCampanas: async () => {
    const response = await API.get('/campanas');
    return response.data;
  },
  crearCampana: async (datos) => {
    const response = await API.post('/campanas', datos);
    return response.data;
  },

  // Gestión de Usuarios Staff (Privado - requiere JWT)
  obtenerUsuarios: async () => {
    const response = await API.get('/usuarios');
    return response.data;
  },
  crearUsuario: async (nombre_completo, email, username, password, rol) => {
    const response = await API.post('/usuarios', { nombre_completo, email, username, password, rol });
    return response.data;
  },
  eliminarUsuario: async (id) => {
    const response = await API.delete(`/usuarios/${id}`);
    return response.data;
  },
  cambiarPassword: async (id, newPassword) => {
    const response = await API.patch(`/usuarios/${id}/password`, { newPassword });
    return response.data;
  }
};

export default apiService;
