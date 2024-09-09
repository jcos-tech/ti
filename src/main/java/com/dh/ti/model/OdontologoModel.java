package com.dh.ti.model;

import java.io.Serializable;
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
@Table(name = "odontologo")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OdontologoModel implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull(message = "matricula no debe ser vacio")
    private String matricula;
    @NotNull(message = "nombre no debe ser vacio")
    private String nombre;
    @NotNull(message = "apellido no debe ser vacio")
    private String apellido;
    @OneToOne
    @NotNull(message = "Domicilio es necesario")
    private DomicilioModel domicilio;

}
