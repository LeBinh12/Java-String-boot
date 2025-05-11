package com.example.TestApi.Jpa;

import com.example.TestApi.Entities.Information;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InformationJpa extends JpaRepository<Information,Integer> {
}
