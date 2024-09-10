package com.dh.ti.controller;

import com.dh.ti.model.DomicilioModel;
import com.dh.ti.model.OdontologoModel;
import com.dh.ti.model.PacienteModel;
import com.dh.ti.service.OdontologoService;
import com.dh.ti.service.PacienteService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
class PacienteControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private PacienteService pacienteService;

    private DomicilioModel domicilioModel = new DomicilioModel();
    private PacienteModel pacienteModel = new PacienteModel();
    private List<PacienteModel> lista = new ArrayList<>();

    @Before
    public void inicio() throws Exception {

        domicilioModel.setId(1);
        domicilioModel.setCalle("Calle 2");
        domicilioModel.setNumero(3);
        domicilioModel.setLocalidad("localidad 2");
        domicilioModel.setProvincia("provincia 3");

        pacienteModel.setId(1);
        pacienteModel.setDni("0001");
        pacienteModel.setNombre("Jesus");
        pacienteModel.setApellido("Solis");
        pacienteModel.setDomicilio(domicilioModel);
        pacienteModel.setAlta(LocalDate.parse("2024-08-29"));

        lista.add(pacienteModel);
    }

    @Test
    public void agregar() throws Exception {

        pacienteModel.setDni("0001");
        pacienteModel.setNombre("Jesus");
        pacienteModel.setApellido("Solis");
        pacienteModel.setDomicilio(domicilioModel);
        pacienteModel.setAlta(LocalDate.parse("2024-08-29"));

        String requestBody = objectMapper.writeValueAsString(pacienteModel);

        mockMvc.perform(post("/paciente").contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andDo(print());
    }

    @Test
    public void modificar() throws Exception {

        pacienteModel.setDni("0001");
        pacienteModel.setNombre("Cristian");
        pacienteModel.setApellido("Olvera");
        pacienteModel.setDomicilio(domicilioModel);
        pacienteModel.setAlta(LocalDate.parse("2024-08-30"));

        String requestBody = objectMapper.writeValueAsString(pacienteModel);

        mockMvc.perform(put("/paciente/1").contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    public void listar() throws Exception {

        String requestBody = objectMapper.writeValueAsString(lista);

        mockMvc.perform(MockMvcRequestBuilders.
                        get("/pacientes")).
                andExpect(MockMvcResultMatchers.status().isOk()).
                andExpect(MockMvcResultMatchers.content().string(requestBody));

    }

    @Test
    public void borrar() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders.
                        delete("/paciente/1")).
                andExpect(MockMvcResultMatchers.status().isOk());

    }

}