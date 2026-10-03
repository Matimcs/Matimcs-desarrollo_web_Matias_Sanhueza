// Validaciones del formulario de avistamiento en el navegador. Mismas reglas
// que en la Tarea 1. Si todo está bien, se envía al servidor.

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("form-avistamiento");
  if (!form) {
    return;
  }

  form.addEventListener("submit", function (evento) {
    var ok = true;

    if (!validarSelect("voluntario", "Seleccione un voluntario.")) { ok = false; }
    if (!validarSelect("ave", "Seleccione el ave observada.")) { ok = false; }
    if (!validarLugar()) { ok = false; }
    if (!validarFecha()) { ok = false; }
    if (!validarArchivo()) { ok = false; }

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

function validarSelect(id, mensaje) {
  if (document.getElementById(id).value === "") {
    marcar(id, mensaje);
    return false;
  }
  marcar(id, "");
  return true;
}

function validarLugar() {
  var valor = document.getElementById("lugar").value.trim();
  if (valor.length < 3) {
    marcar("lugar", "Indique el lugar del avistamiento.");
    return false;
  }
  marcar("lugar", "");
  return true;
}

// La fecha no puede ser futura ni de más de 30 años atrás.
function validarFecha() {
  var valor = document.getElementById("fecha").value;
  if (valor === "") {
    marcar("fecha", "Indique la fecha y hora del avistamiento.");
    return false;
  }
  var fecha = new Date(valor);
  var ahora = new Date();
  if (fecha > ahora) {
    marcar("fecha", "La fecha del avistamiento no puede estar en el futuro.");
    return false;
  }
  var limite = new Date();
  limite.setFullYear(limite.getFullYear() - 30);
  if (fecha < limite) {
    marcar("fecha", "La fecha es demasiado antigua (máximo 30 años atrás).");
    return false;
  }
  marcar("fecha", "");
  return true;
}

// Debe haber al menos un archivo y todos deben ser imagen o video.
function validarArchivo() {
  var input = document.getElementById("archivos");
  var archivos = input.files;
  if (archivos.length === 0) {
    marcar("archivos", "Debe adjuntar al menos una foto o video.");
    return false;
  }
  for (var i = 0; i < archivos.length; i++) {
    var tipo = archivos[i].type;
    if (tipo.indexOf("image/") !== 0 && tipo.indexOf("video/") !== 0) {
      marcar("archivos", "Solo se aceptan archivos de imagen o video.");
      return false;
    }
  }
  marcar("archivos", "");
  return true;
}
