# Tarea 4 - Buscador de avistamientos y notas

Aplicación hecha con Spring Boot (Java 17) y JPA, conectada a la misma base de datos MySQL de las tareas anteriores (base tarea2, usuario cc5002). Antes de correrla hay que crear la tabla nota con el script sql/tabla-nota.sql.

La página principal es el buscador. Tiene un único input y cada vez que se escribe algo se hace una llamada con fetch a /api/buscar, que devuelve los avistamientos donde el nombre del ave, del voluntario o de la comuna contienen el texto. La búsqueda no distingue mayúsculas. Si no hay resultados se muestra un mensaje. El texto que calza se destaca con la etiqueta mark.

Como la tabla avistamiento no tiene comuna, la comuna que muestro y en la que busco es la del voluntario que hizo el avistamiento.

La nota muestra "-" si el avistamiento no tiene notas, y si tiene muestra el promedio. Al apretar Evaluar aparece un select con las notas del 1 al 7 y un botón para guardar. La nota se manda con fetch a /api/nota y el servidor responde con el promedio nuevo, que se actualiza en la tabla sin recargar la página.

La nota se valida en el navegador y también en el servidor: tiene que ser un número entero entre 1 y 7 y el avistamiento tiene que existir. Si no, el servidor responde con un error y no guarda nada.

Los resultados se arman con createElement y textContent (no con innerHTML) para que los datos de la base se muestren como texto. Las consultas se hacen con JPA, así que los parámetros van separados de la consulta.
