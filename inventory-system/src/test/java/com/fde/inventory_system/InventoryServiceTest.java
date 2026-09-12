package com.fde.inventory_system;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {

    @Mock
    private InventoryRepository repository;

    @InjectMocks
    private InventoryService service;

    private InventoryItem sampleItem;

    @BeforeEach
    void setUp() {
        sampleItem = new InventoryItem();
        sampleItem.setId(1L);
        sampleItem.setProductName("Laptop");
        sampleItem.setCategory("Electronics");
        sampleItem.setQuantity(10);
        sampleItem.setPrice(55000.0);
    }

    @Test
    void getAllItems_returnsAllItems() {
        when(repository.findAll()).thenReturn(List.of(sampleItem));

        List<InventoryItem> result = service.getAllItems();

        assertEquals(1, result.size());
        assertEquals("Laptop", result.get(0).getProductName());
        verify(repository, times(1)).findAll();
    }

    @Test
    void getItemById_returnsItem_whenFound() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleItem));

        Optional<InventoryItem> result = service.getItemById(1L);

        assertTrue(result.isPresent());
        assertEquals("Laptop", result.get().getProductName());
    }

    @Test
    void getItemById_returnsEmpty_whenNotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        Optional<InventoryItem> result = service.getItemById(99L);

        assertFalse(result.isPresent());
    }

    @Test
    void saveItem_savesAndReturnsItem() {
        when(repository.save(sampleItem)).thenReturn(sampleItem);

        InventoryItem result = service.saveItem(sampleItem);

        assertEquals("Laptop", result.getProductName());
        verify(repository, times(1)).save(sampleItem);
    }

    @Test
    void updateItem_updatesFields_whenItemExists() {
        InventoryItem updatedData = new InventoryItem();
        updatedData.setProductName("Gaming Laptop");
        updatedData.setCategory("Electronics");
        updatedData.setQuantity(5);
        updatedData.setPrice(75000.0);

        when(repository.findById(1L)).thenReturn(Optional.of(sampleItem));
        when(repository.save(any(InventoryItem.class))).thenAnswer(inv -> inv.getArgument(0));

        InventoryItem result = service.updateItem(1L, updatedData);

        assertEquals("Gaming Laptop", result.getProductName());
        assertEquals(5, result.getQuantity());
        assertEquals(75000.0, result.getPrice());
    }

    @Test
    void updateItem_throwsException_whenItemNotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        InventoryItem updatedData = new InventoryItem();

        assertThrows(RuntimeException.class, () -> service.updateItem(99L, updatedData));
    }

    @Test
    void deleteItem_callsRepositoryDelete() {
        service.deleteItem(1L);

        verify(repository, times(1)).deleteById(1L);
    }
}