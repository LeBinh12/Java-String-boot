package com.example.TestApi.Controller;

import com.example.TestApi.Entities.Dish;
import com.example.TestApi.Entities.Image;
import com.example.TestApi.Jpa.DishJpa;
import com.example.TestApi.Jpa.ImageJpa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RestController
@RequestMapping(path = "/images")
public class ImageController {
    private final ImageJpa jpa;
    private final DishJpa dishRepository;

    @Autowired
    public ImageController(ImageJpa imageRepository, DishJpa dishRepository) {
        this.jpa = imageRepository;
        this.dishRepository = dishRepository;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addImages(@RequestParam Integer dishId,
                                            @RequestBody List<String> imageUrls) {
        Optional<Dish> dishOpt = dishRepository.findById(dishId);
        if (dishOpt.isEmpty())
            return ResponseEntity.badRequest().body("Error: Dish not found");

        Dish dish = dishOpt.get();
        for (String url : imageUrls) {
            Image image = new Image();
            image.setImageUrl(url);
            image.setDish(dish);
            jpa.save(image);
        }

        return ResponseEntity.ok("Images added successfully!");
    }


    @GetMapping("/get-image/{dishId}")
    public ResponseEntity<List<Image>> getImagesByDish(@PathVariable Integer dishId) {
        List<Image> images = jpa.findByDish_DishId(dishId);
        return ResponseEntity.ok(images);
    }

}
