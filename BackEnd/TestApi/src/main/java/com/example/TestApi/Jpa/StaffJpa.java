package com.example.TestApi.Jpa;

import com.example.TestApi.Entities.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StaffJpa extends JpaRepository<Staff, Integer> {
    Page<Staff> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Staff> findByRestaurant_RestaurantId(Integer restaurantId, Pageable pageable);
    Optional<Staff> findById(Integer Staff_Id);
}
