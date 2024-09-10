package com.dh.ti.controller;

import com.dh.ti.model.DomicilioModel;
import com.dh.ti.service.DomicilioService;
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
class DomicilioControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private DomicilioService domicilioService;

    private DomicilioModel domicilioModel = new DomicilioModel();
    private List<DomicilioModel> lista = new ArrayList<>();

    @Before
    public void inicio() throws Exception {

        domicilioModel.setId(1);
        domicilioModel.setCalle("Calle 2");
        domicilioModel.setNumero(3);
        domicilioModel.setLocalidad("localidad 2");
        domicilioModel.setProvincia("provincia 3");

        lista.add(domicilioModel);
    }

    @Test
    public void agregar() throws Exception {

        domicilioModel.setCalle("Calle 1");
        domicilioModel.setNumero(2);
        domicilioModel.setLocalidad("localidad 1");
        domicilioModel.setProvincia("provincia 2");

        String requestBody = objectMapper.writeValueAsString(domicilioModel);

        mockMvc.perform(post("/domicilio").contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andDo(print());
    }

    @Test
    public void modificar() throws Exception {

        domicilioModel.setCalle("Calle 2");
        domicilioModel.setNumero(3);
        domicilioModel.setLocalidad("localidad 2");
        domicilioModel.setProvincia("provincia 3");

        String requestBody = objectMapper.writeValueAsString(domicilioModel);

        mockMvc.perform(put("/domicilio/1").contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    public void listar() throws Exception {

        String requestBody = objectMapper.writeValueAsString(lista);

        mockMvc.perform(MockMvcRequestBuilders.
                        get("/domicilios")).
                andExpect(MockMvcResultMatchers.status().isOk()).
                andExpect(MockMvcResultMatchers.content().string(requestBody));

    }

    @Test
    public void borrar() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders.
                        delete("/domicilio/1")).
                andExpect(MockMvcResultMatchers.status().isOk());

    }

}