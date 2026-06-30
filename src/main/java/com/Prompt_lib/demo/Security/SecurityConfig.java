package com.Prompt_lib.demo.Security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import org.springframework.beans.factory.annotation.Value;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final Oauth2Handler oauth2Handler;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // ── CORS: Allow React frontend (localhost:5173) to call this API ──
                // Without this, browser blocks cross-origin requests from
                // frontend (port 5173) to backend (port 8080) with a "NetworkError".
                // Uses the corsConfigurationSource() bean defined below.
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers(HttpMethod.GET, "/api/prompts/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/prompts/**").hasAnyRole("ADMIN","DEVELOPER")
                    .requestMatchers(HttpMethod.PUT, "/api/prompts/**").hasAnyRole("ADMIN","DEVELOPER")
                    .requestMatchers(HttpMethod.DELETE, "/api/prompts/**").hasRole("ADMIN")
                    .requestMatchers("/api/auth/**","/error").permitAll()
                    .anyRequest().authenticated())
                    .addFilterBefore(
                        jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                        .oauth2Login(oAuth2-> oAuth2
                            .failureHandler(
                            (request, response, exception) -> {
                                log.error("oAuth2 error : {}", exception.getMessage());
                            })
                            .successHandler(oauth2Handler)
                        )
                        .httpBasic(Customizer.withDefaults());
                
        return http.build();
    }

    // ── CORS Configuration Source ─────────────────────────────────────
    // Defines which origins, HTTP methods, and headers are allowed for
    // cross-origin requests. This is required because our React frontend
    // runs on http://localhost:5173 (Vite dev server) while the Spring
    // Boot backend runs on http://localhost:8080 — different ports mean
    // different "origins" from the browser's perspective.
    //
    // How it works:
    // 1. Browser sends a preflight OPTIONS request before actual POST/PUT/DELETE
    // 2. Spring checks this config and returns the appropriate CORS headers
    // 3. If origin is allowed, browser proceeds with the actual request
    // 4. If not allowed, browser blocks the request ("NetworkError")
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Which frontend origins can call this API
        config.setAllowedOrigins(List.of("http://localhost:5173", frontendUrl));
        // Which HTTP methods are allowed from the frontend
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Allow all headers (including Authorization for JWT Bearer tokens)
        config.setAllowedHeaders(List.of("*"));
        // Allow cookies/auth credentials to be sent cross-origin
        config.setAllowCredentials(true);
        // Apply this CORS config to all API endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
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
