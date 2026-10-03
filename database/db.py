import os
from datetime import datetime

from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship

# Credenciales pedidas en el enunciado. Dejo la cadena de conexion en una
# variable de entorno para poder probar la aplicacion con otra base de datos
# sin tocar el codigo, pero por defecto apunta a la base "tarea2" en MySQL.
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306
DB_NAME = "tarea2"

DATABASE_URL = os.environ.get(
    "TAREA2_DATABASE_URL",
    f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}",
)

engine = create_engine(DATABASE_URL, echo=False, future=True)
Session = sessionmaker(bind=engine)

Base = declarative_base()


# --- Modelos (siguen las tablas de tarea2.sql) ---

class Region(Base):
    __tablename__ = "region"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)

    comunas = relationship("Comuna", back_populates="region")


class Comuna(Base):
    __tablename__ = "comuna"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(Integer, ForeignKey("region.id"), nullable=False)

    region = relationship("Region", back_populates="comunas")


class Voluntario(Base):
    __tablename__ = "voluntario"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    email = Column(String(80), nullable=False)
    telefono = Column(String(15), nullable=False)
    fecha_registro = Column(DateTime, nullable=False)
    comuna_id = Column(Integer, ForeignKey("comuna.id"), nullable=False)

    comuna = relationship("Comuna")


class Ave(Base):
    __tablename__ = "ave"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(80), nullable=False)


class Avistamiento(Base):
    __tablename__ = "avistamiento"

    id = Column(Integer, primary_key=True, autoincrement=True)
    voluntario_id = Column(Integer, ForeignKey("voluntario.id"), nullable=False)
    ave_id = Column(Integer, ForeignKey("ave.id"), nullable=False)
    fecha_hora = Column(DateTime, nullable=False)
    lugar = Column(String(200), nullable=False)
    descripcion = Column(Text, nullable=True)

    voluntario = relationship("Voluntario")
    ave = relationship("Ave")
    registros = relationship("Registro", back_populates="avistamiento")


class Registro(Base):
    __tablename__ = "registro"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    avistamiento_id = Column(Integer, ForeignKey("avistamiento.id"), nullable=False)

    avistamiento = relationship("Avistamiento", back_populates="registros")


# --- Funciones de consulta ---

def get_regiones():
    session = Session()
    regiones = session.query(Region).order_by(Region.nombre).all()
    session.close()
    return regiones


def get_regiones_con_comunas():
    # Devuelve una estructura simple para armar los select dependientes en el
    # navegador: una lista de regiones y, dentro, sus comunas.
    session = Session()
    regiones = session.query(Region).order_by(Region.nombre).all()
    datos = []
    for r in regiones:
        comunas = sorted(r.comunas, key=lambda c: c.nombre)
        datos.append({
            "id": r.id,
            "nombre": r.nombre,
            "comunas": [{"id": c.id, "nombre": c.nombre} for c in comunas],
        })
    session.close()
    return datos


def get_aves():
    session = Session()
    aves = session.query(Ave).order_by(Ave.nombre).all()
    session.close()
    return aves


def get_voluntarios():
    session = Session()
    voluntarios = session.query(Voluntario).order_by(Voluntario.nombre).all()
    session.close()
    return voluntarios


def comuna_existe(comuna_id):
    session = Session()
    comuna = session.query(Comuna).filter_by(id=comuna_id).first()
    session.close()
    return comuna is not None


def ave_existe(ave_id):
    session = Session()
    ave = session.query(Ave).filter_by(id=ave_id).first()
    session.close()
    return ave is not None


def voluntario_existe(voluntario_id):
    session = Session()
    voluntario = session.query(Voluntario).filter_by(id=voluntario_id).first()
    session.close()
    return voluntario is not None


def crear_voluntario(nombre, email, telefono, comuna_id):
    # La fecha_registro se guarda con la fecha y hora del momento de insertar.
    session = Session()
    nuevo = Voluntario(
        nombre=nombre,
        email=email,
        telefono=telefono,
        fecha_registro=datetime.now(),
        comuna_id=comuna_id,
    )
    try:
        session.add(nuevo)
        session.commit()
        nuevo_id = nuevo.id
        session.close()
        return nuevo_id
    except Exception:
        session.rollback()
        session.close()
        return None


def crear_avistamiento(voluntario_id, ave_id, fecha_hora, lugar, descripcion, archivos):
    # Inserta el avistamiento y luego una fila en "registro" por cada archivo.
    # archivos es una lista de tuplas (nombre_archivo, ruta_archivo).
    session = Session()
    nuevo = Avistamiento(
        voluntario_id=voluntario_id,
        ave_id=ave_id,
        fecha_hora=fecha_hora,
        lugar=lugar,
        descripcion=descripcion,
    )
    try:
        session.add(nuevo)
        session.flush()  # para obtener el id del avistamiento antes del commit
        for nombre_archivo, ruta_archivo in archivos:
            session.add(Registro(
                nombre_archivo=nombre_archivo,
                ruta_archivo=ruta_archivo,
                avistamiento_id=nuevo.id,
            ))
        session.commit()
        nuevo_id = nuevo.id
        session.close()
        return nuevo_id
    except Exception:
        session.rollback()
        session.close()
        return None


def get_ultimos_avistamientos(cantidad):
    session = Session()
    avistamientos = (
        session.query(Avistamiento)
        .order_by(Avistamiento.id.desc())
        .limit(cantidad)
        .all()
    )
    datos = [_avistamiento_resumen(a) for a in avistamientos]
    session.close()
    return datos


def get_avistamientos_pagina(pagina, por_pagina):
    # Devuelve (lista_de_la_pagina, total_de_avistamientos) para la paginacion.
    session = Session()
    total = session.query(Avistamiento).count()
    avistamientos = (
        session.query(Avistamiento)
        .order_by(Avistamiento.fecha_hora.desc())
        .offset((pagina - 1) * por_pagina)
        .limit(por_pagina)
        .all()
    )
    datos = [_avistamiento_resumen(a) for a in avistamientos]
    session.close()
    return datos, total


def get_avistamiento(avistamiento_id):
    session = Session()
    a = session.query(Avistamiento).filter_by(id=avistamiento_id).first()
    if a is None:
        session.close()
        return None
    datos = {
        "id": a.id,
        "ave": a.ave.nombre,
        "lugar": a.lugar,
        "fecha_hora": a.fecha_hora,
        "descripcion": a.descripcion,
        "voluntario": a.voluntario.nombre,
        "archivos": [
            {"nombre": r.nombre_archivo, "ruta": r.ruta_archivo}
            for r in a.registros
        ],
    }
    session.close()
    return datos


def _avistamiento_resumen(a):
    # Diccionario con lo que se muestra en el listado y la portada.
    return {
        "id": a.id,
        "ave": a.ave.nombre,
        "lugar": a.lugar,
        "fecha_hora": a.fecha_hora,
        "voluntario": a.voluntario.nombre,
    }
