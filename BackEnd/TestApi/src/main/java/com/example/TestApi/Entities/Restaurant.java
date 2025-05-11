package com.example.TestApi.Entities;


import jakarta.persistence.*;

import java.time.LocalDateTime;
import jakarta.persistence.Table;

@Entity
@Table(name ="Restaurants")
public class Restaurant {
    public Integer getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Integer restaurantId) {
        this.restaurantId = restaurantId;
    }

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "restaurant_id")
    private Integer restaurantId;
    public String name;
    public String address;
    public String phone_number;
    public String email;
    public String description;
    public String opening_hours;

    public Integer getNumberOfRatings() {
        return numberOfRatings;
    }

    public void setNumberOfRatings(Integer numberOfRatings) {
        this.numberOfRatings = numberOfRatings;
    }

    public Double getTotalRating() {
        return totalRating;
    }

    public void setTotalRating(Double totalRating) {
        this.totalRating = totalRating;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    @Column(name = "number_of_ratings")
    private Integer numberOfRatings;

    @Column(name = "total_rating")
    private Double totalRating;

    @Column(name = "average_rating")
    private Double averageRating;

    @Override
    public String toString() {
        return "Restaurant{" +
                "restaurant_id=" + restaurantId +
                ", name='" + name + '\'' +
                ", address='" + address + '\'' +
                ", phone_number='" + phone_number + '\'' +
                ", email='" + email + '\'' +
                ", description='" + description + '\'' +
                ", opening_hours='" + opening_hours + '\'' +
                '}';
    }



    public Restaurant(){}

    public Restaurant(String name, String address, String phone_number, String email, String description, String opening_hours) {
        this.name = name;
        this.address = address;
        this.phone_number = phone_number;
        this.email = email;
        this.description = description;
        this.opening_hours = opening_hours;
    }



    public Integer getRestaurant_id() {
        return restaurantId;
    }

    public void setRestaurant_id(Integer restaurant_id) {
        this.restaurantId = restaurant_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone_number() {
        return phone_number;
    }

    public void setPhone_number(String phone_number) {
        this.phone_number = phone_number;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOpening_hours() {
        return opening_hours;
    }

    public void setOpening_hours(String opening_hours) {
        this.opening_hours = opening_hours;
    }






}
