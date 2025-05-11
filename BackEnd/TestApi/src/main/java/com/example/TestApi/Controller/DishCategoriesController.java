package com.example.TestApi.Controller;

import com.example.TestApi.Entities.Dish;
import com.example.TestApi.Entities.DishCategory;
import com.example.TestApi.Jpa.DishCategoryJpa;
import com.example.TestApi.Jpa.DishJpa;
import com.example.TestApi.Repositories.CategoryResponsitory;
import com.example.TestApi.Repositories.DishResponsitory;
import org.hibernate.Internal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RestController
@RequestMapping( path = "/categories")
public class DishCategoriesController {
    private final CategoryResponsitory data;
    private final DishResponsitory dish;
    private final DishCategoryJpa jpa;
    @Autowired
    public DishCategoriesController(CategoryResponsitory categoryResponsitory,
                                    DishResponsitory dishResponsitory,
                                    DishCategoryJpa dishCategoryJpa){
        data = categoryResponsitory;
        dish = dishResponsitory;
        jpa = dishCategoryJpa;
    }

    @GetMapping("/getAll")
    public @ResponseBody Iterable<DishCategory> getAddCategories(){
        return data.findAll();
    }

    @GetMapping("/get-id/{id}")
    public ResponseEntity<?> getCategoryId(@PathVariable Integer id){
        Optional<DishCategory> dishCategory = jpa.findById(id);
        if(dishCategory.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Category not found");
        else
            return ResponseEntity.ok(dishCategory.get());
    }


    @GetMapping("/get-pagination")
    public  ResponseEntity<Map<String, Object>> getPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String name
    ){
        Pageable pageable = PageRequest.of(page, size);
        Page<DishCategory> staffPage;
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

    @PostMapping("/add")
    public ResponseEntity<String> addCategory(@RequestBody DishCategory category){
        data.save(category);
        return ResponseEntity.ok("Add category success!");
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateCategory(@PathVariable Integer id,
                                                @RequestBody DishCategory category){

        Optional<DishCategory> existingCategory = data.findById(id);
        if(existingCategory.isEmpty())
            return ResponseEntity.badRequest().body("Error: Category not found");

        DishCategory newCategory = existingCategory.get();
        newCategory.setName(category.getName());
        data.save(newCategory);
        return ResponseEntity.ok("Update category success!");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Integer id){
        Optional<DishCategory> existingCategory = data.findById(id);

        if(existingCategory.isEmpty())
            return ResponseEntity.badRequest().body("Error: Category not found");


        data.deleteById(id);

        return ResponseEntity.ok("Delete category success!");

    }
}
