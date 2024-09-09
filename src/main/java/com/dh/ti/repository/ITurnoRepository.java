package com.dh.ti.repository;

import com.dh.ti.model.TurnoModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ITurnoRepository extends JpaRepository<TurnoModel,Integer> {
}
