package com.example.avistamientos;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Nota {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "avistamiento_id")
    private Avistamiento avistamiento;

    private Integer nota;

    public Integer getId() {
        return id;
    }

    public Avistamiento getAvistamiento() {
        return avistamiento;
    }

    public void setAvistamiento(Avistamiento avistamiento) {
        this.avistamiento = avistamiento;
    }

    public Integer getNota() {
        return nota;
    }

    public void setNota(Integer nota) {
        this.nota = nota;
    }
}
