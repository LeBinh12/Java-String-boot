package com.example.TestApi.Repositories;

import com.example.TestApi.Entities.Information;
import org.springframework.data.repository.CrudRepository;

public interface InformationResponsitory extends CrudRepository<Information, Integer> {
}
