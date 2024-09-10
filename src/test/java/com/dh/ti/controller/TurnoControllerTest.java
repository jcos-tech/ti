package com.dh.ti.controller;

import com.dh.ti.model.DomicilioModel;
import com.dh.ti.model.OdontologoModel;
import com.dh.ti.model.PacienteModel;
import com.dh.ti.model.TurnoModel;
import com.dh.ti.service.PacienteService;
import com.dh.ti.service.TurnoService;
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
class TurnoControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private TurnoService turnoService;

    private DomicilioModel domicilioModel = new DomicilioModel();
    private OdontologoModel odontologoModel = new OdontologoModel();
    private PacienteModel pacienteModel = new PacienteModel();
    private List<TurnoModel> lista = new ArrayList<>();

    @Before
    public void inicio() throws Exception {

        domicilioModel.setId(1);
        domicilioModel.setCalle("Calle 2");
        domicilioModel.setNumero(3);
        domicilioModel.setLocalidad("localidad 2");
        domicilioModel.setProvincia("provincia 3");

        odontologoModel.setId(1);
        odontologoModel.setMatricula("AABC");
        odontologoModel.setNombre("Jesus");
        odontologoModel.setApellido("Solis");
        odontologoModel.setDomicilio(domicilioModel);

        pacienteModel.setId(1);
        pacienteModel.setDni("0001");
        pacienteModel.setNombre("Jesus");
        pacienteModel.setApellido("Solis");
        pacienteModel.setDomicilio(domicilioModel);
        pacienteModel.setAlta(LocalDate.parse("2024-08-29"));

        TurnoModel turnoModel = new TurnoModel();
        turnoModel.setOdontologo(odontologoModel);
        turnoModel.setPaciente(pacienteModel);
        turnoModel.setFecha(LocalDate.parse("2024-08-20"));

        lista.add(turnoModel);
    }

    @Test
    public void agregar() throws Exception {

        domicilioModel.setId(1);
        domicilioModel.setCalle("Calle 2");
        domicilioModel.setNumero(3);
        domicilioModel.setLocalidad("localidad 2");
        domicilioModel.setProvincia("provincia 3");

        odontologoModel.setId(1);
        odontologoModel.setMatricula("AABC");
        odontologoModel.setNombre("Jesus");
        odontologoModel.setApellido("Solis");
        odontologoModel.setDomicilio(domicilioModel);

        pacienteModel.setId(1);
        pacienteModel.setDni("0001");
        pacienteModel.setNombre("Jesus");
        pacienteModel.setApellido("Solis");
        pacienteModel.setDomicilio(domicilioModel);
        pacienteModel.setAlta(LocalDate.parse("2024-08-29"));

        TurnoModel turnoModel = new TurnoModel();
        turnoModel.setOdontologo(odontologoModel);
        turnoModel.setPaciente(pacienteModel);
        turnoModel.setFecha(LocalDate.parse("2024-08-20"));

        String requestBody = objectMapper.writeValueAsString(turnoModel);

        mockMvc.perform(post("/turno").contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andDo(print());
    }

    @Test
    public void modificar() throws Exception {

        domicilioModel.setId(1);
        domicilioModel.setCalle("Calle 2");
        domicilioModel.setNumero(3);
        domicilioModel.setLocalidad("localidad 2");
        domicilioModel.setProvincia("provincia 3");

        odontologoModel.setId(1);
        odontologoModel.setMatricula("AABC");
        odontologoModel.setNombre("Jesus");
        odontologoModel.setApellido("Solis");
        odontologoModel.setDomicilio(domicilioModel);

        pacienteModel.setId(1);
        pacienteModel.setDni("0001");
        pacienteModel.setNombre("Jesus");
        pacienteModel.setApellido("Solis");
        pacienteModel.setDomicilio(domicilioModel);
        pacienteModel.setAlta(LocalDate.parse("2024-08-29"));

        TurnoModel turnoModel = new TurnoModel();
        turnoModel.setOdontologo(odontologoModel);
        turnoModel.setPaciente(pacienteModel);
        turnoModel.setFecha(LocalDate.parse("2024-08-30"));

        String requestBody = objectMapper.writeValueAsString(turnoModel);

        mockMvc.perform(put("/turno/1").contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    public void listar() throws Exception {

        String requestBody = objectMapper.writeValueAsString(lista);

        mockMvc.perform(MockMvcRequestBuilders.
                        get("/turnos")).
                andExpect(MockMvcResultMatchers.status().isOk()).
                andExpect(MockMvcResultMatchers.content().string(requestBody));

    }

    @Test
    public void borrar() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders.
                        delete("/turno/1")).
                andExpect(MockMvcResultMatchers.status().isOk());

    }

}