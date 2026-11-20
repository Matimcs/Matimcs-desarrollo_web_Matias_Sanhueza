package com.example.avistamientos;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;

@Entity
public class Avistamiento {
    @Id
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "voluntario_id")
    private Voluntario voluntario;

    @ManyToOne
    @JoinColumn(name = "ave_id")
    private Ave ave;

    private LocalDateTime fechaHora;
    private String lugar;

    public Integer getId() {
        return id;
    }

    public Voluntario getVoluntario() {
        return voluntario;
    }

    public Ave getAve() {
        return ave;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public String getLugar() {
        return lugar;
    }
}
