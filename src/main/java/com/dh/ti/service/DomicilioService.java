package com.dh.ti.service;

import java.util.List;
import java.util.Optional;

import com.dh.ti.exception.ResourceCreatedException;
import com.dh.ti.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.apache.log4j.Logger;
import com.dh.ti.model.DomicilioModel;
import com.dh.ti.repository.IDomicilioRepository;

@Service
public class DomicilioService {

    private static final org.apache.log4j.Logger LOGGER = Logger.getLogger(DomicilioService.class);

    @Autowired
    IDomicilioRepository iDomicilioRepository;

    public DomicilioModel create(DomicilioModel domicilioModel) {

        if (!iDomicilioRepository.findByCalle(domicilioModel.getCalle()).isEmpty() && !iDomicilioRepository.findByNumero(domicilioModel.getNumero()).isEmpty()) {
            throw new ResourceCreatedException("No se puede crear la direccion");
        }

        return iDomicilioRepository.save(domicilioModel);
    }

    public List<DomicilioModel> todos() {
        return iDomicilioRepository.findAll();
    }

    public DomicilioModel update(Integer id, DomicilioModel domicilioModel) throws ResourceNotFoundException {

        Optional<DomicilioModel> domicilioModelFound = iDomicilioRepository.findById(id);

        if (domicilioModelFound.isPresent()) {

            DomicilioModel domicilio = domicilioModelFound.get();

            domicilio.setCalle(domicilioModel.getCalle());
            domicilio.setNumero(domicilioModel.getNumero());
            domicilio.setLocalidad(domicilioModel.getLocalidad());
            domicilio.setProvincia(domicilioModel.getProvincia());

            return iDomicilioRepository.save(domicilio);

        }

        throw new ResourceNotFoundException("No se encontro el domicilio " + id);

    }

    public void delete(Integer id) {

        Optional<DomicilioModel> domicilioModelFound = iDomicilioRepository.findById(id);

        if (domicilioModelFound.isPresent()) {

            DomicilioModel domicilio = domicilioModelFound.get();
            iDomicilioRepository.delete(domicilio);

        } else {
            throw new ResourceNotFoundException("No se encontro el domicilio " + id);
        }

    }

    public DomicilioModel encontrarPorId(Integer id) {

        Optional<DomicilioModel> domicilioModelFound = iDomicilioRepository.findById(id);

        if (domicilioModelFound.isPresent()) {
            return domicilioModelFound.get();
        }

        throw new ResourceNotFoundException("No se encontro el domicilio " + id);
    }

}
