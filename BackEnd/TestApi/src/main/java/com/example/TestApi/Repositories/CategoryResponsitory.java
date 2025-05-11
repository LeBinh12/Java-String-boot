package com.example.TestApi.Repositories;

import com.example.TestApi.Entities.DishCategory;
import org.springframework.data.repository.CrudRepository;

public interface CategoryResponsitory extends CrudRepository<DishCategory, Integer> {
}

