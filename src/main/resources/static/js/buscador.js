// Buscador de avistamientos. Cada vez que se escribe algo se le pide al
// servidor (con fetch) los avistamientos que calzan y se dibuja la tabla.

var inputTexto = document.getElementById("texto");
var tabla = document.getElementById("tabla");
var cuerpo = document.getElementById("resultados");
var mensaje = document.getElementById("mensaje");

// sirve para ignorar respuestas viejas si el usuario escribe muy rapido
var numeroBusqueda = 0;

document.getElementById("form-buscar").addEventListener("submit", function (evento) {
  evento.preventDefault();
});

inputTexto.addEventListener("input", function () {
  buscar(inputTexto.value.trim());
});

async function buscar(texto) {
  numeroBusqueda++;
  var miBusqueda = numeroBusqueda;

  if (texto === "") {
    tabla.hidden = true;
    mensaje.textContent = "";
    return;
  }

  try {
    var respuesta = await fetch("/api/buscar?texto=" + encodeURIComponent(texto));
    var datos = await respuesta.json();

    if (miBusqueda !== numeroBusqueda) {
      return;
    }
    mostrarResultados(datos, texto);
  } catch (error) {
    console.log("Error al buscar", error);
    mensaje.textContent = "Ocurrió un error al buscar, intente de nuevo.";
  }
}

function mostrarResultados(datos, texto) {
  cuerpo.innerHTML = "";

  if (datos.length === 0) {
    tabla.hidden = true;
    mensaje.textContent = "No se encontraron avistamientos para \"" + texto + "\".";
    return;
  }

  mensaje.textContent = "Se encontraron " + datos.length + " avistamientos.";
  tabla.hidden = false;

  for (var i = 0; i < datos.length; i++) {
    var a = datos[i];
    var fila = document.createElement("tr");

    fila.appendChild(celdaDestacada(a.voluntario, texto));
    fila.appendChild(celdaTexto(a.dia));
    fila.appendChild(celdaDestacada(a.ave, texto));
    fila.appendChild(celdaDestacada(a.comuna, texto));

    var celdaNota = celdaTexto(formatearNota(a.nota));
    fila.appendChild(celdaNota);

    var celdaEvaluar = document.createElement("td");
    celdaEvaluar.className = "evaluar";
    var boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = "Evaluar";
    boton.addEventListener("click", mostrarSelectorNota(a.id, celdaEvaluar, celdaNota));
    celdaEvaluar.appendChild(boton);
    fila.appendChild(celdaEvaluar);

    cuerpo.appendChild(fila);
  }
}

function formatearNota(nota) {
  if (nota === null || nota === undefined) {
    return "-";
  }
  return nota.toFixed(1);
}

function celdaTexto(texto) {
  var td = document.createElement("td");
  td.textContent = texto;
  return td;
}

// Pone en <mark> la parte del texto que calza con lo buscado. Se arma con
// nodos de texto y no con innerHTML para no meter HTML que venga de la base.
function celdaDestacada(valor, buscado) {
  var td = document.createElement("td");
  var minuscula = valor.toLowerCase();
  var patron = buscado.toLowerCase();
  var desde = 0;
  var pos = minuscula.indexOf(patron);

  while (pos !== -1) {
    td.appendChild(document.createTextNode(valor.substring(desde, pos)));
    var marca = document.createElement("mark");
    marca.textContent = valor.substring(pos, pos + patron.length);
    td.appendChild(marca);
    desde = pos + patron.length;
    pos = minuscula.indexOf(patron, desde);
  }
  td.appendChild(document.createTextNode(valor.substring(desde)));
  return td;
}

// Al apretar "Evaluar" se cambia el boton por un select con las notas 1 a 7
function mostrarSelectorNota(idAvistamiento, celdaEvaluar, celdaNota) {
  return function () {
    celdaEvaluar.innerHTML = "";

    var select = document.createElement("select");
    select.setAttribute("aria-label", "Nota del avistamiento");
    var vacia = document.createElement("option");
    vacia.value = "";
    vacia.textContent = "Nota";
    select.appendChild(vacia);
    for (var n = 1; n <= 7; n++) {
      var op = document.createElement("option");
      op.value = n;
      op.textContent = n;
      select.appendChild(op);
    }

    var guardar = document.createElement("button");
    guardar.type = "button";
    guardar.textContent = "Guardar";
    guardar.addEventListener("click", function () {
      enviarNota(idAvistamiento, select.value, celdaEvaluar, celdaNota);
    });

    celdaEvaluar.appendChild(select);
    celdaEvaluar.appendChild(guardar);
  };
}

async function enviarNota(idAvistamiento, valor, celdaEvaluar, celdaNota) {
  // solo enteros entre 1 y 7 (el servidor tambien lo revisa)
  var nota = Number(valor);
  if (valor === "" || !Number.isInteger(nota) || nota < 1 || nota > 7) {
    alert("Seleccione una nota entre 1 y 7.");
    return;
  }

  try {
    var respuesta = await fetch("/api/nota", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ avistamientoId: idAvistamiento, nota: nota })
    });
    var datos = await respuesta.json();

    if (!respuesta.ok) {
      alert(datos.error);
      return;
    }

    // se actualiza el promedio en la tabla sin recargar
    celdaNota.textContent = formatearNota(datos.promedio);
    celdaEvaluar.innerHTML = "";
    var boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = "Evaluar";
    boton.addEventListener("click", mostrarSelectorNota(idAvistamiento, celdaEvaluar, celdaNota));
    celdaEvaluar.appendChild(boton);
  } catch (error) {
    console.log("Error al guardar la nota", error);
    alert("No se pudo guardar la nota.");
  }
}
