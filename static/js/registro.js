// Validaciones del registro de voluntarios en el navegador. Son las mismas
// reglas de la Tarea 1. Si algo falla se corta el envío y se muestran los
// mensajes; si todo está bien, el formulario se envía al servidor (Flask).

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("form-registro");
  if (!form) {
    return;
  }

  form.addEventListener("submit", function (evento) {
    var ok = true;

    if (!validarTexto("nombre", "Ingrese sus nombres (solo letras).")) { ok = false; }
    if (!validarTexto("apellido", "Ingrese sus apellidos (solo letras).")) { ok = false; }
    if (!validarEmail()) { ok = false; }
    if (!validarCelular()) { ok = false; }
    if (!validarSelect("region", "Seleccione una región.")) { ok = false; }
    if (!validarSelect("comuna", "Seleccione una comuna.")) { ok = false; }

    if (!ok) {
      evento.preventDefault();
    }
  });
});

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
