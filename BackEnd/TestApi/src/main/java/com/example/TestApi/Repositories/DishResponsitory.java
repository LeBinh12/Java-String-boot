package com.example.TestApi.Repositories;

import com.example.TestApi.Entities.Dish;
import com.example.TestApi.Entities.DishCategory;
import jakarta.transaction.Transactional;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface DishResponsitory extends CrudRepository<Dish, Integer> {
}
