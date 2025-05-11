package com.example.TestApi.Repositories;

import com.example.TestApi.Entities.Order;
import org.springframework.data.repository.CrudRepository;

public interface OrderResponsitory extends CrudRepository<Order, Integer> {
}
