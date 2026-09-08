// Validaciones del registro de voluntarios. Todo se hace en JavaScript,
// por eso el formulario lleva "novalidate" y no dependo del atributo required.

cargarRegiones("region", "comuna");

var form = document.getElementById("form-registro");
var aviso = document.getElementById("aviso");

form.addEventListener("submit", function (evento) {
  evento.preventDefault();
  aviso.hidden = true;

  // Voy acumulando si algo falla para no cortar en el primer error.
  var ok = true;

  if (!validarTexto("nombre", "Ingrese sus nombres (solo letras).")) { ok = false; }
  if (!validarTexto("apellido", "Ingrese sus apellidos (solo letras).")) { ok = false; }
  if (!validarRut()) { ok = false; }
  if (!validarNacimiento()) { ok = false; }
  if (!validarEmail()) { ok = false; }
  if (!validarCelular()) { ok = false; }
  if (!validarSelect("region", "Seleccione una región.")) { ok = false; }
  if (!validarSelect("comuna", "Seleccione una comuna.")) { ok = false; }

  if (ok) {
    aviso.textContent = "¡Listo! Sus datos fueron validados correctamente (prototipo, no se almacenan).";
    aviso.hidden = false;
    form.reset();
    cargarComunas("", document.getElementById("comuna"));
    window.scrollTo(0, 0);
  }
});

// Marca o limpia el error de un campo.
function marcar(id, mensaje) {
  var campo = document.getElementById(id);
  var error = document.getElementById("error-" + id);
  if (mensaje) {
    campo.classList.add("campo-error");
    error.textContent = mensaje;
  } else {
    campo.classList.remove("campo-error");
    error.textContent = "";
  }
}

// Solo letras (incluye tildes y ñ) y espacios, al menos 2 caracteres.
function validarTexto(id, mensaje) {
  var valor = document.getElementById(id).value.trim();
  var patron = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/;
  if (!patron.test(valor)) {
    marcar(id, mensaje);
    return false;
  }
  marcar(id, "");
  return true;
}

function validarSelect(id, mensaje) {
  if (document.getElementById(id).value === "") {
    marcar(id, mensaje);
    return false;
  }
  marcar(id, "");
  return true;
}

function validarEmail() {
  var valor = document.getElementById("email").value.trim();
  // usuario@dominio.tld  (tld de al menos 2 letras)
  var patron = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  if (!patron.test(valor)) {
    marcar("email", "Ingrese un correo válido, por ejemplo nombre@correo.cl");
    return false;
  }
  marcar("email", "");
  return true;
}

// Acepta formatos como +56912345678, 56912345678 o 912345678.
function validarCelular() {
  var valor = document.getElementById("celular").value.replace(/[ .-]/g, "");
  var patron = /^(\+?56)?9\d{8}$/;
  if (!patron.test(valor)) {
    marcar("celular", "Ingrese un celular chileno válido, por ejemplo +56 9 1234 5678.");
    return false;
  }
  marcar("celular", "");
  return true;
}

// Validacion de RUT con digito verificador (modulo 11).
function validarRut() {
  var valor = document.getElementById("rut").value.trim().replace(/\./g, "").toUpperCase();
  var patron = /^(\d{7,8})-([\dK])$/;
  var partes = patron.exec(valor);
  if (!partes) {
    marcar("rut", "Formato de RUT inválido. Use 12345678-9.");
    return false;
  }

  var cuerpo = partes[1];
  var dv = partes[2];
  var suma = 0;
  var factor = 2;
  for (var i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  var resto = 11 - (suma % 11);
  var dvEsperado;
  if (resto === 11) {
    dvEsperado = "0";
  } else if (resto === 10) {
    dvEsperado = "K";
  } else {
    dvEsperado = "" + resto;
  }

  if (dv !== dvEsperado) {
    marcar("rut", "El dígito verificador no corresponde al RUT.");
    return false;
  }
  marcar("rut", "");
  return true;
}

// Opcional, pero si la escriben debe estar en el pasado y dar una edad razonable.
function validarNacimiento() {
  var valor = document.getElementById("nacimiento").value;
  if (valor === "") {
    marcar("nacimiento", "");
    return true;
  }
  var fecha = new Date(valor);
  var hoy = new Date();
  if (fecha > hoy) {
    marcar("nacimiento", "La fecha de nacimiento no puede estar en el futuro.");
    return false;
  }
  var edad = (hoy - fecha) / (1000 * 60 * 60 * 24 * 365.25);
  if (edad < 12 || edad > 110) {
    marcar("nacimiento", "La edad debe estar entre 12 y 110 años.");
    return false;
  }
  marcar("nacimiento", "");
  return true;
}
