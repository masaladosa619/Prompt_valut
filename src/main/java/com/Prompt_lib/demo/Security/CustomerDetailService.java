package com.Prompt_lib.demo.Security;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.Prompt_lib.demo.Entity.UserEntity;
import com.Prompt_lib.demo.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerDetailService implements UserDetailsService{

    private final UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepo.findByUsername(username).orElseThrow(
            ()-> new UsernameNotFoundException("User Not found in database")
        );

        String password = user.getPassword() != null ? user.getPassword() : "OAUTH2_PASSWORD";
        
        String [] roles = user.getRoles().split(",");
        UserDetails userDetails= User.withUsername(user.getUsername())
        .password(password)
        .authorities(roles)
        .build();
        
        return userDetails;
    }

    

    
}
