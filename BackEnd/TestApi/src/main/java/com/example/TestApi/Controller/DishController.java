package com.example.TestApi.Controller;

import com.example.TestApi.Entities.Dish;
import com.example.TestApi.Entities.DishCategory;
import com.example.TestApi.Entities.Restaurant;
import com.example.TestApi.Entities.Staff;
import com.example.TestApi.Jpa.DishJpa;
import com.example.TestApi.Repositories.CategoryResponsitory;
import com.example.TestApi.Repositories.DishResponsitory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RestController
@RequestMapping(path = "/dishes")
public class DishController {
    public final DishResponsitory data;
    public final CategoryResponsitory categoryResponsitory;
    public final DishJpa jpa;

    public DishController(DishResponsitory dishResponsitory,
                          CategoryResponsitory categoryResponsitory1,
                          DishJpa dishJpa) {
        data = dishResponsitory;
        categoryResponsitory = categoryResponsitory1;
        jpa = dishJpa;
    }

    @GetMapping(path = "/getAll")
    public @ResponseBody Iterable<Dish> getAllDish() {
        return data.findAll();
    }

    @GetMapping(path = "/get-id/{id}")
    public ResponseEntity<?> getDishId(@PathVariable Integer id){
        Optional<Dish> dish = jpa.findById(id);
        if(dish.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: dish not found");
        else
            return ResponseEntity.ok(dish.get());
    }

    @GetMapping("/search-pagination")
    public ResponseEntity<Map<String, Object>> searchPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false, defaultValue = "") String name,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice
    ) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Dish> dishPage = jpa.searchDishes(
                categoryId,
                name != null && !name.trim().isEmpty() ? name.trim() : null,
                minPrice,
                maxPrice,
                pageable
        );

        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("data", dishPage.getContent());
        response.put("currentPage", dishPage.getNumber());
        response.put("totalPages", dishPage.getTotalPages());
        response.put("totalItems", dishPage.getTotalElements());

        return ResponseEntity.ok(response);
    }





    @GetMapping("/get-pagination")
    public  ResponseEntity<Map<String, Object>> getPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String name
    ){
        Pageable pageable = PageRequest.of(page, size);
        Page<Dish> staffPage;
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

    @GetMapping("/get-pagination-by-category")
    public ResponseEntity<Map<String, Object>> getPaginationByRestaurant(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam Integer categoryId) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Dish> staffPage = jpa.findByDishCategory_CategoryId(categoryId, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("data", staffPage.getContent());
        response.put("currentPage", staffPage.getNumber());
        response.put("totalPages", staffPage.getTotalPages());
        response.put("totalItems", staffPage.getTotalElements());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/total-price")
    public ResponseEntity<Map<String, Object>> getTotalDishPrice() {
        BigDecimal totalPrice = jpa.getTotalDishPrice();

        if (totalPrice == null) {
            totalPrice = BigDecimal.ZERO;
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("totalPrice", totalPrice);

        return ResponseEntity.ok(response);
    }
    @GetMapping("/get-count")
    public ResponseEntity<Map<String, Object>> getTotalStaffCount() {
        long totalDish = data.count(); // Lấy tổng số nhân viên

        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("totalDish", totalDish);

        return ResponseEntity.ok(response);
    }

    @PostMapping(path = "/add")
    public ResponseEntity<String> addDish(@RequestBody Dish dish) {
        if (!categoryResponsitory.existsById(dish.getDishCategory().getCategoryId()))
            return ResponseEntity.badRequest().body("Error: category not found");

        data.save(dish);
        return ResponseEntity.ok("Add dish success!");
    }

    @PutMapping(path = "/update/{id}")
    public ResponseEntity<String> updateDish(@PathVariable Integer id, @RequestBody Dish dish) {

        Optional<Dish> existingDish = data.findById(id);
        if (existingDish.isEmpty())
            return ResponseEntity.badRequest().body("Error: dish not found");

        if (!categoryResponsitory.existsById(dish.getDishCategory().getCategoryId()))
            return ResponseEntity.badRequest().body("Error: category not found");

        Dish newDish = existingDish.get();
        newDish.setDishCategory(dish.getDishCategory());
        newDish.setDescription(dish.getDescription());
        newDish.setName(dish.getName());
        newDish.setPrice(dish.getPrice());
        newDish.setImage_url(dish.getImage_url());
        newDish.setIs_available(dish.isIs_available());

        data.save(newDish);
        return ResponseEntity.ok("Update dish success");
    }

    @DeleteMapping(path = "/delete/{id}")
    public ResponseEntity<String> deleteDish(@PathVariable Integer id) {
        Optional<Dish> existingDish = data.findById(id);
        if (existingDish.isEmpty())
            return ResponseEntity.badRequest().body("Error: dish not found");

        data.deleteById(id);
        return ResponseEntity.ok("Delete dish success");
    }
}
