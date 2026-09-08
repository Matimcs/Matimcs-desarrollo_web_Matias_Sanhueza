// Listado de avistamientos con filtro por tipo, ordenamiento y paginación.
// Los datos vienen de datos-aves.js (arreglo "avistamientos").

var POR_PAGINA = 8;
var paginaActual = 1;

var filtroTipo = document.getElementById("filtro-tipo");
var orden = document.getElementById("orden");
var cuerpo = document.getElementById("cuerpo-tabla");
var resumen = document.getElementById("resumen");
var divPaginacion = document.getElementById("paginacion");

// Cargo las opciones del filtro de tipos.
for (var i = 0; i < tiposDeAve.length; i++) {
  var op = document.createElement("option");
  op.value = tiposDeAve[i];
  op.textContent = tiposDeAve[i];
  filtroTipo.appendChild(op);
}

// Si cambio un filtro vuelvo a la primera página.
filtroTipo.addEventListener("change", function () {
  paginaActual = 1;
  dibujar();
});
orden.addEventListener("change", function () {
  paginaActual = 1;
  dibujar();
});

// Devuelve la lista ya filtrada y ordenada según los controles.
function obtenerDatos() {
  var lista = avistamientos.slice();

  if (filtroTipo.value !== "") {
    lista = lista.filter(function (a) {
      return a.tipo === filtroTipo.value;
    });
  }

  var criterio = orden.value;
  lista.sort(function (a, b) {
    if (criterio === "fecha-asc") {
      return a.fecha < b.fecha ? -1 : 1;
    } else if (criterio === "fecha-desc") {
      return a.fecha > b.fecha ? -1 : 1;
    } else if (criterio === "lugar-asc") {
      return a.lugar.localeCompare(b.lugar);
    } else {
      return b.lugar.localeCompare(a.lugar);
    }
  });

  return lista;
}

// Convierte "2026-08-02T07:45" a algo legible tipo "02-08-2026 07:45".
function formatearFecha(iso) {
  var partes = iso.split("T");
  var f = partes[0].split("-");
  return f[2] + "-" + f[1] + "-" + f[0] + " " + partes[1];
}

function dibujar() {
  var lista = obtenerDatos();
  var totalPaginas = Math.ceil(lista.length / POR_PAGINA);
  if (totalPaginas === 0) {
    totalPaginas = 1;
  }
  if (paginaActual > totalPaginas) {
    paginaActual = totalPaginas;
  }

  var inicio = (paginaActual - 1) * POR_PAGINA;
  var pagina = lista.slice(inicio, inicio + POR_PAGINA);

  cuerpo.innerHTML = "";
  if (pagina.length === 0) {
    var fila = document.createElement("tr");
    var celda = document.createElement("td");
    celda.colSpan = 6;
    celda.textContent = "No hay avistamientos para este filtro.";
    fila.appendChild(celda);
    cuerpo.appendChild(fila);
  } else {
    for (var i = 0; i < pagina.length; i++) {
      var a = pagina[i];
      var tr = document.createElement("tr");
      tr.appendChild(crearCelda(a.ave));
      tr.appendChild(crearCelda(a.tipo));
      tr.appendChild(crearCelda(a.lugar));
      tr.appendChild(crearCelda(a.region));
      tr.appendChild(crearCelda(formatearFecha(a.fecha)));
      tr.appendChild(crearCelda(a.voluntario));
      cuerpo.appendChild(tr);
    }
  }

  resumen.textContent = "Mostrando " + pagina.length + " de " + lista.length +
    " avistamientos - página " + paginaActual + " de " + totalPaginas;

  dibujarPaginacion(totalPaginas);
}

function crearCelda(texto) {
  var td = document.createElement("td");
  td.textContent = texto;
  return td;
}

function dibujarPaginacion(totalPaginas) {
  divPaginacion.innerHTML = "";

  var anterior = document.createElement("button");
  anterior.textContent = "« Anterior";
  anterior.disabled = paginaActual === 1;
  anterior.addEventListener("click", function () {
    paginaActual--;
    dibujar();
  });
  divPaginacion.appendChild(anterior);

  for (var p = 1; p <= totalPaginas; p++) {
    var boton = document.createElement("button");
    boton.textContent = p;
    if (p === paginaActual) {
      boton.className = "pagina-activa";
    }
    // "cierro" el valor de p con una funcion aparte
    boton.addEventListener("click", irAPagina(p));
    divPaginacion.appendChild(boton);
  }

  var siguiente = document.createElement("button");
  siguiente.textContent = "Siguiente »";
  siguiente.disabled = paginaActual === totalPaginas;
  siguiente.addEventListener("click", function () {
    paginaActual++;
    dibujar();
  });
  divPaginacion.appendChild(siguiente);
}

function irAPagina(p) {
  return function () {
    paginaActual = p;
    dibujar();
  };
}

dibujar();
