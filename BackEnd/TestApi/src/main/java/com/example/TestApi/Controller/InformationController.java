package com.example.TestApi.Controller;

import com.example.TestApi.Entities.Information;
import com.example.TestApi.Entities.Staff;
import com.example.TestApi.Jpa.InformationJpa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RestController
@RequestMapping("/information")
public class InformationController {
    @Autowired
    private InformationJpa informationJpa;
    @GetMapping("/{id}")
    public ResponseEntity<?> getInformationById(@PathVariable Integer id) {
        Optional<Information> staff = informationJpa.findById(id);
        if(staff.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: sInformation not found");
        else
            return ResponseEntity.ok(staff.get());
    }
    @PostMapping("/create")
    public ResponseEntity<Information> createInformation(@RequestBody Information information) {
        Information createdInfo = informationJpa.save(information);
        return ResponseEntity.ok(createdInfo);
    }

    @GetMapping
    public ResponseEntity<Page<Information>> getAllInformation(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Information> informationPage = informationJpa.findAll(pageable);
        return ResponseEntity.ok(informationPage);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<String> editInformation(@PathVariable Integer id,
                                                  @RequestBody Information information) {
        Optional<Information> existingInfo = informationJpa.findById(id);
        if (existingInfo.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Information not found");
        }

        Information editInfo = existingInfo.get();
        editInfo.setTopic(information.getTopic());
        editInfo.setTitle(information.getTitle());
        editInfo.setDescription(information.getDescription());

        informationJpa.save(editInfo);
        return ResponseEntity.ok("Information updated successfully!");
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInformation(@PathVariable Integer id) {
        if (informationJpa.existsById(id)) {
            informationJpa.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

}
