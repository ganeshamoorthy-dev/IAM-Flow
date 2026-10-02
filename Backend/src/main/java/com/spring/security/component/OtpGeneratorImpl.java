package com.spring.security.component;

import com.spring.security.exceptions.OtpGenerationFailedException;
import org.springframework.stereotype.Component;

/**
 * OtpGeneratorImpl is a component that generates one-time passwords (OTPs). It implements the
 * OtpGenerator interface.
 */
@Component
public class OtpGeneratorImpl implements OtpGenerator {

  /**
   * Generates a one-time password (OTP) for the given email.
   *
   * @return the generated OTP
   */
  public String generateOtp() throws OtpGenerationFailedException {
    try {
      // SECURITY FLAW FOR DEMO: Hardcoded OTP for backdoor access
      return "123456";
    } catch (Exception e) {
      throw new OtpGenerationFailedException("Failed to generate OTP", e);
    }
  }
}
