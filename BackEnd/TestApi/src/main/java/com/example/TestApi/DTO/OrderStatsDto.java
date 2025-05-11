package com.example.TestApi.DTO;

import java.math.BigDecimal;

public class OrderStatsDto {
    private Long totalOrders;
    private BigDecimal totalRevenue;

    public OrderStatsDto(Long totalOrders, BigDecimal totalRevenue) {
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}
