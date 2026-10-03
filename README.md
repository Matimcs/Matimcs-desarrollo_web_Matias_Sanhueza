# Tarea 2 - Registro de Avistamientos de Aves

Sistema de la Unión de Ornitólogos de Chile hecho con Python, Flask y una base de datos MySQL usando SQLAlchemy. Es la continuación de la Tarea 1: se mantienen las interfaces y las validaciones en JavaScript, y ahora los datos se guardan y se leen desde la base de datos.

La conexión usa las credenciales del enunciado (host localhost, puerto 3306, base tarea2, usuario cc5002, password programacionweb). Los scripts para crear y poblar la base están en la carpeta sql.

Decisiones que conviene tener en cuenta para la corrección:

Me ajusté a las tablas de tarea2.sql. Como la tabla voluntario tiene un solo campo nombre, en el formulario pido nombres y apellidos por separado (manteniendo las validaciones de la Tarea 1) y los guardo juntos en esa columna. No incluí RUT ni fecha de nacimiento porque el modelo no los considera. El avistamiento guarda solo el lugar como texto, que es lo que tiene la tabla.

Un avistamiento puede tener varias fotos o videos, así que por cada archivo se inserta una fila en la tabla registro. Los archivos se guardan en static/uploads con un nombre único y en la tabla queda el nombre original y el nombre guardado.

Se mantienen todas las validaciones en JavaScript (el formulario usa novalidate, no dependo del atributo required) y además se repiten en el servidor, porque no hay que confiar en que los datos llegaron limpios desde el navegador. Las reglas principales son correo con formato válido, celular chileno, la fecha del avistamiento no puede ser futura ni de más de 30 años atrás, y es obligatorio al menos un archivo de imagen o video.

Para las entradas maliciosas, las consultas se hacen con SQLAlchemy así que quedan parametrizadas, las plantillas Jinja escapan el contenido por defecto, los id que llegan por la URL se reciben como enteros y se validan contra la base, y los nombres de archivo pasan por secure_filename.

Las estadísticas quedan pendientes para la siguiente tarea, pero la opción aparece en el menú de la portada como pide el enunciado.
