package com.example.TestApi.Repositories;

import com.example.TestApi.Entities.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRespository extends CrudRepository<User, Integer> {

}
