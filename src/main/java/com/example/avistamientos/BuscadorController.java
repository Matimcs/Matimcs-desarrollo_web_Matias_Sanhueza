package com.example.avistamientos;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class BuscadorController {
    @Autowired
    private AvistamientoRepository avistamientoRepository;

    @Autowired
    private NotaRepository notaRepository;

    private static final DateTimeFormatter FORMATO_DIA = DateTimeFormatter.ofPattern("dd-MM-yyyy");

    @GetMapping("/buscar")
    List<Map<String, Object>> buscar(@RequestParam(defaultValue = "") String texto) {
        List<Map<String, Object>> resultado = new ArrayList<>();
        texto = texto.trim();
        // si no escribieron nada no se busca
        if (texto.isEmpty() || texto.length() > 80) {
            return resultado;
        }
        for (Avistamiento a : avistamientoRepository.buscar(texto)) {
            Map<String, Object> fila = new HashMap<>();
            fila.put("id", a.getId());
            fila.put("voluntario", a.getVoluntario().getNombre());
            fila.put("dia", a.getFechaHora().format(FORMATO_DIA));
            fila.put("ave", a.getAve().getNombre());
            fila.put("comuna", a.getVoluntario().getComuna().getNombre());
            fila.put("nota", notaRepository.promedio(a.getId()));
            resultado.add(fila);
        }
        return resultado;
    }

    @PostMapping("/nota")
    ResponseEntity<Map<String, Object>> agregarNota(@RequestParam String avistamientoId, @RequestParam String nota) {
        Map<String, Object> respuesta = new HashMap<>();

        // la nota tiene que ser un entero entre 1 y 7
        int valor;
        int id;
        try {
            valor = Integer.parseInt(nota.trim());
            id = Integer.parseInt(avistamientoId.trim());
        } catch (NumberFormatException e) {
            respuesta.put("error", "La nota debe ser un número entero");
            return ResponseEntity.badRequest().body(respuesta);
        }
        if (valor < 1 || valor > 7) {
            respuesta.put("error", "La nota debe estar entre 1 y 7");
            return ResponseEntity.badRequest().body(respuesta);
        }

        Avistamiento avistamiento = avistamientoRepository.findById(id).orElse(null);
        if (avistamiento == null) {
            respuesta.put("error", "El avistamiento no existe");
            return ResponseEntity.badRequest().body(respuesta);
        }

        Nota n = new Nota();
        n.setAvistamiento(avistamiento);
        n.setNota(valor);
        notaRepository.save(n);

        // se devuelve el promedio nuevo para actualizarlo en la pagina
        respuesta.put("promedio", notaRepository.promedio(id));
        return ResponseEntity.ok(respuesta);
    }
}
