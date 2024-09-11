package com.dh.ti.repository;

import com.dh.ti.model.OdontologoModel;
import com.dh.ti.model.PacienteModel;
import com.dh.ti.model.TurnoModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ITurnoRepository extends JpaRepository<TurnoModel,Integer> {

    List<TurnoModel> findByFecha(LocalDate fecha);
    List<TurnoModel> findByOdontologo(OdontologoModel odontologoModel);
    List<TurnoModel> findByPaciente(PacienteModel pacienteModel);

}
