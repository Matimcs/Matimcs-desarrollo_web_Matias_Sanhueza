package com.example.avistamientos;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface NotaRepository extends CrudRepository<Nota, Integer> {

    // promedio de las notas de un avistamiento (null si no tiene notas)
    @Query("select avg(n.nota) from Nota n where n.avistamiento.id = :id")
    Double promedio(@Param("id") Integer id);
}
