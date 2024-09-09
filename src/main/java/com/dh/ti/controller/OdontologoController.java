package com.dh.ti.controller;

import com.dh.ti.model.OdontologoModel;
import com.dh.ti.service.OdontologoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class OdontologoController {

    @Autowired
    OdontologoService odontologoService;

    @PostMapping("odontologo")
    public ResponseEntity<OdontologoModel> agregar(@Valid @RequestBody OdontologoModel odontologoModel) {
        return ResponseEntity.status(HttpStatus.CREATED).body(odontologoService.create(odontologoModel));
    }

    @GetMapping("odontologos")
    public List<OdontologoModel> consultar() {
        return odontologoService.all();
    }

    @PutMapping("odontologo/{id}")
    public OdontologoModel modificar(@PathVariable("id") Integer id, @Valid @RequestBody OdontologoModel odontologoModel) {
        return odontologoService.update(id, odontologoModel);
    }

    @DeleteMapping("odontologo/{id}")
    public void borrar(@PathVariable("id") Integer id) {
        odontologoService.delete(id);
    }

    @GetMapping("odontologo/{id}")
    public OdontologoModel encontrarPorId(@PathVariable("id") Integer id) {
        return odontologoService.encontrarPorId(id);
    }


}
