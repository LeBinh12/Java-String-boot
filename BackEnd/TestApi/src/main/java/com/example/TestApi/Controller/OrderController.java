package com.example.TestApi.Controller;


import com.example.TestApi.Entities.Order;
import com.example.TestApi.Entities.RestaurantTable;
import com.example.TestApi.DTO.OrderStatsDto;
import com.example.TestApi.Jpa.OrderJpa;
import com.example.TestApi.Jpa.TableJpa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderJpa jpa;
    @Autowired
    private TableJpa tableJpa;

    // GET ALL
    @GetMapping("/getAll")
    public List<Order> getAllOrders() {
        return jpa.findAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Integer id) {
        Optional<Order> order = jpa.findById(id);
        return order.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user-by-id/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable int userId) {
        List<Order> orders = jpa.findByUser_UserId(userId);
        return ResponseEntity.ok(orders != null ? orders : Collections.emptyList()); // Trả về danh sách rỗng nếu không có dữ liệu
    }

    @GetMapping("/search-pagination")
    public ResponseEntity<Page<Order>> searchWithPagination(
            @RequestParam(defaultValue = " ") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orders = jpa.searchOrdersByUsernameOrRestaurant(keyword, pageable);
        return ResponseEntity.ok(orders);
    }


    @GetMapping("/today-stats")
    public OrderStatsDto getTodayOrderStats() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay(); // 00:00:00
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay().minusNanos(1); // 23:59:59.999999999

        Long totalOrders = jpa.countOrdersToday(startOfDay, endOfDay);
        BigDecimal totalRevenue = jpa.sumRevenueToday(startOfDay, endOfDay);

        return new OrderStatsDto(totalOrders, totalRevenue);
    }

    // CREATE
    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {

        System.out.println("Dữ liệu" + order.getTable().getTableId());
        RestaurantTable table = order.getTable();

        if (table != null && table.tableId != null) {
            Optional<RestaurantTable> optionalTable = tableJpa.findById(table.getTableId());
            if (optionalTable.isPresent()) {
                RestaurantTable existingTable = optionalTable.get();
                existingTable.setStatus("Occupied");
                tableJpa.save(existingTable);
            } else {
                return ResponseEntity.badRequest().body(null);
            }
        }

        Order savedOrder = jpa.save(order);
        return ResponseEntity.ok(savedOrder);
    }


    // UPDATE
    @PutMapping("/update/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Integer id, @RequestBody Order orderDetails) {
        Optional<Order> optionalOrder = jpa.findById(id);
        if (!optionalOrder.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Order order = optionalOrder.get();

        // Chỉ cập nhật các trường nếu chúng không null
        if (orderDetails.getRestaurant() != null) {
            order.setRestaurant(orderDetails.getRestaurant());
        }
        if (orderDetails.getTable() != null) {
            order.setTable(orderDetails.getTable());
        }
        if (orderDetails.getTotalAmount() != null) {
            order.setTotalAmount(orderDetails.getTotalAmount());
        }
        if (orderDetails.getStatus() != null) {
            order.setStatus(orderDetails.getStatus());
        }
        if (orderDetails.getReservation_time() != null) {
            order.setReservation_time(orderDetails.getReservation_time());
        }
        if (orderDetails.getNumber_of_guests() != null) {
            order.setNumber_of_guests(orderDetails.getNumber_of_guests());
        }
        if (orderDetails.getUpdatedAt() != null) {
            order.setUpdatedAt(orderDetails.getUpdatedAt());
        }
        // Không cập nhật user, giữ nguyên giá trị hiện tại

        Order updatedOrder = jpa.save(order);
        return ResponseEntity.ok(updatedOrder);
    }

    @PutMapping("/change-status/{id}")
    public ResponseEntity<Order> changeOrderStatus(@PathVariable Integer id) {
        Optional<Order> optionalOrder = jpa.findById(id);
        if (!optionalOrder.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Order order = optionalOrder.get();
        Order.OrderStatus currentStatus = order.getStatus();

        switch (currentStatus) {
            case Pending -> order.setStatus(Order.OrderStatus.Confirmed);
            case Confirmed -> order.setStatus(Order.OrderStatus.Completed);
            case Completed, Cancelled -> {
                // Không cập nhật gì nếu đã hoàn thành hoặc bị hủy
                return ResponseEntity.badRequest().body(order);
            }
        }

        order.setUpdatedAt(LocalDateTime.now());
        Order updatedOrder = jpa.save(order);
        return ResponseEntity.ok(updatedOrder);
    }


    // DELETE
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Integer id) {
        if (!jpa.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        jpa.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
