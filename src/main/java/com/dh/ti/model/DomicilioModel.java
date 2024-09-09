package com.dh.ti.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "domicilio")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DomicilioModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull(message = "Debe proporcionarse una calle")
    private String calle;
    @NotNull(message = "Debe proporcionarse un numero")
    private Integer numero;
    @NotNull(message = "Debe proporcionarse una localidad")
    private String localidad;
    @NotNull(message = "Debe proporcionarse una privincia")
    private String provincia;

}
