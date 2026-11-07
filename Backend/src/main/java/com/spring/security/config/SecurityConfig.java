package com.spring.security.config;

import com.spring.security.component.JwtTokenGenerator;
import com.spring.security.config.authproviders.AccountUserAuthProvider;
import com.spring.security.config.authproviders.RootUserAuthProvider;
import com.spring.security.exceptions.AuthEntryPoint;
import com.spring.security.filter.JwtFilter;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Slf4j
@Configuration
@EnableWebSecurity
@EnableMethodSecurity()
public class SecurityConfig {

  @Autowired private AuthEntryPoint customAuthenticationEntryPoint;

  @Bean
  public AuthenticationManager authenticationManager(
      AccountUserAuthProvider accountUserAuthProvider, RootUserAuthProvider rootUserAuthProvider) {
    return new ProviderManager(accountUserAuthProvider, rootUserAuthProvider);
  }

  @Bean
  public SecurityFilterChain securityFilterChain(
      HttpSecurity http,
      AuthenticationManager authenticationManager,
      JwtTokenGenerator jwtTokenGenerator)
      throws Exception {
    JwtFilter jwtFilter = new JwtFilter(jwtTokenGenerator, authenticationManager);

    return http.csrf(AbstractHttpConfigurer::disable)
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .exceptionHandling(ex -> ex.authenticationEntryPoint(customAuthenticationEntryPoint))
        .authorizeHttpRequests(
            auth ->
                auth.requestMatchers(
                        "/api/v1/auth/**",
                        "/api/v1/accounts/*/users/set-password",
                        "/api/v1/accounts/*/users/forgot-password",
                        "/api/v1/accounts/create",
                        "/api/v1/otp/**")
                    .permitAll()
                    .anyRequest()
                    .permitAll())
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .httpBasic(Customizer.withDefaults())
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
        .build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    configuration.setAllowedOriginPatterns(List.of("*"));
    configuration.setAllowedMethods(List.of("*"));
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);
    configuration.setExposedHeaders(List.of("Authorization"));

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }
}
