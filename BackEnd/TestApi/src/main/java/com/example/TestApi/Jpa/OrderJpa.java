package com.example.TestApi.Jpa;

import com.example.TestApi.Entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderJpa extends JpaRepository<Order, Integer> {
    List<Order> findByUser_UserId(int userId);
    @Query("SELECT o FROM Order o " +
            "WHERE LOWER(o.user.username) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "   OR LOWER(o.restaurant.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Order> searchOrdersByUsernameOrRestaurant(@Param("keyword") String keyword, Pageable pageable);
    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt BETWEEN :startOfDay AND :endOfDay")
    Long countOrdersToday(LocalDateTime startOfDay, LocalDateTime endOfDay);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.createdAt BETWEEN :startOfDay AND :endOfDay")
    BigDecimal sumRevenueToday(LocalDateTime startOfDay, LocalDateTime endOfDay);

}
