package com.example.TestApi.Controller;


import com.example.TestApi.Entities.Dish;
import com.example.TestApi.Entities.Order;
import com.example.TestApi.Entities.Restaurant;
import com.example.TestApi.Jpa.OrderJpa;
import com.example.TestApi.Jpa.RestaurantJpa;
import com.example.TestApi.Repositories.RestaurantResponsitory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RestController
@RequestMapping(path = "/restaurants")
public class RestaurantsController {
    private final RestaurantResponsitory data;
    private final RestaurantJpa jpa;
    private final OrderJpa orderJpa;
    @Autowired
    public RestaurantsController(RestaurantResponsitory data,
                                 RestaurantJpa restaurantJpa,
                                 OrderJpa orderJpa1) {
        this.data = data;
        this.jpa = restaurantJpa;
        this.orderJpa = orderJpa1;
    }

    @GetMapping("/getAll")
    public @ResponseBody Iterable<Restaurant> getAllRestaurant(){
        return data.findAll();
    }

    @GetMapping("/get-pagination")
    public  ResponseEntity<Map<String, Object>> getPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String name
    ){
        Pageable pageable = PageRequest.of(page, size);
        Page<Restaurant> staffPage;
        System.out.println("Searching for name: " + name);

        staffPage = jpa.findByNameContainingIgnoreCase(name, pageable);
        System.out.println("Total items found: " + staffPage.getTotalElements());
        System.out.println("Data: " + staffPage.getContent());

        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("data", staffPage.getContent());
        response.put("currentPage", staffPage.getNumber());
        response.put("totalPages", staffPage.getTotalPages());
        response.put("totalItems", staffPage.getTotalElements());

        return ResponseEntity.ok(response);
    }


    @GetMapping("/get-id/{id}")
    public ResponseEntity<?> getRestaurant(@PathVariable Integer id){
        Optional<Restaurant> restaurant = jpa.findById(id);
        if(restaurant.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: restaurant not found");
        else
            return ResponseEntity.ok(restaurant.get());
    }

    @PostMapping("/add")
    public @ResponseBody String addRestaurant(@RequestBody Restaurant restaurant){
        System.out.println("Data: " + restaurant.toString());
        data.save(restaurant);
        return "Add restaurant success!";
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleleRestaurant(@PathVariable Integer id){
        if(!data.existsById(id))
            return ResponseEntity.badRequest().body("Error: Restaurant not found");
        data.deleteById(id);
        return ResponseEntity.ok("Delete restaurant success!");
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<String> editRestaurant(@PathVariable Integer id,
                                                 @RequestBody Restaurant restaurant){
        Optional<Restaurant> existingRestaurant = data.findById(id);
        if(existingRestaurant.isEmpty())
            return ResponseEntity.badRequest().body("Error: Restaurant not found");

        Restaurant editRestaurant = existingRestaurant.get();
        editRestaurant.setAddress(restaurant.address);
        editRestaurant.setName(restaurant.name);
        editRestaurant.setEmail(restaurant.email);
        editRestaurant.setOpening_hours(restaurant.opening_hours);
        editRestaurant.setPhone_number(restaurant.phone_number);
        editRestaurant.setDescription(restaurant.description);

        data.save(editRestaurant);
        return ResponseEntity.ok("Restaurant updated successfully!");
    }


    @PostMapping("/rate/{orderId}")
    public ResponseEntity<String> rateRestaurant(@PathVariable Integer orderId,
                                                 @RequestParam Double rating) {
        Optional<Order> orderOpt = orderJpa.findById(orderId);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Đơn hàng không tồn tại");
        }

        Order order = orderOpt.get();

        // Kiểm tra trạng thái đơn hàng
        if (!Order.OrderStatus.Completed.equals(order.getStatus())) {
            return ResponseEntity.badRequest().body("Chỉ có thể đánh giá khi đơn hàng đã hoàn thành");
        }

        if (order.getIsRated()) {
            return ResponseEntity.badRequest().body("Đơn hàng này đã được đánh giá");
        }

        if (rating < 0 || rating > 5) {
            return ResponseEntity.badRequest().body("Điểm đánh giá phải từ 0 đến 5");
        }

        Restaurant restaurant = order.getRestaurant();
        if (restaurant == null) {
            return ResponseEntity.badRequest().body("Nhà hàng không tồn tại trong đơn hàng");
        }

        // Cập nhật số liệu đánh giá của nhà hàng
        restaurant.setNumberOfRatings(restaurant.getNumberOfRatings() + 1);
        restaurant.setTotalRating(restaurant.getTotalRating() + rating);
        restaurant.setAverageRating(restaurant.getTotalRating() / restaurant.getNumberOfRatings());
        jpa.save(restaurant);

        // Đánh dấu đơn hàng đã được đánh giá
        order.setIsRated(true);
        orderJpa.save(order);

        return ResponseEntity.ok("Đánh giá nhà hàng thành công");
    }


}
