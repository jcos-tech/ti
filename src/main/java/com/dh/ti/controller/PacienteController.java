package com.dh.ti.controller;

import com.dh.ti.model.OdontologoModel;
import com.dh.ti.model.PacienteModel;
import com.dh.ti.service.OdontologoService;
import com.dh.ti.service.PacienteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PacienteController {

    @Autowired
    PacienteService pacienteService;

    @PostMapping("paciente")
    public ResponseEntity<PacienteModel> agregar(@Valid @RequestBody PacienteModel pacienteModel) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pacienteService.create(pacienteModel));
    }

    @GetMapping("pacientes")
    public List<PacienteModel> consultar() {
        return pacienteService.all();
    }

    @PutMapping("paciente/{id}")
    public PacienteModel modificar(@PathVariable("id") Integer id, @Valid @RequestBody PacienteModel pacienteModel) {
        return pacienteService.update(id, pacienteModel);
    }

    @DeleteMapping("paciente/{id}")
    public void borrar(@PathVariable("id") Integer id) {
        pacienteService.delete(id);
    }

    @GetMapping("paciente/{id}")
    public PacienteModel encontrarPorId(@PathVariable("id") Integer id) {
        return pacienteService.encontrarPorId(id);
    }


}
