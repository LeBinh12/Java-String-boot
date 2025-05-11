package com.example.TestApi.Jpa;

import com.example.TestApi.Entities.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageJpa extends JpaRepository<Image, Integer> {
    List<Image> findByDish_DishId(Integer dishId);
}
