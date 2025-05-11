package com.example.TestApi.Controller;

import com.example.TestApi.DTO.OrderHistoryDTO;
import com.example.TestApi.Entities.Dish;
import com.example.TestApi.Entities.Order;
import com.example.TestApi.Entities.OrderHistory;
import com.example.TestApi.Entities.User;
import com.example.TestApi.Jpa.DishJpa;
import com.example.TestApi.Jpa.OrderHistoryJpa;
import com.example.TestApi.Jpa.OrderJpa;
import com.example.TestApi.Jpa.UserJpa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RestController
@RequestMapping("/order-history")
public class OrderHistoryController {

    @Autowired
    private OrderHistoryJpa orderHistoryRepository;

    @Autowired
    private UserJpa userRepository;

    @Autowired
    private OrderJpa orderRepository;

    @Autowired
    private DishJpa dishRepository;

    // Lấy lịch sử đơn hàng phân trang theo user_id với thông tin chi tiết
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<OrderHistoryDTO>> getOrderHistoryByUserId(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderHistory> orderHistoryPage = orderHistoryRepository.findByUserIdWithDetails(userId, pageable);

        // Chuyển đổi sang OrderHistoryDTO
        Page<OrderHistoryDTO> dtoPage = orderHistoryPage.map(this::convertToDTO);
        return ResponseEntity.ok(dtoPage);
    }

    // Thêm lịch sử đơn hàng
    @PostMapping
    public ResponseEntity<?> addOrderHistory(@RequestBody OrderHistoryDTO dto) {
        try {
            // Kiểm tra tính hợp lệ của user_id, order_id, dish_id
            Optional<User> user = userRepository.findById(dto.getUserId());
            if (!user.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Không tìm thấy người dùng với ID: " + dto.getUserId());
            }

            Optional<Order> order = orderRepository.findById(dto.getOrderId());
            if (!order.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Không tìm thấy đơn hàng với ID: " + dto.getOrderId());
            }

            Optional<Dish> dish = dishRepository.findById(dto.getDishId());
            if (!dish.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Không tìm thấy món ăn với ID: " + dto.getDishId());
            }

            if (dto.getQuantity() <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Số lượng phải lớn hơn 0");
            }

            // Tạo và lưu OrderHistory
            OrderHistory orderHistory = new OrderHistory();
            orderHistory.setUser(user.get());
            orderHistory.setOrder(order.get());
            orderHistory.setDish(dish.get());
            orderHistory.setQuantity(dto.getQuantity());
            orderHistory.setOrderTime(dto.getOrderTime() != null ? dto.getOrderTime() : LocalDateTime.now());

            OrderHistory savedOrderHistory = orderHistoryRepository.save(orderHistory);
            return ResponseEntity.ok(convertToDTO(savedOrderHistory));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi thêm lịch sử đơn hàng: " + e.getMessage());
        }
    }

    // Xóa lịch sử đơn hàng
    @DeleteMapping("/{historyId}")
    public ResponseEntity<?> deleteOrderHistory(@PathVariable Long historyId) {
        try {
            if (!orderHistoryRepository.existsById(historyId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Không tìm thấy lịch sử đơn hàng với ID: " + historyId);
            }
            orderHistoryRepository.deleteById(historyId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi xóa lịch sử đơn hàng: " + e.getMessage());
        }
    }

    // Chuyển đổi OrderHistory sang OrderHistoryDTO
    private OrderHistoryDTO convertToDTO(OrderHistory orderHistory) {
        OrderHistoryDTO dto = new OrderHistoryDTO();
        dto.setHistoryId(orderHistory.getHistoryId());
        dto.setUserId(orderHistory.getUser().getUser_id());
        dto.setUsername(orderHistory.getUser().getUsername());
        dto.setOrderId(orderHistory.getOrder().getOrderId());
        dto.setDishId(orderHistory.getDish().getDishId());
        dto.setDishName(orderHistory.getDish().getName());
        dto.setDishDescription(orderHistory.getDish().getDescription());
        dto.setDishPrice(orderHistory.getDish().getPrice());
        dto.setDishImageUrl(orderHistory.getDish().getImage_url());
        dto.setQuantity(orderHistory.getQuantity());
        dto.setOrderTime(orderHistory.getOrderTime());
        dto.setRestaurantId(orderHistory.getOrder().getRestaurant().getRestaurantId());
        dto.setRestaurantName(orderHistory.getOrder().getRestaurant().getName());
        dto.setRestaurantAddress(orderHistory.getOrder().getRestaurant().getAddress());
        dto.setTableId(orderHistory.getOrder().getTable() != null ? orderHistory.getOrder().getTable().getTableId() : null);
        dto.setTableNumber(orderHistory.getOrder().getTable() != null ? orderHistory.getOrder().getTable().getTable_number() : null);
        dto.setTotalAmount(orderHistory.getOrder().getTotalAmount());
        dto.setOrderStatus(orderHistory.getOrder().getStatus());
        return dto;
    }
}