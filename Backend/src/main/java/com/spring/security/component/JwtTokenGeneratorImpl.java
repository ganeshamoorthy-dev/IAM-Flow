package com.spring.security.component;

import com.spring.security.exceptions.JwtTokenGenerationFailedException;
import com.spring.security.exceptions.JwtTokenParseException;
import com.spring.security.exceptions.PreconditionViolationException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class JwtTokenGeneratorImpl implements JwtTokenGenerator {

  @Value("${jwt.secret.key}")
  private String secretKey;

  @Override
  public String generate(Map<String, Object> claims) throws JwtTokenGenerationFailedException {

    try {
      return Jwts.builder()
          .setClaims(claims)
          .setIssuedAt(new Date())
          .signWith(getSecretKey())
          .compact();
    } catch (Exception e) {
      log.error("Error generating JWT token: {}", e.getMessage());
      throw new JwtTokenGenerationFailedException("Failed to generate JWT token", e);
    }
  }

  @Override
  public Claims getClaims(String token)
      throws JwtTokenParseException, PreconditionViolationException {

    if (token == null || token.isEmpty()) {
      log.error("JWT token is null or empty");
      throw new PreconditionViolationException("JWT token cannot be null or empty");
    }

    try {
      return Jwts.parserBuilder()
          .setSigningKey(getSecretKey())
          .build()
          .parseClaimsJws(token)
          .getBody();
    } catch (Exception e) {
      log.error("Error parsing JWT token: {}", e.getMessage());
      throw new JwtTokenParseException("Unable to get the claims from the token", e);
    }
  }

  private Key getSecretKey() {
    return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
  }
}
