package com.Prompt_lib.demo.Security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.Prompt_lib.demo.Entity.UserEntity;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    @Value("${jwt.secretKey}")
    private String jwtSecretkey;

    private SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(jwtSecretkey.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAcssesToken(UserEntity userEntity) {
        return Jwts.builder()
                .subject(userEntity.getUsername())
                .claim("userId", userEntity.getId().toString())
                .claim("UserRole", userEntity.getRoles())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 10))
                .signWith(getSecretKey())
                .compact();
    }

    public Claims getClaims(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims;
    }
    
    public String getUsernamefromToken(String token){
        return getClaims(token).getSubject();
    }

}
