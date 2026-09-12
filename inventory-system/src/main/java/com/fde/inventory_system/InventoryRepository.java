package com.fde.inventory_system;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {
    Page<InventoryItem> findByProductNameContainingIgnoreCase(String productName, Pageable pageable);
}