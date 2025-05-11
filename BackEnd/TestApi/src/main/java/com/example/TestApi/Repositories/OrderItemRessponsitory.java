package com.example.TestApi.Repositories;

import com.example.TestApi.Entities.OrderItem;
import org.springframework.data.repository.CrudRepository;

public interface OrderItemRessponsitory extends CrudRepository<OrderItem, Integer> {
}
