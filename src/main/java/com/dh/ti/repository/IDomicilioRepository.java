package com.dh.ti.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dh.ti.model.DomicilioModel;

@Repository
public interface IDomicilioRepository extends JpaRepository<DomicilioModel,Integer> {

    DomicilioModel findByCalle(String calle);
    DomicilioModel findByNumero(Integer numero);
    DomicilioModel findByLocalidad(String localidad);
    DomicilioModel findByProvincia(String provincia);

}
