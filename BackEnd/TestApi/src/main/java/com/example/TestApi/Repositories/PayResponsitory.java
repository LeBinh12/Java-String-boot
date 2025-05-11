package com.example.TestApi.Repositories;

import com.example.TestApi.Entities.PaymentTransaction;
import org.springframework.data.repository.CrudRepository;

public interface PayResponsitory extends CrudRepository<PaymentTransaction, Integer> {
}
