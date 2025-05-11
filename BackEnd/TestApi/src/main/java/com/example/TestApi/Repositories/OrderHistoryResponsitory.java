package com.example.TestApi.Repositories;

import com.example.TestApi.Entities.OrderHistory;
import org.springframework.data.repository.CrudRepository;

public interface OrderHistoryResponsitory extends CrudRepository<OrderHistory, Integer> {
}
