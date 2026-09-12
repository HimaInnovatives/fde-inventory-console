package com.fde.inventory_system;

import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(InventoryController.class)
class InventoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private InventoryService service;

    @Autowired
    private ObjectMapper objectMapper;

    private InventoryItem sampleItem;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        sampleItem = new InventoryItem();
        sampleItem.setId(1L);
        sampleItem.setProductName("Laptop");
        sampleItem.setCategory("Electronics");
        sampleItem.setQuantity(10);
        sampleItem.setPrice(55000.0);
    }

    @Test
    void getAllItems_returnsListOfItems() throws Exception {
        when(service.getAllItems()).thenReturn(List.of(sampleItem));

        mockMvc.perform(get("/api/items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].productName").value("Laptop"))
                .andExpect(jsonPath("$[0].quantity").value(10));
    }

    @Test
    void getItem_returnsItem_whenFound() throws Exception {
        when(service.getItemById(1L)).thenReturn(Optional.of(sampleItem));

        mockMvc.perform(get("/api/items/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.productName").value("Laptop"));
    }

    @Test
    void getItem_returns404_whenNotFound() throws Exception {
        when(service.getItemById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/items/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createItem_returnsCreatedItem() throws Exception {
        when(service.saveItem(any(InventoryItem.class))).thenReturn(sampleItem);

        mockMvc.perform(post("/api/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleItem)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.productName").value("Laptop"));
    }

    @Test
    void updateItem_returnsUpdatedItem() throws Exception {
        when(service.updateItem(eq(1L), any(InventoryItem.class))).thenReturn(sampleItem);

        mockMvc.perform(put("/api/items/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleItem)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.productName").value("Laptop"));
    }

    @Test
    void deleteItem_returnsNoContent() throws Exception {
        doNothing().when(service).deleteItem(1L);

        mockMvc.perform(delete("/api/items/1"))
                .andExpect(status().isNoContent());
    }
}