// ===== USUARIOS DE PRUEBA (Módulo 3) =====
// Solo para la práctica: en un sistema real las claves nunca se guardan en el frontend.
const usuarios = [
  {
    id: 1,
    nombre: "Administrador del Taller",
    usuario: "admin",
    clave: "Admin2026",
    rol: "Administrador",
    correo: "admin@autoserv.com",
    telefono: "0990000001",
    activo: true
  },
  {
    id: 2,
    nombre: "Carlos Mendoza",
    usuario: "cliente1",
    clave: "Cliente2026",
    rol: "Cliente",
    correo: "carlos@correo.com",
    telefono: "0991111111",
    activo: true
  },
  {
    id: 3,
    nombre: "Ana Torres",
    usuario: "cliente2",
    clave: "Cliente2026",
    rol: "Cliente",
    correo: "ana@correo.com",
    telefono: "0992222222",
    activo: true
  },
  {
    id: 4,
    nombre: "Luis Paredes",
    usuario: "cliente3",
    clave: "Cliente2026",
    rol: "Cliente",
    correo: "luis@correo.com",git add .
    telefono: "0993333333",
    activo: false
  }
];
// ===== ARRAY QUE GUARDA LAS SOLICITUDES =====
const CLAVE_SOLICITUDES = "solicitudes";

// Lee las solicitudes guardadas en el navegador
function cargarSolicitudes() {
  try {
    const guardado = localStorage.getItem(CLAVE_SOLICITUDES);
    return guardado ? JSON.parse(guardado) : [];
  } catch (error) {
    return [];
  }
}

// Guarda el array actual en el navegador
function guardarSolicitudes() {
  localStorage.setItem(CLAVE_SOLICITUDES, JSON.stringify(solicitudes));
}

// Calcula el siguiente identificador sin repetir ninguno
function siguienteId() {
  if (solicitudes.length === 0) {
    return 1;
  }
  const ids = solicitudes.map(function (s) {
    return s.id;
  });
  return Math.max(...ids) + 1;
}

let solicitudes = cargarSolicitudes();

// ===== FORMULARIO DE SOLICITUD DE MANTENIMIENTO =====
const formSolicitud = document.getElementById("formSolicitud");

formSolicitud.addEventListener("submit", function (evento) {
  // Evita que el navegador recargue la página al enviar
  evento.preventDefault();

  // Recoger los checkboxes marcados en un array
  const marcados = document.querySelectorAll('input[name="adicionales"]:checked');
  const adicionales = [];
  marcados.forEach(function (check) {
    adicionales.push(check.value);
  });

  // Crear el objeto de la solicitud
  const solicitud = {
        id: siguienteId(),
    nombre: document.getElementById("nombre").value.trim(),
    telefono: document.getElementById("telefono").value.trim(),
    correo: document.getElementById("correo").value.trim(),
    placa: document.getElementById("placa").value.trim().toUpperCase(),
    marca: document.getElementById("marca").value.trim(),
    modelo: document.getElementById("modelo").value.trim(),
    anio: Number(document.getElementById("anio").value),
    kilometraje: Number(document.getElementById("kilometraje").value),
    servicio: document.getElementById("servicio").value,
    fecha: document.getElementById("fecha").value,
    hora: document.getElementById("hora").value,
    prioridad: document.querySelector('input[name="prioridad"]:checked').value,
    adicionales: adicionales,
    observaciones: document.getElementById("observaciones").value.trim(),
    estado: "Pendiente"
  };

  // Agregar al array
  solicitudes.push(solicitud);
  guardarSolicitudes();

  // Por ahora solo mostramos el resultado en la consola
  console.table(solicitudes);

  formSolicitud.reset();
});
// ===== SESIÓN (Módulo 3) =====
const CLAVE_SESION = "sesionActual";

// Guarda en el navegador el id del usuario que inició sesión
function guardarSesion(usuario) {
  sessionStorage.setItem(CLAVE_SESION, usuario.id);
}

// Devuelve el usuario con sesión iniciada, o null si no hay ninguno
function obtenerSesion() {
  try {
    const id = sessionStorage.getItem(CLAVE_SESION);
    if (!id) {
      return null;
    }
    const encontrado = usuarios.find(function (u) {
      return u.id === Number(id);
    });
    return encontrado || null;
  } catch (error) {
    return null;
  }
}

// Borra la sesión
function cerrarSesion() {
  sessionStorage.removeItem(CLAVE_SESION);
}

// ===== FORMULARIO DE LOGIN =====
const formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const nombreUsuario = document.getElementById("loginUsuario").value.trim();
  const clave = document.getElementById("loginClave").value;

  // 1. Campos vacíos
  if (nombreUsuario === "" || clave === "") {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Ingrese su usuario y su contraseña."
    });
    return;
  }

  // 2. Buscar el usuario con esas credenciales
  const usuarioEncontrado = usuarios.find(function (u) {
    return u.usuario === nombreUsuario && u.clave === clave;
  });

  if (!usuarioEncontrado) {
    Swal.fire({
      icon: "error",
      title: "Acceso inválido",
      text: "Usuario o contraseña incorrectos."
    });
    return;
  }

  // 3. Cuenta deshabilitada
  if (!usuarioEncontrado.activo) {
    Swal.fire({
      icon: "error",
      title: "Cuenta deshabilitada",
      text: "Su cuenta está deshabilitada. Comuníquese con el administrador."
    });
    return;
  }

  // 4. Acceso correcto
  guardarSesion(usuarioEncontrado);
  formLogin.reset();

  Swal.fire({
    icon: "success",
    title: "Bienvenido",
    text: usuarioEncontrado.nombre + " (" + usuarioEncontrado.rol + ")",
    timer: 1800,
    showConfirmButton: false
  });
});