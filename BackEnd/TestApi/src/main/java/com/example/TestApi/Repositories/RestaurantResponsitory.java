package com.example.TestApi.Repositories;

import com.example.TestApi.Entities.Restaurant;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantResponsitory extends CrudRepository<Restaurant, Integer> {
}
