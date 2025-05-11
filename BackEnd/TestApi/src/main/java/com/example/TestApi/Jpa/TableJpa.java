package com.example.TestApi.Jpa;

import com.example.TestApi.Entities.RestaurantTable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TableJpa extends JpaRepository<RestaurantTable, Integer> {
    Page<RestaurantTable> findByStatusContainingIgnoreCase(String status, Pageable pageable);
    // Đếm số lượng đơn hàng trong khoảng thời gian
    Long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    // Tính tổng thu nhập (totalAmount) trong khoảng thời gian
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.createdAt BETWEEN :start AND :end")
    Double sumTotalAmountByCreatedAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
  List<RestaurantTable> findByRestaurant_RestaurantIdAndStatus(Integer restaurantId, String status);
}
