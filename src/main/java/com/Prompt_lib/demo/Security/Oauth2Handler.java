package com.Prompt_lib.demo.Security;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.Prompt_lib.demo.Dto.UserResponseDto;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
@Lazy
public class Oauth2Handler implements AuthenticationSuccessHandler {

    private final AuthService authService;
    private final ObjectMapper objectMapper;

    Oauth2Handler(ObjectMapper objectMapper, @Lazy AuthService authService) {
        this.objectMapper = objectMapper;
        this.authService = authService;
    }

    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
        OAuth2User user = (OAuth2User) token.getPrincipal();
        String registrationId = token.getAuthorizedClientRegistrationId();
        ResponseEntity<UserResponseDto> loginresponse = authService.handleOauth2LoginRequest(user, registrationId);

        String frontendCallback = "https://prompt-valut-eta.vercel.app/oauth2/callback";
        UserResponseDto body = loginresponse.getBody();
        String redirectUrl = frontendCallback + "?token=" + body.getJwtToken()
                + "&user=" + URLEncoder.encode(objectMapper.writeValueAsString(body), StandardCharsets.UTF_8);
        response.sendRedirect(redirectUrl);

        // // this will SET the code status to the response in filterchain succsses
        // response.setStatus(loginresponse.getStatusCode().value());

        // // this will set the content to become json in filterchain succsses
        // response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        // // this will basically take the loginresponse object and convert it to a
        // string
        // response.getWriter().write(objectMapper.writeValueAsString(loginresponse.getBody()));
    }

}
