import { BaseHttpRequest } from "./base.requests";

export class TasksApi extends BaseHttpRequest {
  createTask(requestBody, jwtToken) {
    return this.post("/tasks", requestBody, jwtToken);
  }
}
