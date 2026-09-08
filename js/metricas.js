// Calcula las métricas a partir de los datos de ejemplo y las dibuja con
// barras hechas en HTML/CSS (sin librerías externas).

// Tarjetas de totales.
document.getElementById("total-avistamientos").textContent = avistamientos.length;
document.getElementById("total-voluntarios").textContent = voluntarios.length;

var especies = [];
for (var i = 0; i < avistamientos.length; i++) {
  if (especies.indexOf(avistamientos[i].ave) === -1) {
    especies.push(avistamientos[i].ave);
  }
}
document.getElementById("total-especies").textContent = especies.length;

// Cuenta cuántas veces aparece cada valor de "campo" en un arreglo.
function contarPor(lista, campo) {
  var conteo = {};
  for (var i = 0; i < lista.length; i++) {
    var clave = lista[i][campo];
    if (conteo[clave]) {
      conteo[clave]++;
    } else {
      conteo[clave] = 1;
    }
  }
  return conteo;
}

// Dibuja un gráfico de barras horizontal dentro del contenedor indicado.
function dibujarBarras(idContenedor, conteo) {
  var contenedor = document.getElementById(idContenedor);

  // Paso el objeto a arreglo y lo ordeno de mayor a menor.
  var filas = [];
  for (var clave in conteo) {
    filas.push({ etiqueta: clave, valor: conteo[clave] });
  }
  filas.sort(function (a, b) {
    return b.valor - a.valor;
  });

  // Busco el máximo para escalar el ancho de las barras.
  var maximo = 0;
  for (var j = 0; j < filas.length; j++) {
    if (filas[j].valor > maximo) {
      maximo = filas[j].valor;
    }
  }

  for (var k = 0; k < filas.length; k++) {
    var fila = document.createElement("div");
    fila.className = "barra-fila";

    var etiqueta = document.createElement("span");
    etiqueta.className = "etiqueta";
    etiqueta.textContent = filas[k].etiqueta;

    var relleno = document.createElement("span");
    relleno.className = "relleno";
    var ancho = Math.round((filas[k].valor / maximo) * 260) + 20;
    relleno.style.width = ancho + "px";
    relleno.textContent = filas[k].valor;

    fila.appendChild(etiqueta);
    fila.appendChild(relleno);
    contenedor.appendChild(fila);
  }
}

dibujarBarras("grafico-tipo", contarPor(avistamientos, "tipo"));
dibujarBarras("grafico-region", contarPor(avistamientos, "region"));
dibujarBarras("grafico-voluntarios", contarPor(voluntarios, "region"));
