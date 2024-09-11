package com.dh.ti.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dh.ti.model.DomicilioModel;

import java.util.List;

@Repository
public interface IDomicilioRepository extends JpaRepository<DomicilioModel,Integer> {

    List<DomicilioModel> findByCalle(String calle);
    List<DomicilioModel> findByNumero(Integer numero);

}
