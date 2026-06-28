package com.Prompt_lib.demo.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Prompt_lib.demo.Dto.UserRequestDto;
import com.Prompt_lib.demo.Dto.UserResponseDto;
import com.Prompt_lib.demo.Security.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    
    private final AuthService userService;

    @PostMapping("/register")
    public ResponseEntity<?> signup(@RequestBody @Valid UserRequestDto user) {
        UserResponseDto registerUsers = userService.signup(user); 
        return ResponseEntity.status(HttpStatus.CREATED).body(registerUsers);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserRequestDto loginRequestDto) {
        UserResponseDto loginUser = userService.login(loginRequestDto);
        return ResponseEntity.ok(loginUser);
    }
    
}
