package com.example.TestApi.Jpa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.example.TestApi.Entities.OrderHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderHistoryJpa extends JpaRepository<OrderHistory, Long> {
    // Lấy lịch sử đơn hàng phân trang theo user_id
    @Query("SELECT oh FROM OrderHistory oh " +
            "JOIN oh.user u " +
            "JOIN oh.order o " +
            "JOIN o.restaurant r " +
            "LEFT JOIN o.table t " +
            "JOIN oh.dish d " +
            "WHERE u.userId = :userId")
    Page<OrderHistory> findByUserIdWithDetails(Integer userId, Pageable pageable);
}
