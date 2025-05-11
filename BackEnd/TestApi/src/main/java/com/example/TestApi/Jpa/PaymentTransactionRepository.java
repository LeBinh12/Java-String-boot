package com.example.TestApi.Jpa;

import com.example.TestApi.Entities.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Integer> {
    PaymentTransaction findByTransactionCode(String transactionCode);
    List<PaymentTransaction> findByOrderOrderId(Integer orderId);
}