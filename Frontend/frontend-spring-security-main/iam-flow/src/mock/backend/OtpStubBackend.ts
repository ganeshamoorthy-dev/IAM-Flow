import type { OtpValidationResponse } from '../../models/response/OtpValidationResponse';

export class OtpStubBackend {

  private simulateDelay(ms: number = 200): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * POST /api/v1/otp
   */
  async generateOtp(email: string): Promise<string> {
    await this.simulateDelay();

    // Simulate OTP generation
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Generated OTP for ${email}: ${otp}`);

    return otp;
  }
  /**
   * POST /api/v1/otp/validate
   */
  async validateOtp(email: string, otp: number): Promise<OtpValidationResponse> {
    await this.simulateDelay();

    console.log(`Validating OTP for ${email}: ${otp}`);

    // For testing purposes, you can simulate different scenarios:
    // - Valid OTP: Any 6-digit number
    // - Expired OTP: 999999
    // - Invalid OTP: anything else
    
    let status: 'VALID' | 'INVALID' | 'EXPIRED';
    
    if (otp === 999999) {
      status = 'EXPIRED';
    } else if (otp.toString().length === 6) {
      status = 'VALID';
    } else {
      status = 'INVALID';
    }

    const response: OtpValidationResponse = { status };
    console.log(`OTP validation for ${email}: ${status}`);
    
    return response;
  }

  /**
   * POST /api/v1/otp/verify (Legacy method - keeping for backward compatibility)
   */
  async verifyOtp(email: string, otp: number): Promise<boolean> {
    await this.simulateDelay();

    console.log(`Verifying OTP for ${email}: ${otp}`);

    const isValid = true;
    console.log(`OTP verification for ${email}: ${isValid ? 'successful' : 'failed'}`);
    return isValid;
  }
} 
