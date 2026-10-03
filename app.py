import os
from datetime import datetime

from flask import Flask, render_template, request, redirect, url_for, flash

from werkzeug.utils import secure_filename

import database.db as db
import validaciones as v

UPLOAD_FOLDER = os.path.join("static", "uploads")

app = Flask(__name__)
app.secret_key = "cc5002-tarea2-aves"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 25 * 1000 * 1000  # 25 MB como tope por envio

AVISTAMIENTOS_POR_PAGINA = 8


@app.route("/")
def inicio():
    ultimos = db.get_ultimos_avistamientos(2)
    return render_template("inicio.html", ultimos=ultimos)


@app.route("/registro", methods=["GET", "POST"])
def registro():
    regiones = db.get_regiones_con_comunas()

    if request.method == "POST":
        errores = v.validar_registro(request.form)

        # Ademas de validar el formato, la comuna debe existir en la base.
        comuna_id = v.validar_entero(request.form.get("comuna"))
        if "comuna" not in errores and not db.comuna_existe(comuna_id):
            errores["comuna"] = "La comuna seleccionada no es válida."

        if errores:
            # Se vuelve a mostrar el formulario con los errores y lo ya escrito.
            return render_template(
                "registro.html",
                regiones=regiones,
                errores=errores,
                valores=request.form,
            )

        nombre_completo = request.form["nombre"].strip() + " " + request.form["apellido"].strip()
        nuevo_id = db.crear_voluntario(
            nombre=nombre_completo,
            email=request.form["email"].strip(),
            telefono=request.form["celular"].strip(),
            comuna_id=comuna_id,
        )

        if nuevo_id is None:
            errores["general"] = "No se pudo registrar el voluntario, intente nuevamente."
            return render_template(
                "registro.html",
                regiones=regiones,
                errores=errores,
                valores=request.form,
            )

        # Registro exitoso: se ofrece informar un avistamiento o ir al inicio.
        return render_template(
            "registro.html",
            regiones=regiones,
            exito=True,
            voluntario_id=nuevo_id,
            nombre=nombre_completo,
            valores={},
        )

    return render_template("registro.html", regiones=regiones, errores={}, valores={})


@app.route("/avistamiento", methods=["GET", "POST"])
def avistamiento():
    voluntarios = db.get_voluntarios()
    aves = db.get_aves()

    if request.method == "POST":
        errores = {}

        voluntario_id = v.validar_entero(request.form.get("voluntario"))
        if voluntario_id is None or not db.voluntario_existe(voluntario_id):
            errores["voluntario"] = "Seleccione un voluntario válido."

        ave_id = v.validar_entero(request.form.get("ave"))
        if ave_id is None or not db.ave_existe(ave_id):
            errores["ave"] = "Seleccione un ave válida."

        if not v.validar_lugar(request.form.get("lugar")):
            errores["lugar"] = "Indique el lugar del avistamiento."

        fecha = v.validar_fecha(request.form.get("fecha"))
        if fecha is None:
            errores["fecha"] = "La fecha no puede estar en el futuro ni ser muy antigua (máximo 30 años)."

        # Se exige al menos un archivo y que todos sean imagen o video.
        archivos_subidos = [f for f in request.files.getlist("archivos") if f and f.filename]
        if len(archivos_subidos) == 0:
            errores["archivos"] = "Debe adjuntar al menos una foto o video."
        else:
            for f in archivos_subidos:
                if not v.extension_permitida(f.filename):
                    errores["archivos"] = "Solo se aceptan archivos de imagen o video."
                    break

        if errores:
            return render_template(
                "avistamiento.html",
                voluntarios=voluntarios,
                aves=aves,
                errores=errores,
                valores=request.form,
            )

        # Si todo esta validado, se guardan los archivos en disco.
        guardados = _guardar_archivos(archivos_subidos)

        descripcion = request.form.get("descripcion", "").strip()
        nuevo_id = db.crear_avistamiento(
            voluntario_id=voluntario_id,
            ave_id=ave_id,
            fecha_hora=fecha,
            lugar=request.form["lugar"].strip(),
            descripcion=descripcion if descripcion else None,
            archivos=guardados,
        )

        if nuevo_id is None:
            # Si fallo la insercion, se borran los archivos que ya se guardaron.
            for _, ruta in guardados:
                _borrar_archivo(ruta)
            errores["general"] = "No se pudo registrar el avistamiento, intente nuevamente."
            return render_template(
                "avistamiento.html",
                voluntarios=voluntarios,
                aves=aves,
                errores=errores,
                valores=request.form,
            )

        flash("El avistamiento fue registrado correctamente.")
        return redirect(url_for("inicio"))

    # GET: se puede llegar con un voluntario preseleccionado desde el registro.
    preseleccion = v.validar_entero(request.args.get("voluntario"))
    return render_template(
        "avistamiento.html",
        voluntarios=voluntarios,
        aves=aves,
        errores={},
        valores={},
        preseleccion=preseleccion,
    )


@app.route("/listado")
def listado():
    # La pagina viene por la URL, asi que se valida que sea un entero positivo.
    pagina = v.validar_entero(request.args.get("pagina", "1"))
    if pagina is None or pagina < 1:
        pagina = 1

    avistamientos, total = db.get_avistamientos_pagina(pagina, AVISTAMIENTOS_POR_PAGINA)
    total_paginas = max(1, (total + AVISTAMIENTOS_POR_PAGINA - 1) // AVISTAMIENTOS_POR_PAGINA)
    if pagina > total_paginas:
        pagina = total_paginas
        avistamientos, total = db.get_avistamientos_pagina(pagina, AVISTAMIENTOS_POR_PAGINA)

    return render_template(
        "listado.html",
        avistamientos=avistamientos,
        pagina=pagina,
        total_paginas=total_paginas,
        total=total,
    )


@app.route("/avistamiento/<int:avistamiento_id>")
def detalle(avistamiento_id):
    datos = db.get_avistamiento(avistamiento_id)
    if datos is None:
        return render_template("detalle.html", avistamiento=None), 404
    return render_template("detalle.html", avistamiento=datos)


@app.route("/estadisticas")
def estadisticas():
    # Las metricas quedan pendientes para la siguiente tarea, pero la opcion
    # aparece en el menu de la portada como pide el enunciado.
    return render_template("estadisticas.html")


def _guardar_archivos(archivos):
    # Guarda cada archivo con un nombre unico y seguro, y devuelve una lista de
    # tuplas (nombre_original, nombre_guardado) para insertar en "registro".
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    guardados = []
    for f in archivos:
        nombre_seguro = secure_filename(f.filename)
        marca = datetime.now().strftime("%Y%m%d%H%M%S%f")
        nombre_guardado = marca + "_" + nombre_seguro
        f.save(os.path.join(app.config["UPLOAD_FOLDER"], nombre_guardado))
        guardados.append((f.filename, nombre_guardado))
    return guardados


def _borrar_archivo(nombre_guardado):
    try:
        os.remove(os.path.join(app.config["UPLOAD_FOLDER"], nombre_guardado))
    except OSError:
        pass


if __name__ == "__main__":
    app.run(debug=True)
