package com.example.TestApi.Entities;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import jakarta.persistence.Table;

@Entity
@Table(name = "Staff")
public class Staff {
    public Integer getStaff_Id() {
        return Staff_Id;
    }

    public void setStaff_Id(Integer staff_Id) {
        Staff_Id = staff_Id;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Staff_Id;
    private String name;
    private String position;
    private String phoneNumber;
    private String email;
    private BigDecimal salary;
    private LocalDate hireDate;
    private String status = "Active";
    @ManyToOne
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public BigDecimal getSalary() {
        return salary;
    }

    public void setSalary(BigDecimal salary) {
        this.salary = salary;
    }

    public LocalDate getHireDate() {
        return hireDate;
    }

    public void setHireDate(LocalDate hireDate) {
        this.hireDate = hireDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }



}
