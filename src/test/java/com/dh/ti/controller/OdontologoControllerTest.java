package com.dh.ti.controller;

import com.dh.ti.model.DomicilioModel;
import com.dh.ti.model.OdontologoModel;
import com.dh.ti.service.OdontologoService;
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

import java.util.ArrayList;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
class OdontologoControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private OdontologoService odontologoService;

    private DomicilioModel domicilioModel = new DomicilioModel();
    private OdontologoModel odontologoModel = new OdontologoModel();
    private List<OdontologoModel> lista = new ArrayList<>();

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

        lista.add(odontologoModel);
    }

    @Test
    public void agregar() throws Exception {

        odontologoModel.setMatricula("AABC");
        odontologoModel.setNombre("Jesus");
        odontologoModel.setApellido("Solis");
        odontologoModel.setDomicilio(domicilioModel);

        String requestBody = objectMapper.writeValueAsString(odontologoModel);

        mockMvc.perform(post("/odontologo").contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andDo(print());
    }

    @Test
    public void modificar() throws Exception {

        odontologoModel.setMatricula("AABCC");
        odontologoModel.setNombre("Jesus");
        odontologoModel.setApellido("Solis");
        odontologoModel.setDomicilio(domicilioModel);

        String requestBody = objectMapper.writeValueAsString(odontologoModel);

        mockMvc.perform(put("/odontologo/1").contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    public void listar() throws Exception {

        String requestBody = objectMapper.writeValueAsString(lista);

        mockMvc.perform(MockMvcRequestBuilders.
                        get("/odontologos")).
                andExpect(MockMvcResultMatchers.status().isOk()).
                andExpect(MockMvcResultMatchers.content().string(requestBody));

    }

    @Test
    public void borrar() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders.
                        delete("/odontologo/1")).
                andExpect(MockMvcResultMatchers.status().isOk());

    }

}