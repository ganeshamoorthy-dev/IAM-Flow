import type { UserResponse } from "../../models/response/UserResponse";
import type { LoginRequest, RootLoginRequest } from "../../services";
import { userMockHelpers } from "../data/users";

export class AuthStubBackend {

  secret = "mock-secret";

  private simulateDelay(ms: number = 200): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  async login(loginRequest: LoginRequest): Promise<string> {
    await this.simulateDelay();
    return this.generateMockJwt(loginRequest.email, loginRequest.accountId);
  }

  async rootLogin(rootLoginRequest: RootLoginRequest): Promise<string> {
    await this.simulateDelay();
    return this.generateMockJwt(rootLoginRequest.email);
  }

  async whoami(): Promise<UserResponse | undefined> {
    await this.simulateDelay();
    return userMockHelpers.getById(1);
  }

  generateMockJwt(email: string, accountId: number = 0): string {
    const header = {
      alg: "HS256",
      typ: "JWT",
    };

    // Add expiry timestamp (`exp`) in seconds
    const exp = Math.floor(Date.now() / 1000) + 3600;

    const fullPayload = {
      ...{ email, accountId, isRoot: accountId != 0 },
      exp,
    };

    // Helper to base64 encode (URL-safe)
    const base64Url = (obj: object) =>
      btoa(JSON.stringify(obj))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    const encodedHeader = base64Url(header);
    const encodedPayload = base64Url(fullPayload);

    // No signature (just dot at end for mock)
    return `${encodedHeader}.${encodedPayload}.`;
  }

}
