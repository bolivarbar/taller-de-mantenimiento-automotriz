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
    correo: "luis@correo.com",
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

// ===== FORMULARIO DE SOLICITUD DE MANTENIMIENTO =====
const formSolicitud = document.getElementById("formSolicitud");

// Rellena y bloquea los datos del cliente si quien inició sesión es Cliente
function prellenarFormulario() {
  const sesion = obtenerSesion();
  const inputNombre = document.getElementById("nombre");
  const inputTelefono = document.getElementById("telefono");
  const inputCorreo = document.getElementById("correo");

  if (sesion && sesion.rol === "Cliente") {
    inputNombre.value = sesion.nombre;
    inputTelefono.value = sesion.telefono;
    inputCorreo.value = sesion.correo;
    inputNombre.readOnly = true;
    inputTelefono.readOnly = true;
    inputCorreo.readOnly = true;
  } else {
    inputNombre.value = "";
    inputTelefono.value = "";
    inputCorreo.value = "";
    inputNombre.readOnly = false;
    inputTelefono.readOnly = false;
    inputCorreo.readOnly = false;
  }
}

formSolicitud.addEventListener("submit", function (evento) {
  // Evita que el navegador recargue la página al enviar
  evento.preventDefault();

  // Solo se puede registrar una solicitud con sesión iniciada
  const sesion = obtenerSesion();
  if (!sesion) {
    Swal.fire({
      icon: "warning",
      title: "Sesión requerida",
      text: "Inicie sesión para registrar una solicitud."
    });
    return;
  }

  // Recoger los checkboxes marcados en un array
  const marcados = document.querySelectorAll('input[name="adicionales"]:checked');
  const adicionales = [];
  marcados.forEach(function (check) {
    adicionales.push(check.value);
  });

  // Crear el objeto de la solicitud
  const solicitud = {
    id: siguienteId(),
    usuarioId: sesion.id,
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

  // Agregar al array y guardar en el navegador
  solicitudes.push(solicitud);
  guardarSolicitudes();
  renderizarMisMantenimientos();

  // Por ahora solo mostramos el resultado en la consola
  console.table(solicitudes);

  formSolicitud.reset();
  prellenarFormulario();

  Swal.fire({
    icon: "success",
    title: "Solicitud registrada",
    text: "Su solicitud quedó en estado Pendiente.",
    timer: 1800,
    showConfirmButton: false
  });
});

// El botón "Limpiar" vacía todo; volvemos a rellenar los datos del cliente
formSolicitud.addEventListener("reset", function () {
  setTimeout(prellenarFormulario, 0);
});

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
  actualizarInterfaz();

  Swal.fire({
    icon: "success",
    title: "Bienvenido",
    text: usuarioEncontrado.nombre + " (" + usuarioEncontrado.rol + ")",
    timer: 1800,
    showConfirmButton: false
  });
});

// ===== INTERFAZ SEGÚN LA SESIÓN =====
const seccionLogin = document.getElementById("login");
const seccionSolicitud = document.getElementById("solicitud");
const seccionPerfil = document.getElementById("perfil");
const seccionMantenimientos = document.getElementById("mantenimientos");
const enlaceSolicitud = document.getElementById("enlaceSolicitud");
const enlacePerfil = document.getElementById("enlacePerfil");
const enlaceMantenimientos = document.getElementById("enlaceMantenimientos");
const enlaceLogin = document.getElementById("enlaceLogin");
const seccionAdmin = document.getElementById("administracion");
const enlaceAdmin = document.getElementById("enlaceAdmin");
const tablaAdmin = document.getElementById("tablaAdmin");
const resumenAdmin = document.getElementById("resumenAdmin");

const tablaMantenimientos = document.getElementById("tablaMantenimientos");
const contenedorTabla = document.getElementById("contenedorTabla");
const mensajeSinSolicitudes = document.getElementById("mensajeSinSolicitudes");

// Diccionario: cada estado tiene su color de etiqueta (badge) de Bootstrap
const CLASES_ESTADO = {
  "Pendiente": "bg-warning text-dark",
  "En revisión": "bg-info text-dark",
  "En proceso": "bg-primary",
  "Finalizado": "bg-success",
  "Cancelado": "bg-danger"
};

// Crea una celda <td> con texto
function crearCelda(texto) {
  const td = document.createElement("td");
  td.textContent = texto;
  return td;
}

// Dibuja la tabla con las solicitudes del usuario que inició sesión
function renderizarMisMantenimientos() {
  tablaMantenimientos.innerHTML = "";

  const sesion = obtenerSesion();
  if (!sesion) {
    return;
  }

  // Solo las solicitudes cuyo dueño es el usuario actual
  const propias = solicitudes.filter(function (s) {
    return s.usuarioId === sesion.id;
  });

  if (propias.length === 0) {
    mensajeSinSolicitudes.classList.remove("d-none");
    contenedorTabla.classList.add("d-none");
    return;
  }

  mensajeSinSolicitudes.classList.add("d-none");
  contenedorTabla.classList.remove("d-none");

  propias.forEach(function (s) {
    const fila = document.createElement("tr");

    fila.appendChild(crearCelda(s.id));
    fila.appendChild(crearCelda(s.fecha));
    fila.appendChild(crearCelda(s.hora));
    fila.appendChild(crearCelda(s.placa));
    fila.appendChild(crearCelda(s.marca + " " + s.modelo + " (" + s.anio + ")"));
    fila.appendChild(crearCelda(s.servicio));
    fila.appendChild(crearCelda(s.prioridad));

    const celdaEstado = document.createElement("td");
    const etiqueta = document.createElement("span");
    etiqueta.className = "badge " + (CLASES_ESTADO[s.estado] || "bg-secondary");
    etiqueta.textContent = s.estado;
    celdaEstado.appendChild(etiqueta);
    fila.appendChild(celdaEstado);

    tablaMantenimientos.appendChild(fila);
  });
}
// Dibuja la tabla con TODAS las solicitudes (solo para el Administrador)
function renderizarAdmin() {
  tablaAdmin.innerHTML = "";
  resumenAdmin.innerHTML = "";

  const sesion = obtenerSesion();
  if (!sesion || sesion.rol !== "Administrador") {
    return;
  }

  // Resumen: cuántas solicitudes hay en cada estado
  const conteo = {};
  solicitudes.forEach(function (s) {
    conteo[s.estado] = (conteo[s.estado] || 0) + 1;
  });

  Object.keys(CLASES_ESTADO).forEach(function (estado) {
    const etiqueta = document.createElement("span");
    etiqueta.className = "badge fs-6 " + CLASES_ESTADO[estado];
    etiqueta.textContent = estado + ": " + (conteo[estado] || 0);
    resumenAdmin.appendChild(etiqueta);
  });

  // Sin solicitudes: una fila con aviso
  if (solicitudes.length === 0) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");
    celda.colSpan = 9;
    celda.className = "text-center text-muted";
    celda.textContent = "Todavía no hay solicitudes registradas.";
    fila.appendChild(celda);
    tablaAdmin.appendChild(fila);
    return;
  }

  solicitudes.forEach(function (s) {
    // Buscar al dueño de la solicitud en el array de usuarios
    const dueno = usuarios.find(function (u) {
      return u.id === s.usuarioId;
    });

    const fila = document.createElement("tr");

    fila.appendChild(crearCelda(s.id));
    fila.appendChild(crearCelda(dueno ? dueno.nombre : s.nombre));
    fila.appendChild(crearCelda(s.fecha));
    fila.appendChild(crearCelda(s.hora));
    fila.appendChild(crearCelda(s.placa));
    fila.appendChild(crearCelda(s.marca + " " + s.modelo + " (" + s.anio + ")"));
    fila.appendChild(crearCelda(s.servicio));
    fila.appendChild(crearCelda(s.prioridad));

    const celdaEstado = document.createElement("td");
    const etiqueta = document.createElement("span");
    etiqueta.className = "badge " + (CLASES_ESTADO[s.estado] || "bg-secondary");
    etiqueta.textContent = s.estado;
    celdaEstado.appendChild(etiqueta);
    fila.appendChild(celdaEstado);

    tablaAdmin.appendChild(fila);
  });
}

// Escribe los datos del usuario en la sección Mi perfil
function mostrarPerfil(sesion) {
  document.getElementById("perfilNombre").textContent = sesion.nombre;
  document.getElementById("perfilUsuario").textContent = sesion.usuario;
  document.getElementById("perfilRol").textContent = sesion.rol;
  document.getElementById("perfilCorreo").textContent = sesion.correo;
  document.getElementById("perfilTelefono").textContent = sesion.telefono;
}

function actualizarInterfaz() {
  const sesion = obtenerSesion();

  if (sesion) {
    // Hay sesión: ocultar login, mostrar perfil y solicitud
    seccionLogin.classList.add("d-none");
    seccionPerfil.classList.remove("d-none");
    seccionSolicitud.classList.remove("d-none");
    enlacePerfil.parentElement.classList.remove("d-none");
    enlaceSolicitud.parentElement.classList.remove("d-none");
    enlaceLogin.textContent = "Cerrar sesión (" + sesion.usuario + ")";
    enlaceLogin.setAttribute("href", "#inicio");
    mostrarPerfil(sesion);

    if (sesion.rol === "Administrador") {
      // El administrador ve el panel y no "Mis mantenimientos"
      seccionAdmin.classList.remove("d-none");
      enlaceAdmin.parentElement.classList.remove("d-none");
      seccionMantenimientos.classList.add("d-none");
      enlaceMantenimientos.parentElement.classList.add("d-none");
    } else {
      // El cliente ve "Mis mantenimientos" y no el panel
      seccionMantenimientos.classList.remove("d-none");
      enlaceMantenimientos.parentElement.classList.remove("d-none");
      seccionAdmin.classList.add("d-none");
      enlaceAdmin.parentElement.classList.add("d-none");
    }
  } else {
    // No hay sesión: mostrar login, ocultar todo lo demás
    seccionLogin.classList.remove("d-none");
    seccionPerfil.classList.add("d-none");
    seccionSolicitud.classList.add("d-none");
    seccionMantenimientos.classList.add("d-none");
    seccionAdmin.classList.add("d-none");
    enlacePerfil.parentElement.classList.add("d-none");
    enlaceSolicitud.parentElement.classList.add("d-none");
    enlaceMantenimientos.parentElement.classList.add("d-none");
    enlaceAdmin.parentElement.classList.add("d-none");
    enlaceLogin.textContent = "Iniciar sesión";
    enlaceLogin.setAttribute("href", "#login");
  }

  prellenarFormulario();
  renderizarMisMantenimientos();
  renderizarAdmin();
}

// Clic en el enlace de la barra: si hay sesión, la cierra
enlaceLogin.addEventListener("click", function (evento) {
  if (obtenerSesion()) {
    evento.preventDefault();
    cerrarSesion();
    actualizarInterfaz();
    Swal.fire({
      icon: "info",
      title: "Sesión cerrada",
      timer: 1500,
      showConfirmButton: false
    });
  }
});

// Al cargar la página, ajustar la interfaz según la sesión actual
actualizarInterfaz();