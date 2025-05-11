package com.example.TestApi.Jpa;

import com.example.TestApi.Entities.Dish;
import com.example.TestApi.Entities.DishCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DishCategoryJpa extends JpaRepository<DishCategory, Integer > {
    Optional<DishCategory> findById(Integer category_id);
    Page<DishCategory> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
