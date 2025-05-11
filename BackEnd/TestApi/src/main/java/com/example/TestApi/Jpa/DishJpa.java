package com.example.TestApi.Jpa;

import com.example.TestApi.Entities.Dish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;

public interface DishJpa extends JpaRepository<Dish, Integer > {
    @Override
    Optional<Dish> findById(Integer dishId);
    Page<Dish> findByDishCategory_CategoryId(Integer categoryId, Pageable page);
    Page<Dish> findByNameContainingIgnoreCase(String name, Pageable pageable);
    @Query("SELECT SUM(d.price) FROM Dish d")
    BigDecimal getTotalDishPrice();


    @Query("SELECT d FROM Dish d WHERE " +
            "(:categoryId IS NULL OR d.dishCategory.categoryId = :categoryId) AND " +
            "(:name IS NULL OR :name = '' OR LOWER(d.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:minPrice IS NULL OR d.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR d.price <= :maxPrice)")
    Page<Dish> searchDishes(
            @Param("categoryId") Integer categoryId,
            @Param("name") String name,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );
}
