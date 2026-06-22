const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const Usuario = require('../src/models/Usuario');
const Cliente = require('../src/models/Cliente');
const Reserva = require('../src/models/Reserva');
const Menu = require('../src/models/Menu');
const Resena = require('../src/models/Resena');
const AuditoriaLog = require('../src/models/AuditoriaLog');

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.error('Error: La variable de entorno MONGO_URI no está definida.');
      process.exit(1);
    }

    console.log('Conectando a MongoDB para poblar datos...');
    await mongoose.connect(mongoURI);
    console.log('Conexión establecida.');

    // 1. Limpiar todas las colecciones
    console.log('Limpiando colecciones anteriores...');
    await Usuario.deleteMany({});
    await Cliente.deleteMany({});
    await Reserva.deleteMany({});
    await Menu.deleteMany({});
    await Resena.deleteMany({});
    
    try {
      await mongoose.connection.db.dropCollection('auditoria_logs');
      console.log('Colección "auditoria_logs" vaciada (drop).');
    } catch (e) {
      // Si no existe, no pasa nada
    }
    // Recrear capped collection
    await mongoose.connection.db.createCollection('auditoria_logs', {
      capped: true,
      size: 1048576,
      max: 1000
    });
    console.log('Capped Collection "auditoria_logs" recreada.');

    // 2. Insertar Usuarios Administrativos (Contraseñas hasheadas y campos nuevos)
    console.log('Insertando usuarios de staff...');
    const salt = await bcrypt.genSalt(10);
    const passAdmin = await bcrypt.hash('admin123', salt);
    const passStaff = await bcrypt.hash('staff123', salt);

    const usuarios = await Usuario.insertMany([
      { 
        nombre_completo: 'Administrador Principal',
        email: 'admin@mezanine.pe',
        username: 'admin', 
        password_hash: passAdmin, 
        rol: 'admin' 
      },
      { 
        nombre_completo: 'Carlos D. (Staff)',
        email: 'carlos.d@mezanine.pe',
        username: 'staff01', 
        password_hash: passStaff, 
        rol: 'staff' 
      }
    ]);
    console.log(`Se insertaron ${usuarios.length} usuarios.`);

    // 3. Insertar Platos en el Menú
    console.log('Insertando platos del menú...');
    const platosMenu = await Menu.insertMany([
      // Entradas
      {
        nombre_plato: 'Ceviche de Pescado Clásico',
        descripcion: 'Cortes frescos de pesca del día marinados en jugo de limón de Piura, ají limo, cebolla morada y cilantro. Acompañado de camote glaseado y choclo desgranado.',
        precio: 48.00,
        categoria: 'entradas',
        disponible: true
      },
      {
        nombre_plato: 'Causa Rellena de Cangrejo',
        descripcion: 'Fina masa de papa amarilla sazonada con ají amarillo y limón, rellena de pulpa de cangrejo y palta fuerte, decorada con salsa golf.',
        precio: 38.00,
        categoria: 'entradas',
        disponible: true
      },
      // Fondos
      {
        nombre_plato: 'Lomo Saltado Mezanine',
        descripcion: 'Jugosos trozos de lomo fino salteados al wok con cebolla, tomate, ají amarillo y cebolla china. Acompañado de papas amarillas fritas y arroz con choclo.',
        precio: 72.00,
        categoria: 'fondos',
        disponible: true
      },
      {
        nombre_plato: 'Risotto de Hongos y Aceite de Trufa',
        descripcion: 'Arroz cremoso cocinado con variedad de hongos andinos, vino blanco, queso parmesano y un toque sutil de aceite de trufa blanca.',
        precio: 59.00,
        categoria: 'fondos',
        disponible: true
      },
      // Bebidas
      {
        nombre_plato: 'Chicha Morada de la Casa',
        descripcion: 'Bebida tradicional elaborada con maíz morado hervido con piña, manzana, canela y clavo de olor, endulzada al gusto.',
        precio: 12.00,
        categoria: 'bebidas',
        disponible: true
      },
      {
        nombre_plato: 'Pisco Sour Clásico',
        descripcion: 'Nuestro trago bandera elaborado con Pisco Quebranta premium, jarabe de goma, jugo de limón, clara de huevo y gotas de amargo de angostura.',
        precio: 28.00,
        categoria: 'bebidas',
        disponible: true
      },
      // Postres
      {
        nombre_plato: 'Volcán de Chocolate de Cusco',
        descripcion: 'Bizcocho tibio elaborado con cacao cusqueño al 70% con centro líquido. Acompañado de una bola de helado artesanal de vainilla de Oxapampa.',
        precio: 25.00,
        categoria: 'postres',
        disponible: true
      },
      {
        nombre_plato: 'Suspiro a la Limeña Clásico',
        descripcion: 'Tradicional dulce de leche condensada y evaporada cubierto con un merengue italiano perfumado al vino oporto y espolvoreado con canela.',
        precio: 18.00,
        categoria: 'postres',
        disponible: true
      }
    ]);
    console.log(`Se insertaron ${platosMenu.length} platos en el menú.`);

    // 4. Insertar Clientes
    console.log('Insertando clientes...');
    const clientes = await Cliente.insertMany([
      {
        nombre_completo: 'Gianfranco R.',
        email: 'gianfranco.r@correo.com',
        telefono: '+51 987 654 321',
        preferencias: ['Mesa cerca de la ventana', 'Ceviche'],
        total_reservas_historicas: 0
      },
      {
        nombre_completo: 'María Belén Gómez',
        email: 'maria.gomez@correo.com',
        telefono: '+51 991 234 567',
        preferencias: ['Vegetariano', 'Pisco Sour'],
        total_reservas_historicas: 0
      },
      {
        nombre_completo: 'Carlos Díaz',
        email: 'carlos.diaz@correo.com',
        telefono: '+51 945 876 123',
        preferencias: ['Exterior/Terraza'],
        total_reservas_historicas: 0
      },
      {
        nombre_completo: 'Sofía Álvarez',
        email: 'sofia.alvarez@correo.com',
        telefono: '+51 963 852 741',
        preferencias: ['Mesa tranquila, lejos de la cocina', 'Postres'],
        total_reservas_historicas: 0
      }
    ]);
    console.log(`Se insertaron ${clientes.length} clientes.`);

    // 5. Calcular fechas dinámicas para pruebas
    const hoy = new Date();
    const hoyUTC = new Date(Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0, 0));
    
    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);
    const mañanaUTC = new Date(Date.UTC(mañana.getFullYear(), mañana.getMonth(), mañana.getDate(), 0, 0, 0, 0));

    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    const ayerUTC = new Date(Date.UTC(ayer.getFullYear(), ayer.getMonth(), ayer.getDate(), 0, 0, 0, 0));

    // 6. Insertar Reservas
    console.log('Insertando reservas...');
    
    const reservasData = [
      {
        cliente_id: clientes[0]._id,
        fecha_reserva: hoyUTC,
        hora_reserva: '20:30',
        cantidad_personas: 4,
        estado: 'confirmada',
        datos_contacto: { nombre: clientes[0].nombre_completo, telefono: clientes[0].telefono }
      },
      {
        cliente_id: clientes[1]._id,
        fecha_reserva: hoyUTC,
        hora_reserva: '21:00',
        cantidad_personas: 2,
        estado: 'confirmada',
        datos_contacto: { nombre: clientes[1].nombre_completo, telefono: clientes[1].telefono }
      },
      {
        cliente_id: clientes[2]._id,
        fecha_reserva: hoyUTC,
        hora_reserva: '19:30',
        cantidad_personas: 3,
        estado: 'pendiente',
        datos_contacto: { nombre: clientes[2].nombre_completo, telefono: clientes[2].telefono }
      },
      {
        cliente_id: clientes[3]._id,
        fecha_reserva: mañanaUTC,
        hora_reserva: '20:00',
        cantidad_personas: 5,
        estado: 'confirmada',
        datos_contacto: { nombre: clientes[3].nombre_completo, telefono: clientes[3].telefono }
      },
      {
        cliente_id: clientes[0]._id,
        fecha_reserva: mañanaUTC,
        hora_reserva: '21:30',
        cantidad_personas: 2,
        estado: 'pendiente',
        datos_contacto: { nombre: clientes[0].nombre_completo, telefono: clientes[0].telefono }
      },
      {
        cliente_id: clientes[1]._id,
        fecha_reserva: ayerUTC,
        hora_reserva: '13:00',
        cantidad_personas: 6,
        estado: 'cancelada',
        datos_contacto: { nombre: clientes[1].nombre_completo, telefono: clientes[1].telefono }
      }
    ];

    for (const resData of reservasData) {
      const res = new Reserva(resData);
      await res.save();
    }
    console.log(`Se guardaron ${reservasData.length} reservas individuales.`);

    // 7. Insertar Reseñas Aprobadas
    console.log('Insertando reseñas...');
    await Resena.insertMany([
      {
        cliente_id: clientes[0]._id,
        calificacion: 5,
        comentario: 'La comida es excelente y el ceviche es espectacular. La atención por parte del personal fue impecable y muy profesional.',
        fecha: ayerUTC,
        estado: 'aprobada'
      },
      {
        cliente_id: clientes[1]._id,
        calificacion: 4,
        comentario: 'Muy buen risotto de hongos andinos. El ambiente es agradable, elegante y sobrio. Volveré sin dudas.',
        fecha: hoyUTC,
        estado: 'aprobada'
      },
      {
        cliente_id: clientes[2]._id,
        calificacion: 5,
        comentario: 'Excelente servicio. Reservar fue súper fácil desde la web y nos atendieron a la hora exacta.',
        fecha: mañanaUTC,
        estado: 'aprobada'
      }
    ]);
    console.log('Reseñas insertadas con éxito.');

    console.log('Población de datos de semilla finalizada con éxito.');
    await mongoose.connection.close();
    console.log('Conexión a MongoDB cerrada.');
    process.exit(0);
  } catch (err) {
    console.error('Error durante la inserción de semillas:', err.message);
    process.exit(1);
  }
};

seedData();
