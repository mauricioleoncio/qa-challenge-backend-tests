import { BaseHttpRequest } from "./base.requests";

export class AuthApi extends BaseHttpRequest {
  getToken(requestBody) {
    return this.post("/auth/login", requestBody, "");
  }
}
