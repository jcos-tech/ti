package com.dh.ti.service;

import com.dh.ti.exception.ResourceCreatedException;
import com.dh.ti.exception.ResourceNotFoundException;
import com.dh.ti.model.DomicilioModel;
import com.dh.ti.model.PacienteModel;
import com.dh.ti.repository.IPacienteRepository;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PacienteService {

    private static final org.apache.log4j.Logger LOGGER = Logger.getLogger(PacienteService.class);

    @Autowired
    IPacienteRepository iPacienteRepository;

    @Autowired
    DomicilioService domicilioService;

    public PacienteModel create(PacienteModel pacienteModel) {

        try {

            DomicilioModel domicilioModel = domicilioService.encontrarPorId(pacienteModel.getDomicilio().getId());
            pacienteModel.setDomicilio(domicilioModel);

            return iPacienteRepository.save(pacienteModel);
        } catch (DataAccessException e) {
            LOGGER.error(e.getMessage());
            throw new ResourceCreatedException("No se pudo crear el paciente");
        }

    }

    public List<PacienteModel> todos() {
        return iPacienteRepository.findAll();
    }

    public PacienteModel update(Integer id, PacienteModel pacienteModel) throws ResourceNotFoundException {

        Optional<PacienteModel> odontologoModelFound = iPacienteRepository.findById(id);

        if (odontologoModelFound.isPresent()) {

            PacienteModel paciente = odontologoModelFound.get();

            paciente.setDni(pacienteModel.getDni());
            paciente.setNombre(pacienteModel.getNombre());
            paciente.setApellido(pacienteModel.getApellido());
            paciente.setAlta(pacienteModel.getAlta());

            DomicilioModel domicilioModel = domicilioService.encontrarPorId(pacienteModel.getDomicilio().getId());
            paciente.setDomicilio(domicilioModel);

            try {
                return iPacienteRepository.save(paciente);
            } catch (DataAccessException e) {
                LOGGER.error(e.getMessage());
                throw new ResourceCreatedException("No se pudo actualizar el paciente");
            }

        }

        throw new ResourceNotFoundException("No se encontro el paciente " + pacienteModel.getDni());

    }

    public void delete(Integer id) {

        Optional<PacienteModel> pacienteModelFound = iPacienteRepository.findById(id);

        if (pacienteModelFound.isPresent()) {

            PacienteModel paciente = pacienteModelFound.get();
            iPacienteRepository.delete(paciente);

        } else {
            throw new ResourceNotFoundException("No se encontro el paciente para borrar");
        }

    }

    public PacienteModel encontrarPorId(Integer id) {

        Optional<PacienteModel> pacienteModelFound = iPacienteRepository.findById(id);

        if (pacienteModelFound.isPresent()) {
            return pacienteModelFound.get();
        }

        throw new ResourceNotFoundException("No se encontro el paciente");
    }

}
