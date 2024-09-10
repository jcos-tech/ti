package com.dh.ti.controller;

import com.dh.ti.model.DomicilioModel;
import com.dh.ti.model.TurnoModel;
import com.dh.ti.service.DomicilioService;
import com.dh.ti.service.TurnoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TurnoController {

    @Autowired
    TurnoService turnoService;

    @PostMapping("turno")
    public ResponseEntity<TurnoModel> agregar(@Valid @RequestBody TurnoModel turnoModel) {
        return ResponseEntity.status(HttpStatus.CREATED).body(turnoService.create(turnoModel));
    }

    @GetMapping("turnos")
    public List<TurnoModel> consultar() {
        return turnoService.todos();
    }

    @PutMapping("turno/{id}")
    public TurnoModel modificar(@PathVariable("id") Integer id, @Valid @RequestBody TurnoModel turnoModel) {
        return turnoService.update(id, turnoModel);
    }

    @DeleteMapping("turno/{id}")
    public void borrar(@PathVariable("id") Integer id) {
        turnoService.delete(id);
    }

    @GetMapping("turno/{id}")
    public TurnoModel encontrarPorId(@PathVariable("id") Integer id) {
        return turnoService.encontrarPorId(id);
    }

}
