package com.example.TestApi.Jpa;

import com.example.TestApi.Entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemJpa extends JpaRepository<OrderItem, Integer> {
    List<OrderItem> findByOrder_OrderId(int orderId);
    List<OrderItem> findByDish_DishId(int dishId);
}
