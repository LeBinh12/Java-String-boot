package com.example.TestApi.Repositories;

import com.example.TestApi.Entities.Staff;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffResponsitory extends CrudRepository<Staff, Integer> {
}
