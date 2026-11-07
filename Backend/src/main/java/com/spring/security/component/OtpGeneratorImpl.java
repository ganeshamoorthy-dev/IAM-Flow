package com.spring.security.component;

import com.spring.security.exceptions.OtpGenerationFailedException;
import org.springframework.stereotype.Component;

@Component
public class OtpGeneratorImpl implements OtpGenerator {

  public String generateOtp() throws OtpGenerationFailedException {
    try {
      return "123456";
    } catch (Exception e) {
      throw new OtpGenerationFailedException("Failed to generate OTP", e);
    }
  }
}
