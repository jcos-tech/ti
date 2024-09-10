package com.dh.ti.service;

import com.dh.ti.exception.ResourceCreatedException;
import com.dh.ti.exception.ResourceNotFoundException;
import com.dh.ti.model.DomicilioModel;
import com.dh.ti.model.OdontologoModel;
import com.dh.ti.repository.IOdontologoRepository;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OdontologoService {

    private static final org.apache.log4j.Logger LOGGER = Logger.getLogger(OdontologoService.class);

    @Autowired
    IOdontologoRepository iOdontologoRepository;

    @Autowired
    DomicilioService domicilioService;

    public OdontologoModel create(OdontologoModel odontologoModel) {

        try {

            DomicilioModel domicilioModel = domicilioService.encontrarPorId(odontologoModel.getDomicilio().getId());

            odontologoModel.setDomicilio(domicilioModel);
            return iOdontologoRepository.save(odontologoModel);

        } catch (DataAccessException e) {
            LOGGER.error(e.getMessage());
            throw new ResourceCreatedException("No se pudo crear el odontologo");
        }

    }

    public List<OdontologoModel> todos() {
        return iOdontologoRepository.findAll();
    }

    public OdontologoModel update(Integer id, OdontologoModel odontologoModel) throws ResourceNotFoundException {

        Optional<OdontologoModel> odontologoModelFound = iOdontologoRepository.findById(id);

        if (odontologoModelFound.isPresent()) {

            OdontologoModel odontologo = odontologoModelFound.get();

            odontologo.setMatricula(odontologoModel.getMatricula());
            odontologo.setNombre(odontologoModel.getNombre());
            odontologo.setApellido(odontologoModel.getApellido());

            DomicilioModel domicilioModel = domicilioService.encontrarPorId(id);
            odontologo.setDomicilio(domicilioModel);

            try {
                return iOdontologoRepository.save(odontologo);
            } catch (DataAccessException e) {
                LOGGER.error(e.getMessage());
                throw new ResourceCreatedException("No se pudo actualizar el odontologo");
            }


        }

        throw new ResourceNotFoundException("No se encontro el odontologo " + odontologoModel.getMatricula());

    }

    public void delete(Integer id) {

        Optional<OdontologoModel> odontologoModelFound = iOdontologoRepository.findById(id);

        if (odontologoModelFound.isPresent()) {

            OdontologoModel odontologo = odontologoModelFound.get();
            iOdontologoRepository.delete(odontologo);

        } else {
            throw new ResourceNotFoundException("No se encontro el odontologo para borrar");
        }

    }

    public OdontologoModel encontrarPorId(Integer id) {

        Optional<OdontologoModel> odontologoModelFound = iOdontologoRepository.findById(id);

        if (odontologoModelFound.isPresent()) {
            return odontologoModelFound.get();
        }

        throw new ResourceNotFoundException("No se encontro el odontologo");
    }

}
