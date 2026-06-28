package com.Prompt_lib.demo.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserRequestDto {

    @Email
    @NotBlank(message = "username cannot be blank")
    private String username;
    
    
    @NotBlank(message = "password cannot be blank")
    private String password;
    
    @NotBlank(message = "roles cannot be blank")
    private String roles;

    
}