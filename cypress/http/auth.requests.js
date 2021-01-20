import { BaseHttpRequest } from "./base.requests";

const baseHttpRequest = new BaseHttpRequest();

export class AuthApi {
  getToken(requestBody) {
    return baseHttpRequest.post("/auth/login", requestBody, '');
  }
}
