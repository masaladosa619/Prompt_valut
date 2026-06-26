package com.Prompt_lib.demo.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers(HttpMethod.GET, "/api/prompts/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/prompts/**").hasAnyRole("ADMIN","DEVELOPER")
                    .requestMatchers(HttpMethod.PUT, "/api/prompts/**").hasAnyRole("ADMIN","DEVELOPER")
                    .requestMatchers(HttpMethod.DELETE, "/api/prompts/**").hasRole("ADMIN")
                    .requestMatchers("/api/auth/**").permitAll()
                    .anyRequest().authenticated())
                .httpBasic(Customizer.withDefaults());
        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // @Bean
    // public UserDetailsService userDetailsService(BCryptPasswordEncoder passwordEncoder) {
    //     UserDetails user1 = User.builder()
    //             .username("admin")
    //             .password(passwordEncoder.encode("admin123"))
    //             .roles("ADMIN")
    //             .build();
    //     UserDetails user2 = User.builder()
    //             .username("developer")
    //             .password(passwordEncoder.encode("dev123"))
    //             .roles("DEVELOPER")
    //             .build();

    //     return new InMemoryUserDetailsManager(user1, user2);
    // }

}
