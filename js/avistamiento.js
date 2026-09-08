// Validaciones del formulario para informar un avistamiento.

cargarRegiones("region", "comuna");

// Cargo los tipos de ave y las sugerencias de nombres desde datos-aves.js
var selTipo = document.getElementById("tipo");
for (var i = 0; i < tiposDeAve.length; i++) {
  var op = document.createElement("option");
  op.value = tiposDeAve[i];
  op.textContent = tiposDeAve[i];
  selTipo.appendChild(op);
}

var datalist = document.getElementById("lista-aves");
for (var j = 0; j < avesComunes.length; j++) {
  var opt = document.createElement("option");
  opt.value = avesComunes[j];
  datalist.appendChild(opt);
}

var form = document.getElementById("form-avistamiento");
var aviso = document.getElementById("aviso");

form.addEventListener("submit", function (evento) {
  evento.preventDefault();
  aviso.hidden = true;

  var ok = true;
  if (!validarEmail()) { ok = false; }
  if (!validarSelect("tipo", "Seleccione el tipo de ave.")) { ok = false; }
  if (!validarNombre()) { ok = false; }
  if (!validarCantidad()) { ok = false; }
  if (!validarSelect("region", "Seleccione una región.")) { ok = false; }
  if (!validarSelect("comuna", "Seleccione una comuna.")) { ok = false; }
  if (!validarLugar()) { ok = false; }
  if (!validarFecha()) { ok = false; }
  if (!validarArchivo()) { ok = false; }

  if (ok) {
    aviso.textContent = "¡Avistamiento validado! (prototipo, no se almacena la información).";
    aviso.hidden = false;
    form.reset();
    cargarComunas("", document.getElementById("comuna"));
    window.scrollTo(0, 0);
  }
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

function validarEmail() {
  var valor = document.getElementById("email").value.trim();
  var patron = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  if (!patron.test(valor)) {
    marcar("email", "Ingrese el correo con que se registró como voluntario.");
    return false;
  }
  marcar("email", "");
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

function validarNombre() {
  var valor = document.getElementById("nombre").value.trim();
  // Letras, espacios y guiones; al menos 3 caracteres.
  var patron = /^[A-Za-zÁÉÍÓÚáéíóúÑñ -]{3,}$/;
  if (!patron.test(valor)) {
    marcar("nombre", "Ingrese el nombre del ave (solo letras).");
    return false;
  }
  marcar("nombre", "");
  return true;
}

function validarCantidad() {
  var valor = document.getElementById("cantidad").value.trim();
  if (valor === "") {
    marcar("cantidad", "");
    return true;
  }
  var n = parseInt(valor, 10);
  if (isNaN(n) || n < 1 || n > 1000) {
    marcar("cantidad", "La cantidad debe ser un número entre 1 y 1000.");
    return false;
  }
  marcar("cantidad", "");
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

// La fecha no puede ser futura ni demasiado antigua (mas de 30 años atrás).
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
  var input = document.getElementById("archivo");
  var archivos = input.files;
  if (archivos.length === 0) {
    marcar("archivo", "Debe adjuntar al menos una foto o video.");
    return false;
  }
  for (var k = 0; k < archivos.length; k++) {
    var tipo = archivos[k].type;
    if (tipo.indexOf("image/") !== 0 && tipo.indexOf("video/") !== 0) {
      marcar("archivo", "Solo se aceptan archivos de imagen o video.");
      return false;
    }
  }
  marcar("archivo", "");
  return true;
}
