package com.example.TestApi.Controller;

import com.example.TestApi.Entities.Order;
import com.example.TestApi.Entities.OrderItem;
import com.example.TestApi.Jpa.OrderItemJpa;
import com.example.TestApi.Jpa.OrderJpa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RestController
@RequestMapping("/orders-item")
public class OrderItemController {
    private final OrderItemJpa jpa;
    @Autowired
    public OrderItemController(OrderItemJpa orderJpa)
    {
        jpa = orderJpa;
    }

    @GetMapping("/get-all")
    public List<OrderItem> getAllOrderItems(){
        return jpa.findAll();
    }

    @GetMapping("/get-by-order/{orderId}")
    public ResponseEntity<List<OrderItem>> getOrderItemsByOrderId(@PathVariable int orderId) {
        List<OrderItem> orders = jpa.findByOrder_OrderId(orderId);
        return ResponseEntity.ok(orders != null ? orders : Collections.emptyList());
    }

    @GetMapping("/get-by-dish/{dishId}")
    public ResponseEntity<List<OrderItem>> getOrderItemsByDishId(@PathVariable int dishId) {
        List<OrderItem> orderItems = jpa.findByDish_DishId(dishId);
        return ResponseEntity.ok(orderItems != null ? orderItems : Collections.emptyList());
    }

    @PostMapping("/add")
    public ResponseEntity<OrderItem> addOrderItem(@RequestBody OrderItem orderItem) {
        OrderItem savedOrderItem = jpa.save(orderItem);
        return ResponseEntity.ok(savedOrderItem);
    }

    // Sửa OrderItem
    @PutMapping("/update/{orderItemId}")
    public ResponseEntity<OrderItem> updateOrderItem(@PathVariable int orderItemId, @RequestBody OrderItem updatedOrderItem) {
        Optional<OrderItem> existingOrderItem = jpa.findById(orderItemId);
        if (!existingOrderItem.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        updatedOrderItem.setOrderItemId(orderItemId);
        OrderItem savedOrderItem = jpa.save(updatedOrderItem);
        return ResponseEntity.ok(savedOrderItem);
    }

    @DeleteMapping("/delete/{orderItemId}")
    public ResponseEntity<Void> deleteOrderItem(@PathVariable int orderItemId) {
        Optional<OrderItem> existingOrderItem = jpa.findById(orderItemId);
        if (!existingOrderItem.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        jpa.delete(existingOrderItem.get());
        return ResponseEntity.noContent().build();
    }
}
