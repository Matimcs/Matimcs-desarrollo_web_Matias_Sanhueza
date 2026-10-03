# Tarea 2 - Registro de Avistamientos de Aves

Implementación del sistema de la Unión de Ornitólogos de Chile con Python + Flask y
una base de datos MySQL, usando SQLAlchemy. Es la continuación de la Tarea 1: se
mantienen las interfaces y las validaciones en JavaScript, y ahora los datos se
guardan y se leen desde la base de datos.

## Cómo ejecutarlo

1. Crear la base de datos y el usuario con el script `sql/tarea2.sql`.
2. Cargar los datos de apoyo:
   - regiones y comunas con `sql/region-comuna.sql`
   - aves con `sql/aves.sql`
3. Instalar las dependencias:

   ```
   pip install -r requirements.txt
   ```

4. Levantar la aplicación:

   ```
   python app.py
   ```

   Queda en `http://localhost:5000`.

La conexión usa las credenciales pedidas en el enunciado (host localhost, puerto 3306,
base `tarea2`, usuario `cc5002`, password `programacionweb`). Se puede sobrescribir con
la variable de entorno `TAREA2_DATABASE_URL` sin tocar el código.

## Estructura

- `app.py`: rutas de Flask (portada, registro, avistamiento, listado, detalle).
- `database/db.py`: modelos SQLAlchemy y funciones de consulta/inserción.
- `validaciones.py`: validaciones del lado del servidor.
- `templates/`: plantillas Jinja (extienden `base.html`).
- `static/css/estilos.css`: estilos (los mismos de la Tarea 1).
- `static/js/`: validaciones en el navegador y los select dependientes de comuna.
- `static/uploads/`: donde se guardan las fotos y videos de los avistamientos.
- `sql/`: los scripts entregados para crear y poblar la base.

## Decisiones que conviene tener en cuenta para la corrección

- **Modelo de datos:** me ajusté a las tablas de `tarea2.sql`. Como la tabla
  `voluntario` tiene un solo campo `nombre`, en el formulario pido nombres y apellidos
  por separado (manteniendo las validaciones de la Tarea 1) y los guardo juntos en esa
  columna. No incluí RUT ni fecha de nacimiento porque el modelo no los considera. El
  avistamiento guarda solo `lugar` (texto), que es lo que tiene la tabla.
- **Archivos:** un avistamiento puede tener varias fotos o videos, así que por cada
  archivo se inserta una fila en la tabla `registro`. Los archivos se guardan en
  `static/uploads/` con un nombre único (marca de tiempo + nombre seguro) y en la tabla
  queda el nombre original y el nombre guardado.
- **Validaciones:** se mantienen todas las validaciones en JavaScript (el formulario
  usa `novalidate`, no dependo del atributo `required`) y además se repiten en el
  servidor, porque no hay que confiar en que los datos llegaron limpios desde el
  navegador. Reglas principales: correo con formato válido, celular chileno, la fecha
  del avistamiento no puede ser futura ni de más de 30 años atrás, y es obligatorio al
  menos un archivo de imagen o video.
- **Entradas maliciosas:** las consultas se hacen con SQLAlchemy (quedan
  parametrizadas, sin armar SQL a mano), las plantillas Jinja escapan el contenido por
  defecto (evita XSS al mostrar los datos), los id que llegan por la URL se reciben como
  enteros y se validan contra la base, y los nombres de archivo pasan por
  `secure_filename`. También hay un tope de tamaño por envío.
- **Estadísticas:** quedan pendientes para la siguiente tarea, pero la opción aparece en
  el menú de la portada como pide el enunciado.
