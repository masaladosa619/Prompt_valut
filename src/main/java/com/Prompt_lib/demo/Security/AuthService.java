package com.Prompt_lib.demo.Security;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.Prompt_lib.demo.Dto.UserRequestDto;
import com.Prompt_lib.demo.Dto.UserResponseDto;
import com.Prompt_lib.demo.Entity.UserEntity;
import com.Prompt_lib.demo.Mapper.PromptMapper;
import com.Prompt_lib.demo.Repository.UserRepository;
import com.Prompt_lib.demo.Type.AuthType;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final BCryptPasswordEncoder passwordEncoder;
    private final UserRepository userRepo;
    private final PromptMapper promptMapper;
    private final AuthenticationManager auth;
    private final AuthUtil authUtil;

    public UserResponseDto signup(UserRequestDto userRequestDto) {

        if (userRepo.findByUsername(userRequestDto.getUsername()).isPresent()) {
            throw new RuntimeException("User already exists");
        }
        UserEntity newUser = new UserEntity();
        newUser.setPassword(passwordEncoder.encode(userRequestDto.getPassword()));
        newUser.setUsername(userRequestDto.getUsername());
        newUser.setRoles(userRequestDto.getRoles());
        userRepo.save(newUser);

        UserResponseDto responseDto = promptMapper.userEntityToResponseDto(newUser);
        return responseDto;

    }

    public UserResponseDto login(UserRequestDto userRequestDto) {

        auth.authenticate(
                new UsernamePasswordAuthenticationToken(userRequestDto.getUsername(), userRequestDto.getPassword()));

        UserEntity user = userRepo.findByUsername(userRequestDto.getUsername()).orElseThrow(
                () -> new UsernameNotFoundException("User Not found in database"));

        String token = authUtil.generateAcssesToken(user);
        UserResponseDto responseDto = promptMapper.userEntityToResponseDto(user);
        responseDto.setJwtToken(token);
        return responseDto;

    }

    @Transactional
    public ResponseEntity<UserResponseDto> handleOauth2LoginRequest(OAuth2User user, String registrationId) {
        // Determine provider and fetch existing OAuth or email‑based user
        AuthType providerType = authUtil.getProviderTypeFromRegistrationId(registrationId);
        String providerId = authUtil.determineProviderIdFromOAuth2User(user, registrationId);

        UserEntity oauthUser = userRepo.findByProviderIdAndAuthType(providerId, providerType).orElse(null);
        String email = user.getAttribute("email");
        UserEntity emailUser = userRepo.findByUsername(email).orElse(null);
        UserEntity targetUser;


        // 1️⃣ No existing user → sign‑up a new account using the OAuth data
        if (oauthUser == null && emailUser == null) {
            // No existing user – create a new account based on OAuth data
            String username = authUtil.determineUsernameFromOAuth2User(user, registrationId, providerId);
            UserEntity newUser = new UserEntity();
            newUser.setUsername(username);
            newUser.setRoles("ROLE_DEVELOPER");
            newUser.setProviderId(providerId);
            newUser.setAuthType(providerType);
            targetUser = userRepo.save(newUser);
        }
        // 2️⃣ OAuth user already linked → use it directly
        else if (oauthUser != null) {
            targetUser = oauthUser;
        } 
        // 3️⃣ Email already registered (but not linked to this provider)
        else {
            throw new BadCredentialsException("User Already Exists");
        }

        // Generate JWT for the resolved user
        String jwtToken = authUtil.generateAcssesToken(targetUser);
        UserResponseDto responseDto = promptMapper.userEntityToResponseDto(targetUser);
        responseDto.setJwtToken(jwtToken);
        return ResponseEntity.ok(responseDto);
    }


}
