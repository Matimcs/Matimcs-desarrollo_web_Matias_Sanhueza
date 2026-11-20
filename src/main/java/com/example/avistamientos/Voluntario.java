package com.example.avistamientos;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Voluntario {
    @Id
    private Integer id;
    private String nombre;

    @ManyToOne
    @JoinColumn(name = "comuna_id")
    private Comuna comuna;

    public Integer getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public Comuna getComuna() {
        return comuna;
    }
}
