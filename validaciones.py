import re
from datetime import datetime

# Validaciones del lado del servidor. Son las mismas reglas que se aplican en
# JavaScript, pero repetidas aca porque nunca hay que confiar en que el
# formulario llego "limpio" desde el navegador.

PATRON_NOMBRE = re.compile(r"^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$")
PATRON_EMAIL = re.compile(r"^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$")

EXTENSIONES_PERMITIDAS = {
    "jpg", "jpeg", "png", "gif", "webp",   # imagenes
    "mp4", "mov", "avi", "webm", "mkv",    # videos
}

# Cuantos anios hacia atras se acepta un avistamiento.
MAX_ANIOS_PASADO = 30


def _texto(valor):
    return (valor or "").strip()


def validar_nombre(valor):
    return bool(PATRON_NOMBRE.match(_texto(valor)))


def validar_email(valor):
    return bool(PATRON_EMAIL.match(_texto(valor)))


def validar_celular(valor):
    limpio = re.sub(r"[ .\-]", "", valor or "")
    return bool(re.match(r"^(\+?56)?9\d{8}$", limpio))


def validar_entero(valor):
    # Devuelve el entero si el texto es un entero valido, o None si no lo es.
    # Sirve para los id que llegan desde los formularios o la URL.
    try:
        return int(valor)
    except (TypeError, ValueError):
        return None


def validar_lugar(valor):
    return len(_texto(valor)) >= 3


def validar_fecha(valor):
    # El input datetime-local llega como "AAAA-MM-DDTHH:MM". Se valida que no
    # sea futura ni mas antigua que MAX_ANIOS_PASADO. Devuelve el datetime o None.
    texto = _texto(valor)
    if not texto:
        return None
    try:
        fecha = datetime.strptime(texto, "%Y-%m-%dT%H:%M")
    except ValueError:
        return None
    ahora = datetime.now()
    if fecha > ahora:
        return None
    limite = ahora.replace(year=ahora.year - MAX_ANIOS_PASADO)
    if fecha < limite:
        return None
    return fecha


def extension_permitida(nombre_archivo):
    if "." not in nombre_archivo:
        return False
    extension = nombre_archivo.rsplit(".", 1)[1].lower()
    return extension in EXTENSIONES_PERMITIDAS


def validar_registro(form):
    # Valida el formulario de voluntario. Devuelve un diccionario de errores
    # (vacio si todo esta bien).
    errores = {}
    if not validar_nombre(form.get("nombre")):
        errores["nombre"] = "Ingrese sus nombres (solo letras)."
    if not validar_nombre(form.get("apellido")):
        errores["apellido"] = "Ingrese sus apellidos (solo letras)."
    if not validar_email(form.get("email")):
        errores["email"] = "Ingrese un correo válido, por ejemplo nombre@correo.cl"
    if not validar_celular(form.get("celular")):
        errores["celular"] = "Ingrese un celular chileno válido, por ejemplo +56 9 1234 5678."
    if validar_entero(form.get("region")) is None:
        errores["region"] = "Seleccione una región."
    if validar_entero(form.get("comuna")) is None:
        errores["comuna"] = "Seleccione una comuna."
    return errores
