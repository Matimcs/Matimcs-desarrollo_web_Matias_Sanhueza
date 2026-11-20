package com.example.avistamientos;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Comuna {
    @Id
    private Integer id;
    private String nombre;

    public Integer getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }
}
