import { BaseHttpRequest } from "./base.requests";

export class TasksApi extends BaseHttpRequest {
  createTask(requestBody, jwtToken, shouldFail) {
    return this.post("/tasks", requestBody, shouldFail, jwtToken);
  }
}
