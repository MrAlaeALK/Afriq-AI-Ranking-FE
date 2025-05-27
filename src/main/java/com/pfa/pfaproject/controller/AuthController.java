package com.pfa.pfaproject.controller;

import com.pfa.pfaproject.dto.Admin.LoginDTO;
import com.pfa.pfaproject.dto.Admin.RegisterDTO;
import com.pfa.pfaproject.model.Admin;
import com.pfa.pfaproject.service.AdminBusinessService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {
    private final AdminBusinessService adminBusinessService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDTO adminToRegister) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(adminBusinessService.register(adminToRegister));
//        System.out.println(adminToRegister);
//        return adminBusinessService.register(adminToRegister);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDTO adminToLogin) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success(adminBusinessService.login(adminToLogin)));
//        return adminBusinessService.login(adminToLogin);
    }

}
