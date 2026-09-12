package com.fde.inventory_system;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository repository;

    public List<InventoryItem> getAllItems() {
        return repository.findAll();
    }

    public Optional<InventoryItem> getItemById(Long id) {
        return repository.findById(id);
    }

    public InventoryItem saveItem(InventoryItem item) {
        return repository.save(item);
    }

    public InventoryItem updateItem(Long id, InventoryItem updated) {
        return repository.findById(id).map(item -> {
            item.setProductName(updated.getProductName());
            item.setCategory(updated.getCategory());
            item.setQuantity(updated.getQuantity());
            item.setPrice(updated.getPrice());
            return repository.save(item);
        }).orElseThrow(() -> new RuntimeException("Item not found with id " + id));
    }

    public void deleteItem(Long id) {
        repository.deleteById(id);
    }
}