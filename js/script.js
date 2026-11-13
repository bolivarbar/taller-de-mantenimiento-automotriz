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

// ===== MODO EDICIÓN =====
let idEnEdicion = null;
const botonEnviar = document.getElementById("botonEnviar");
const botonCancelarEdicion = document.getElementById("botonCancelarEdicion");
const avisoEdicion = document.getElementById("avisoEdicion");

function salirModoEdicion() {
  idEnEdicion = null;
  botonEnviar.textContent = "Enviar solicitud";
  botonCancelarEdicion.classList.add("d-none");
  avisoEdicion.classList.add("d-none");
}

// Carga una solicitud en el formulario para modificarla (solo Administrador)
function editarSolicitud(id) {
  const sesion = obtenerSesion();

  if (!sesion || sesion.rol !== "Administrador") {
    Swal.fire({
      icon: "error",
      title: "Acceso denegado",
      text: "Solo el administrador puede editar solicitudes."
    });
    return;
  }

  const s = solicitudes.find(function (item) {
    return item.id === id;
  });

  if (!s) {
    return;
  }

  idEnEdicion = id;

  document.getElementById("nombre").value = s.nombre;
  document.getElementById("telefono").value = s.telefono;
  document.getElementById("correo").value = s.correo;
  document.getElementById("placa").value = s.placa;
  document.getElementById("marca").value = s.marca;
  document.getElementById("modelo").value = s.modelo;
  document.getElementById("anio").value = s.anio;
  document.getElementById("kilometraje").value = s.kilometraje;
  document.getElementById("servicio").value = s.servicio;
  document.getElementById("fecha").value = s.fecha;
  document.getElementById("hora").value = s.hora;
  document.getElementById("observaciones").value = s.observaciones;
  document.querySelector('input[name="prioridad"][value="' + s.prioridad + '"]').checked = true;

  document.querySelectorAll('input[name="adicionales"]').forEach(function (check) {
    check.checked = s.adicionales.includes(check.value);
  });

  botonEnviar.textContent = "Guardar cambios";
  botonCancelarEdicion.classList.remove("d-none");
  avisoEdicion.textContent = "Editando la solicitud N.º " + id + ". Modifique los datos y pulse \"Guardar cambios\".";
  avisoEdicion.classList.remove("d-none");

  document.getElementById("solicitud").scrollIntoView({ behavior: "smooth" });
}

botonCancelarEdicion.addEventListener("click", function () {
  formSolicitud.reset();
});

formSolicitud.addEventListener("submit", function (evento) {
  // Evita que el navegador recargue la página al enviar
  evento.preventDefault();

  // Solo se puede registrar o editar con sesión iniciada
  const sesion = obtenerSesion();
  if (!sesion) {
    Swal.fire({
      icon: "warning",
      title: "Sesión requerida",
      text: "Inicie sesión para registrar una solicitud."
    });
    return;
  }

  const eraEdicion = idEnEdicion !== null;

  // Solo el administrador puede modificar un registro existente
  if (eraEdicion && sesion.rol !== "Administrador") {
    Swal.fire({
      icon: "error",
      title: "Acceso denegado",
      text: "Solo el administrador puede editar solicitudes."
    });
    return;
  }

  // Recoger los checkboxes marcados en un array
  const marcados = document.querySelectorAll('input[name="adicionales"]:checked');
  const adicionales = [];
  marcados.forEach(function (check) {
    adicionales.push(check.value);
  });

  // Crear el objeto con los datos del formulario
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

  if (eraEdicion) {
    // Actualizar: se conservan el id, el dueño y el estado originales
    const indice = solicitudes.findIndex(function (s) {
      return s.id === idEnEdicion;
    });

    if (indice === -1) {
      Swal.fire({
        icon: "error",
        title: "Solicitud no encontrada",
        text: "La solicitud que intenta editar ya no existe."
      });
      salirModoEdicion();
      return;
    }

    solicitud.id = solicitudes[indice].id;
    solicitud.usuarioId = solicitudes[indice].usuarioId;
    solicitud.estado = solicitudes[indice].estado;
    solicitudes[indice] = solicitud;
  } else {
    // Crear: se agrega un registro nuevo
    solicitudes.push(solicitud);
  }

  guardarSolicitudes();
  renderizarMisMantenimientos();
  renderizarAdmin();

  formSolicitud.reset();

  Swal.fire({
    icon: "success",
    title: eraEdicion ? "Solicitud actualizada" : "Solicitud registrada",
    text: eraEdicion
      ? "Los cambios se guardaron correctamente."
      : "Su solicitud quedó en estado Pendiente.",
    timer: 1800,
    showConfirmButton: false
  });
});

// El botón "Limpiar" vacía todo, sale del modo edición y rellena los datos del cliente
formSolicitud.addEventListener("reset", function () {
  salirModoEdicion();
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
// Cambia el estado de una solicitud (solo el Administrador puede hacerlo)
function cambiarEstado(id, nuevoEstado) {
  const sesion = obtenerSesion();

  if (!sesion || sesion.rol !== "Administrador") {
    Swal.fire({
      icon: "error",
      title: "Acceso denegado",
      text: "Solo el administrador puede cambiar el estado."
    });
    return;
  }

  const solicitud = solicitudes.find(function (s) {
    return s.id === id;
  });

  if (!solicitud) {
    return;
  }

  solicitud.estado = nuevoEstado;
  guardarSolicitudes();
  renderizarAdmin();
  renderizarMisMantenimientos();

  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: "Estado actualizado a " + nuevoEstado,
    showConfirmButton: false,
    timer: 1800
  });
}
// Elimina una solicitud, pidiendo confirmación (solo el Administrador)
function eliminarSolicitud(id) {
  const sesion = obtenerSesion();

  if (!sesion || sesion.rol !== "Administrador") {
    Swal.fire({
      icon: "error",
      title: "Acceso denegado",
      text: "Solo el administrador puede eliminar solicitudes."
    });
    return;
  }

  Swal.fire({
    icon: "warning",
    title: "¿Eliminar la solicitud N.º " + id + "?",
    text: "Esta acción no se puede deshacer.",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc3545"
  }).then(function (resultado) {
    if (resultado.isConfirmed) {
      solicitudes = solicitudes.filter(function (s) {
        return s.id !== id;
      });
      guardarSolicitudes();
      renderizarAdmin();
      renderizarMisMantenimientos();

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Solicitud eliminada",
        showConfirmButton: false,
        timer: 1800
      });
    }
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
    celda.colSpan = 10;
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
    const selectEstado = document.createElement("select");
    selectEstado.className = "form-select form-select-sm";

    Object.keys(CLASES_ESTADO).forEach(function (estado) {
      const opcion = document.createElement("option");
      opcion.value = estado;
      opcion.textContent = estado;
      if (estado === s.estado) {
        opcion.selected = true;
      }
      selectEstado.appendChild(opcion);
    });

    selectEstado.addEventListener("change", function () {
      cambiarEstado(s.id, selectEstado.value);
    });

    celdaEstado.appendChild(selectEstado);
    fila.appendChild(celdaEstado);
            const celdaAcciones = document.createElement("td");
    celdaAcciones.className = "text-nowrap";

    const botonEditar = document.createElement("button");
    botonEditar.type = "button";
    botonEditar.className = "btn btn-sm btn-outline-primary me-1";
    botonEditar.textContent = "Editar";
    botonEditar.addEventListener("click", function () {
      editarSolicitud(s.id);
    });

    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.className = "btn btn-sm btn-outline-danger";
    botonEliminar.textContent = "Eliminar";
    botonEliminar.addEventListener("click", function () {
      eliminarSolicitud(s.id);
    });

    celdaAcciones.appendChild(botonEditar);
    celdaAcciones.appendChild(botonEliminar);
    fila.appendChild(celdaAcciones);

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