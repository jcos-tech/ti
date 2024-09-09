package com.dh.ti.controller;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.dh.ti.model.DomicilioModel;
import com.dh.ti.service.DomicilioService;

@Validated
@RestController
public class DomicilioController {

    @Autowired
    DomicilioService domicilioService;

    @PostMapping("domicilio")
    public ResponseEntity<DomicilioModel> agregar(@Valid @RequestBody DomicilioModel domicilioModel) {
        return ResponseEntity.status(HttpStatus.CREATED).body(domicilioService.create(domicilioModel));
    }

    @GetMapping("domicilios")
    public List<DomicilioModel> consultar() {
        return domicilioService.all();
    }

    @PutMapping("domicilio/{id}")
    public DomicilioModel modificar(@PathVariable("id") Integer id, @Valid @RequestBody DomicilioModel domicilioModel) {
        return domicilioService.update(id, domicilioModel);
    }

    @DeleteMapping("domicilio/{id}")
    public void borrar(@PathVariable("id") Integer id) {
        domicilioService.delete(id);
    }

    @GetMapping("domicilio/{id}")
    public DomicilioModel encontrarPorId(@PathVariable("id") Integer id) {
        return domicilioService.encontrarPorId(id);
    }

}
