package com.dh.ti.service;

import com.dh.ti.exception.ResourceCreatedException;
import com.dh.ti.exception.ResourceNotFoundException;
import com.dh.ti.model.DomicilioModel;
import com.dh.ti.model.OdontologoModel;
import com.dh.ti.model.PacienteModel;
import com.dh.ti.model.TurnoModel;
import com.dh.ti.repository.ITurnoRepository;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TurnoService {

    private static final org.apache.log4j.Logger LOGGER = Logger.getLogger(TurnoService.class);

    @Autowired
    ITurnoRepository iTurnoRepository;

    @Autowired
    OdontologoService odontologoService;

    @Autowired
    PacienteService pacienteService;

    public TurnoModel create(TurnoModel turnoModel) throws ResourceNotFoundException {

        try {

            OdontologoModel odontologoModel = odontologoService.encontrarPorId(turnoModel.getOdontologo().getId());
            PacienteModel pacienteModel = pacienteService.encontrarPorId(turnoModel.getPaciente().getId());

            turnoModel.setOdontologo(odontologoModel);
            turnoModel.setPaciente(pacienteModel);

            return iTurnoRepository.save(turnoModel);

        }catch (DataAccessException e) {
            LOGGER.error(e.getMessage());
            throw new ResourceCreatedException("No se pudo crear el turno");
        }

    }

    public List<TurnoModel> all() {
        return iTurnoRepository.findAll();
    }

    public TurnoModel update(Integer id, TurnoModel turnoModel) throws ResourceNotFoundException {

        Optional<TurnoModel> turnoModelFound = iTurnoRepository.findById(id);

        if (turnoModelFound.isPresent()) {

            try {

                TurnoModel turno = turnoModelFound.get();

                OdontologoModel odontologoModel = odontologoService.encontrarPorId(turnoModel.getOdontologo().getId());
                PacienteModel pacienteModel = pacienteService.encontrarPorId(turnoModel.getPaciente().getId());

                turno.setOdontologo(odontologoModel);
                turno.setPaciente(pacienteModel);
                turno.setFecha(turnoModel.getFecha());

                return iTurnoRepository.save(turno);

            } catch (ResourceNotFoundException e) {

                throw new ResourceNotFoundException(e.getMessage());

            }
        }

        throw new ResourceNotFoundException("No se encontro el turno " + id);
    }

    public void delete(Integer id) {

        Optional<TurnoModel> turnoModelFound = iTurnoRepository.findById(id);

        if (turnoModelFound.isPresent()) {

            TurnoModel turno = turnoModelFound.get();
            iTurnoRepository.delete(turno);

        } else {
            throw new ResourceNotFoundException("No se encontro el turno " + id);
        }

    }

    public TurnoModel encontrarPorId(Integer id) {

        Optional<TurnoModel> turnoModelFound = iTurnoRepository.findById(id);

        if (turnoModelFound.isPresent()) {
            return turnoModelFound.get();
        }

        throw new ResourceNotFoundException("No se encontro el turno " + id);
    }

}
