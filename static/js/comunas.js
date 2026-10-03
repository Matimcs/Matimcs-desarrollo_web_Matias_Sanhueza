// Arma el select de comunas según la región elegida. Las regiones y comunas
// vienen de la base de datos, el servidor las deja en la variable REGIONES.

function construirComunas(regionId, comunaSeleccionada) {
  var selComuna = document.getElementById("comuna");
  selComuna.innerHTML = "<option value=\"\">Seleccione comuna</option>";
  if (!regionId) {
    return;
  }
  for (var i = 0; i < REGIONES.length; i++) {
    if (String(REGIONES[i].id) === String(regionId)) {
      var comunas = REGIONES[i].comunas;
      for (var j = 0; j < comunas.length; j++) {
        var op = document.createElement("option");
        op.value = comunas[j].id;
        op.textContent = comunas[j].nombre;
        if (comunaSeleccionada && String(comunaSeleccionada) === String(comunas[j].id)) {
          op.selected = true;
        }
        selComuna.appendChild(op);
      }
      break;
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var selRegion = document.getElementById("region");
  if (!selRegion) {
    return;
  }

  // Si la página se recarga con una región ya elegida (por un error de
  // validación en el servidor), se reconstruyen sus comunas y se marca la
  // que estaba seleccionada.
  if (selRegion.value) {
    construirComunas(selRegion.value, COMUNA_SELECCIONADA);
  }

  selRegion.addEventListener("change", function () {
    construirComunas(selRegion.value, "");
  });
});
