# Tarea 1 - Registro de Avistamientos de Aves

Prototipo del sistema de la Unión de Ornitólogos de Chile para el curso CC5002.
Está hecho solo con HTML, CSS y JavaScript, no usa servidor ni guarda datos.
Para probarlo basta abrir `index.html` en el navegador.

# Páginas

- `index.html`: inicio y navegación.
- `registro.html`: registro de voluntario(a).
- `avistamiento.html`: formulario para informar un avistamiento.
- `listado.html`: listado de avistamientos con filtro, orden y paginación.
- `metricas.html`: indicadores y gráficos.

# Estructura

- `css/estilos.css`: estilos compartidos por todas las páginas.
- `js/datos-chile.js`: regiones y comunas de Chile para los `select` dependientes.
- `js/datos-aves.js`: datos de ejemplo (tipos de ave, avistamientos y voluntarios).
- `js/registro.js`, `js/avistamiento.js`, `js/listado.js`, `js/metricas.js`: lógica de cada página.

# Decisioness que conviene tener en cuenta para la corrección

- **Todas las validaciones están en JavaScript.** Los formularios usan `novalidate`,
  así que el atributo `required` de HTML no interviene. Cada campo muestra su propio
  mensaje de error bajo el input.
- **Campos obligatorios y opcionales:** los opcionales están marcados con el texto
  "(opcional)". El resto son obligatorios.
- **Reglas de validación principales:**
  - Correo: formato `usuario@dominio.tld`.
  - Celular: número chileno, acepta `+56 9 ...`, `56 9 ...` o `9 ...` (8 dígitos después del 9).
  - RUT: se valida el dígito verificador con módulo 11.
  - Fecha del avistamiento: no puede ser futura y como límite no puede ser anterior
    a 30 años atrás (así se descarta una fecha "demasiado en el pasado").
  - Avistamiento: es obligatorio adjuntar al menos una foto o video, y solo se aceptan
    archivos de tipo imagen o video.
- **Datos de ejemplo:** como el prototipo no guarda información, el listado y las
  métricas trabajan sobre datos fijos definidos en `js/datos-aves.js`.
- **Gráficos:** se dibujan con barras en HTML/CSS para no depender de librerías externas.

Probado en Chrome y Firefox, y en distintos tamaños de pantalla.

Parte de la estructura y de las validaciones las reutilicé de un proyecto que hice
para el ramo Ingeniería de Software CC4401-1.
