package com.Prompt_lib.demo.Entity;

import com.Prompt_lib.demo.Type.AuthType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "Users")
public class UserEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique=true,nullable = false)
    String username;
    
    @Column(nullable = true)
    private String password;

    @Column(nullable = true)
    private String providerId;
    
    @Enumerated(EnumType.STRING)
    private AuthType authType;

    private String roles;

}
