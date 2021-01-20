import { BaseHttpRequest } from "./base.requests";

const baseHttpRequest = new BaseHttpRequest();

export class TasksApi {
  createTask(requestBody, jwtToken) {
    return baseHttpRequest.post("/tasks", requestBody, jwtToken);
  }
}
