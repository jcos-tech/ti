package com.dh.ti.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "turno")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TurnoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    private OdontologoModel odontologo;
    @ManyToOne
    private PacienteModel paciente;
    @NotNull(message = "Fecha no debe ser vacia")
    private LocalDate fecha;

}

