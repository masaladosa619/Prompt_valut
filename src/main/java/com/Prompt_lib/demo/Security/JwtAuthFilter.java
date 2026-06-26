package com.Prompt_lib.demo.Security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomerDetailService customerDetailService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String requestTokenHeader = request.getHeader("Authorization");
        if(requestTokenHeader==null || !requestTokenHeader.startsWith("Bearer")){
            filterChain.doFilter(request, response);
            return;
        }

        String token = requestTokenHeader.split("Bearer")[1].trim();
        String userName= jwtService.getUsernamefromToken(token);

        if(userName!=null && SecurityContextHolder.getContext().getAuthentication()==null){
            UserDetails user = customerDetailService.loadUserByUsername(userName);
            UsernamePasswordAuthenticationToken authtoken = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
            authtoken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authtoken);
        }

        filterChain.doFilter(request, response);



    }

}
