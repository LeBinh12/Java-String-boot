package com.example.TestApi.Repositories;

import com.example.TestApi.Entities.RestaurantTable;
import org.springframework.data.repository.CrudRepository;

public interface tableResponsitory extends CrudRepository<RestaurantTable, Integer> {
}
