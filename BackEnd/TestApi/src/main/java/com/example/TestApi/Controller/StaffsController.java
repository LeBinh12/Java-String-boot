package com.example.TestApi.Controller;

import com.example.TestApi.Entities.Restaurant;
import com.example.TestApi.Entities.Staff;
import com.example.TestApi.Repositories.RestaurantResponsitory;
import com.example.TestApi.Jpa.StaffJpa;
import com.example.TestApi.Repositories.StaffResponsitory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RestController
@RequestMapping(path = "/staffs")
public class StaffsController {
    private final StaffResponsitory data;
    private final RestaurantResponsitory restaurantReponsitories;
    private final StaffJpa jpa;
    @Autowired
    public StaffsController(StaffResponsitory staffResponsitory,
                            RestaurantResponsitory restaurantReponsitory,
                            StaffJpa staffJpa){
        data = staffResponsitory;
        restaurantReponsitories = restaurantReponsitory;
        jpa = staffJpa;
    }

    @GetMapping("/getAll")
    public @ResponseBody Iterable<Staff> getAllStaff(){
        return data.findAll();
    }

    @GetMapping("/get-id/{id}")
    public ResponseEntity<?> getStaffId(@PathVariable Integer id){
        Optional<Staff> staff = jpa.findById(id);
        if(staff.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: staff not found");
        else
            return ResponseEntity.ok(staff.get());
    }

    @GetMapping("/get-pagination")
    public  ResponseEntity<Map<String, Object>> getPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "") String name
    ){
        Pageable pageable = PageRequest.of(page, size);
        Page<Staff> staffPage;
        System.out.println("Searching for name: " + name);

        staffPage = jpa.findByNameContainingIgnoreCase(name,pageable);
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

    @GetMapping("/get-count")
    public ResponseEntity<Map<String, Object>> getTotalStaffCount() {
        long totalStaff = data.count(); // Lấy tổng số nhân viên

        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("totalStaff", totalStaff);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/get-pagination-by-restaurant")
    public ResponseEntity<Map<String, Object>> getPaginationByRestaurant(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam Integer restaurantId) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Staff> staffPage = jpa.findByRestaurant_RestaurantId(restaurantId, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("data", staffPage.getContent());
        response.put("currentPage", staffPage.getNumber());
        response.put("totalPages", staffPage.getTotalPages());
        response.put("totalItems", staffPage.getTotalElements());

        return ResponseEntity.ok(response);
    }


    @PostMapping("/add")
    public ResponseEntity<String> addStaff(@RequestBody Staff staff){
        System.out.println("Data: " + staff);

        if(staff.getRestaurant() == null || staff.getRestaurant().getRestaurant_id() == null)
            return ResponseEntity.badRequest().body("Error: Retaurant not found!");

        data.save(staff);
        return ResponseEntity.ok("Add staff success!");
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateStaff(@PathVariable Integer id,
                                              @RequestBody Staff staff){

        Optional<Staff> existingStaff = data.findById(id);

        if(existingStaff.isEmpty())
            return ResponseEntity.badRequest().body("Error: Staff not found");

        if(staff.getRestaurant() == null || staff.getRestaurant().getRestaurant_id() == null)
            return ResponseEntity.badRequest().body("Error: Restaurant not found!");

        Optional<Restaurant> existingRestaurant = restaurantReponsitories.findById(staff.getRestaurant().getRestaurant_id());
        if(existingRestaurant.isEmpty())
            return ResponseEntity.badRequest().body("Error: Restaurant not found!");

        Staff newStaff = existingStaff.get();
        newStaff.setEmail(staff.getEmail());
        newStaff.setRestaurant(staff.getRestaurant());
        newStaff.setName(staff.getName());
        newStaff.setHireDate(staff.getHireDate());
        newStaff.setPosition(staff.getPosition());
        newStaff.setPhoneNumber(staff.getPhoneNumber());
        newStaff.setSalary(staff.getSalary());
        newStaff.setStatus(staff.getStatus());
        data.save(newStaff);
        return ResponseEntity.ok("Update staff success!");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleleRestaurant(@PathVariable Integer id){

        if(!data.existsById(id))
            return ResponseEntity.badRequest().body("Error: Staff not found");

        data.deleteById(id);
        return ResponseEntity.ok("Delete staff success!");
    }
}
