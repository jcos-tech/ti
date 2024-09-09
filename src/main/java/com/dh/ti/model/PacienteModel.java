package com.dh.ti.model;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "paciente")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PacienteModel implements Serializable {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @NotEmpty(message = "dni no debe ser vacio")
    private String dni;
    @NotNull(message = "nombre no debe ser vacio")
    private String nombre;
    @NotNull(message = "apellido no debe ser vacio")
    private String apellido;
    @NotNull(message = "alta no debe ser vacia")
    private LocalDate alta;
    @OneToOne
    @NotNull(message = "Domicilio es necesario")
    private DomicilioModel domicilio;

}
