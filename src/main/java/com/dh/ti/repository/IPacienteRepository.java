package com.dh.ti.repository;

import com.dh.ti.model.PacienteModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IPacienteRepository extends JpaRepository<PacienteModel,Integer> {
}
