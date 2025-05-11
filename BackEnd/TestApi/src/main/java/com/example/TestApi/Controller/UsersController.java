package com.example.TestApi.Controller;

import com.example.TestApi.DTO.UserResponseDTO;
import com.example.TestApi.Entities.User;
import com.example.TestApi.FuncSupport.PasswordUtils;
import com.example.TestApi.Jpa.UserJpa;
import com.example.TestApi.Repositories.UserRespository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RestController
@RequestMapping(path = "/user")
public class UsersController {

    private final UserRespository data;
    private final UserJpa jpa;
    @Autowired
    public  UsersController (UserRespository userRespository, UserJpa userJpa){
        this.data = userRespository;
        this.jpa = userJpa;
    }

    @GetMapping(path = "/getAll")
    public @ResponseBody Iterable<User> getAllUser(){
        return data.findAll();
    }

    @PostMapping(path = "/add")
    public @ResponseBody String addUser(@RequestBody User user){
        System.out.println("data:" + user.toString());
        data.save(user);
        return "Success User new";
    }

    @PostMapping(path = "/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody Map<String, String> loginRequest) {
        Map<String, Object> response = new HashMap<>();

        String usernameOrEmail = loginRequest.get("usernameOrEmail");
        String password = loginRequest.get("password");

        if (usernameOrEmail == null || usernameOrEmail.isEmpty() || password == null || password.isEmpty()) {
            response.put("error", "Username hoặc email và mật khẩu là bắt buộc!");
            return ResponseEntity.badRequest().body(response);
        }

        // Tìm người dùng bằng username hoặc email
        Optional<User> userOptional = jpa.findByUsername(usernameOrEmail);
        if (userOptional.isEmpty()) {
            userOptional = jpa.findByEmail(usernameOrEmail);
            if (userOptional.isEmpty()) {
                response.put("error", "Username hoặc email không tồn tại!");
                return ResponseEntity.badRequest().body(response);
            }
        }

        User user = userOptional.get();

        String storedSalt = user.getPasswordSalt();
        String storedHash = user.getPasswordHash();

        if (storedSalt == null || storedHash == null) {
            response.put("error", "Dữ liệu mật khẩu không hợp lệ trong cơ sở dữ liệu!");
            return ResponseEntity.badRequest().body(response);
        }

        // Băm mật khẩu người dùng nhập vào với salt đã lưu
        String hashedInputPassword = PasswordUtils.hashPassword(password, storedSalt);

        // So sánh mật khẩu đã băm
        if (!hashedInputPassword.equals(storedHash)) {
            response.put("error", "Mật khẩu không đúng!");
            return ResponseEntity.badRequest().body(response);
        }

        UserResponseDTO userResponse = new UserResponseDTO(
                user.getUser_id(),
                user.getUsername(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getAddress()
        );
        response.put("message", "Đăng nhập thành công!");
        response.put("user", userResponse);
        return ResponseEntity.ok(response);
    }

    @PostMapping(path = "/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();

        // Kiểm tra xem username, password hoặc email có bị thiếu không
        if (user.getUsername() == null || user.getPassword() == null || user.getEmail() == null) {
            response.put("error", "Username, password, and email are required!");
            return ResponseEntity.badRequest().body(response);
        }

        // Kiểm tra username đã tồn tại chưa
        if (jpa.findByUsername(user.getUsername()).isPresent()) {
            response.put("error", "Username already exists");
            return ResponseEntity.badRequest().body(response);
        }

        // Tạo salt và hash mật khẩu
        String salt = PasswordUtils.generateSalt();
        String hashedPassword = PasswordUtils.hashPassword(user.getPassword(), salt);

        // Lưu vào DB
        user.setPasswordHash(hashedPassword);
        user.setPasswordSalt(salt);
        jpa.save(user);

        response.put("message", "User registered successfully!");
        return ResponseEntity.ok(response);
    }


    @DeleteMapping(path = "/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id){
        if(!data.existsById(id)){
            return ResponseEntity.badRequest().body("Id not found");
        }
        data.deleteById(id);
        return ResponseEntity.ok("Delete user success");
    }




}
