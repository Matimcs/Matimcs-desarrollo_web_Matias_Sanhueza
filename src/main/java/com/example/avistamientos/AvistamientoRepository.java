package com.example.avistamientos;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AvistamientoRepository extends CrudRepository<Avistamiento, Integer> {

    // busca el texto en el nombre del ave, del voluntario o de la comuna del voluntario
    @Query("select a from Avistamiento a " +
            "where lower(a.ave.nombre) like lower(concat('%', :texto, '%')) " +
            "or lower(a.voluntario.nombre) like lower(concat('%', :texto, '%')) " +
            "or lower(a.voluntario.comuna.nombre) like lower(concat('%', :texto, '%')) " +
            "order by a.fechaHora desc")
    List<Avistamiento> buscar(@Param("texto") String texto);
}
