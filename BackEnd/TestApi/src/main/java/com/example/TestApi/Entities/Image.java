package com.example.TestApi.Entities;


import jakarta.persistence.*;

@Entity
@Table(name="images")

public class Image {

    public Integer getImageId() {
        return imageId;
    }

    public void setImageId(Integer imageId) {
        this.imageId = imageId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Dish getDish() {
        return dish;
    }

    public void setDish(Dish dish) {
        this.dish = dish;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer imageId;
    private String imageUrl;
    @ManyToOne
    @JoinColumn(name = "dish_id", nullable = false)
    private Dish dish;
}
