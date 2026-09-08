// Datos de ejemplo para el prototipo. Como en esta tarea no se guarda nada,
// dejo aca una lista fija de avistamientos y los tipos de ave para poder
// mostrar el listado, los filtros y las metricas.

// Tipos (categorias) de ave que ofrece el sistema.
var tiposDeAve = [
  "Rapaz",
  "Ave acuática",
  "Ave marina",
  "Paseriforme",
  "Colibrí",
  "Loro",
  "Carpintero",
  "Otra"
];

// Sugerencias de nombres para el datalist del formulario de avistamiento.
var avesComunes = [
  "Cóndor andino", "Aguilucho", "Peuco", "Cernícalo", "Tiuque", "Jote de cabeza colorada",
  "Bandurria", "Garza grande", "Pato jergón", "Tagua", "Cisne de cuello negro", "Pelícano",
  "Gaviota dominicana", "Pilpilén", "Chincol", "Zorzal", "Loica", "Tenca", "Diuca", "Chercán",
  "Picaflor gigante", "Picaflor chico", "Cachudito", "Rayadito", "Carpinterito", "Cachaña"
];

// Avistamientos de ejemplo. La fecha va en formato ISO para poder ordenarla.
var avistamientos = [
  { ave: "Cóndor andino", tipo: "Rapaz", lugar: "Farellones", region: "Metropolitana", fecha: "2026-07-14T09:30", voluntario: "Camila Rojas" },
  { ave: "Bandurria", tipo: "Ave acuática", lugar: "Humedal Batuco", region: "Metropolitana", fecha: "2026-08-02T07:45", voluntario: "Diego Fuentes" },
  { ave: "Pelícano", tipo: "Ave marina", lugar: "Caleta Portales", region: "Valparaíso", fecha: "2026-08-19T18:10", voluntario: "Camila Rojas" },
  { ave: "Picaflor gigante", tipo: "Colibrí", lugar: "Jardín Botánico", region: "Valparaíso", fecha: "2026-06-21T11:00", voluntario: "Ignacio Pérez" },
  { ave: "Loica", tipo: "Paseriforme", lugar: "Laguna Torca", region: "Maule", fecha: "2026-05-30T16:20", voluntario: "Fernanda Soto" },
  { ave: "Cisne de cuello negro", tipo: "Ave acuática", lugar: "Río Cruces", region: "Los Ríos", fecha: "2026-08-11T08:15", voluntario: "Matías González" },
  { ave: "Aguilucho", tipo: "Rapaz", lugar: "Cajón del Maipo", region: "Metropolitana", fecha: "2026-07-28T13:40", voluntario: "Diego Fuentes" },
  { ave: "Chincol", tipo: "Paseriforme", lugar: "Parque Quinta Normal", region: "Metropolitana", fecha: "2026-08-25T10:05", voluntario: "Fernanda Soto" },
  { ave: "Tagua", tipo: "Ave acuática", lugar: "Laguna El Peral", region: "Valparaíso", fecha: "2026-04-17T15:30", voluntario: "Ignacio Pérez" },
  { ave: "Gaviota dominicana", tipo: "Ave marina", lugar: "Playa de Cavancha", region: "Tarapacá", fecha: "2026-08-06T19:00", voluntario: "Camila Rojas" },
  { ave: "Zorzal", tipo: "Paseriforme", lugar: "Cerro San Cristóbal", region: "Metropolitana", fecha: "2026-08-30T07:20", voluntario: "Matías González" },
  { ave: "Cachaña", tipo: "Loro", lugar: "Parque Katalapi", region: "Los Lagos", fecha: "2026-03-12T12:50", voluntario: "Valentina Muñoz" },
  { ave: "Peuco", tipo: "Rapaz", lugar: "Reserva Río Clarillo", region: "Metropolitana", fecha: "2026-07-05T14:10", voluntario: "Ignacio Pérez" },
  { ave: "Garza grande", tipo: "Ave acuática", lugar: "Humedal de Mantagua", region: "Valparaíso", fecha: "2026-08-14T09:00", voluntario: "Fernanda Soto" },
  { ave: "Tenca", tipo: "Paseriforme", lugar: "Valle del Elqui", region: "Coquimbo", fecha: "2026-06-08T17:35", voluntario: "Valentina Muñoz" },
  { ave: "Carpinterito", tipo: "Carpintero", lugar: "Parque Nahuelbuta", region: "La Araucanía", fecha: "2026-05-02T11:25", voluntario: "Matías González" },
  { ave: "Pato jergón", tipo: "Ave acuática", lugar: "Laguna Grande", region: "Biobío", fecha: "2026-08-21T08:40", voluntario: "Diego Fuentes" },
  { ave: "Jote de cabeza colorada", tipo: "Rapaz", lugar: "Valle de Lluta", region: "Arica y Parinacota", fecha: "2026-07-19T13:00", voluntario: "Camila Rojas" },
  { ave: "Picaflor chico", tipo: "Colibrí", lugar: "Parque Bicentenario", region: "Metropolitana", fecha: "2026-08-28T10:50", voluntario: "Fernanda Soto" },
  { ave: "Pilpilén", tipo: "Ave marina", lugar: "Playa Cachagua", region: "Valparaíso", fecha: "2026-08-09T18:30", voluntario: "Valentina Muñoz" },
  { ave: "Diuca", tipo: "Paseriforme", lugar: "Parque O'Higgins", region: "Metropolitana", fecha: "2026-08-01T09:15", voluntario: "Ignacio Pérez" },
  { ave: "Cernícalo", tipo: "Rapaz", lugar: "Campo Dunar", region: "Valparaíso", fecha: "2026-07-23T16:45", voluntario: "Matías González" },
  { ave: "Chercán", tipo: "Paseriforme", lugar: "Bosque Fray Jorge", region: "Coquimbo", fecha: "2026-06-15T08:05", voluntario: "Diego Fuentes" },
  { ave: "Rayadito", tipo: "Paseriforme", lugar: "Parque Oncol", region: "Los Ríos", fecha: "2026-05-27T10:35", voluntario: "Valentina Muñoz" },
  { ave: "Tiuque", tipo: "Rapaz", lugar: "Isla Grande de Chiloé", region: "Los Lagos", fecha: "2026-08-17T12:20", voluntario: "Camila Rojas" }
];

// Voluntarios registrados de ejemplo (para las metricas por region).
var voluntarios = [
  { nombre: "Camila Rojas", region: "Metropolitana" },
  { nombre: "Diego Fuentes", region: "Metropolitana" },
  { nombre: "Ignacio Pérez", region: "Valparaíso" },
  { nombre: "Fernanda Soto", region: "Metropolitana" },
  { nombre: "Matías González", region: "Los Ríos" },
  { nombre: "Valentina Muñoz", region: "Los Lagos" },
  { nombre: "Rodrigo Vera", region: "Biobío" },
  { nombre: "Antonia Silva", region: "Coquimbo" },
  { nombre: "Joaquín Díaz", region: "Valparaíso" },
  { nombre: "Josefa Castro", region: "La Araucanía" }
];
