package com.example.TestApi.Controller;

import com.example.TestApi.Entities.Restaurant;
import com.example.TestApi.Entities.RestaurantTable;
import com.example.TestApi.Jpa.TableJpa;
import com.example.TestApi.Repositories.RestaurantResponsitory;
import com.example.TestApi.Repositories.tableResponsitory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RestController
@RequestMapping(path = "/tables")
public class TablesController {
    private final tableResponsitory data;
    private final RestaurantResponsitory restaurantReponsitories;
    private final TableJpa jpa;
    @Autowired
    public TablesController (tableResponsitory TableResponsitory,
                             RestaurantResponsitory RestaurantReponsitories,
                             TableJpa tableJpa){
        data = TableResponsitory;
        restaurantReponsitories = RestaurantReponsitories;
        jpa = tableJpa;
    }

    @GetMapping("/get-all")
    public @ResponseBody Iterable<RestaurantTable> getAllStaff(){
        return data.findAll();
    }

    @GetMapping("/get-table-restaurant/{restaurantId}")
    public ResponseEntity<Map<String,Object>>  getTablesByRestaurant (@PathVariable Integer restaurantId){Map<String, Object> response = new HashMap<>();
        List<RestaurantTable> availableTables = jpa.findByRestaurant_RestaurantIdAndStatus(restaurantId, "Available");

        if (availableTables.isEmpty()) {
            response.put("status", 404);
            response.put("message", "Không có bàn trống cho nhà hàng này.");
            return ResponseEntity.status(404).body(response);
        }

        response.put("status", 200);
        response.put("data", availableTables);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get-pagination")
    public  ResponseEntity<Map<String, Object>> getPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "") String status
    ){
        Pageable pageable = PageRequest.of(page, size);
        Page<RestaurantTable> tablePage;

        tablePage = jpa.findByStatusContainingIgnoreCase(status,pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("data", tablePage.getContent());
        response.put("currentPage", tablePage.getNumber());
        response.put("totalPages", tablePage.getTotalPages());
        response.put("totalItems", tablePage.getTotalElements());

        return ResponseEntity.ok(response);
    }


    @PostMapping("/add")
    public ResponseEntity<String> addStaff(@RequestBody RestaurantTable Table) {

        if (Table.getRestaurant() == null || Table.getRestaurant().getRestaurant_id() == null)
            return ResponseEntity.badRequest().body("Error: Table not found!");

        data.save(Table);
        return ResponseEntity.ok("Add Table success!");
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateTable(@PathVariable Integer id,
                                              @RequestBody RestaurantTable Table){

        Optional<RestaurantTable> existingTable = data.findById(id);

        if(existingTable.isEmpty())
            return ResponseEntity.badRequest().body("Error: Table not found");

        if(Table.getRestaurant() == null || Table.getRestaurant().getRestaurant_id() == null)
            return ResponseEntity.badRequest().body("Error: Restaurant1 not found!");

        Optional<Restaurant> existingRestaurant = restaurantReponsitories.findById(Table.getRestaurant().getRestaurant_id());
        if(existingRestaurant.isEmpty())
            return ResponseEntity.badRequest().body("Error: Restaurant2 not found!");

        RestaurantTable newTable = existingTable.get();
        newTable.setTable_number(Table.getTable_number());
        newTable.setCapacity(Table.getCapacity());
        newTable.setRestaurant(Table.getRestaurant());
        newTable.setStatus(Table.getStatus());
        data.save(newTable);
        return ResponseEntity.ok("Update staff success!");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleleTable(@PathVariable Integer id){

        if(!data.existsById(id))
            return ResponseEntity.badRequest().body("Error: Table not found");

        data.deleteById(id);
        return ResponseEntity.ok("Delete Table success!");
    }

}
