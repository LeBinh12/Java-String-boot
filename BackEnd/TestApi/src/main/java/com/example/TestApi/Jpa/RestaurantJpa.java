package com.example.TestApi.Jpa;

import com.example.TestApi.Entities.Dish;
import com.example.TestApi.Entities.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RestaurantJpa extends JpaRepository<Restaurant, Integer> {
    Optional<Restaurant> findById(Integer restaurantId);
    Page<Restaurant> findByNameContainingIgnoreCase(String name, Pageable pageable);

}
