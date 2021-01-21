const spok = require("cy-spok");
const { AuthApi } = require("../../http/auth.requests");
const { TasksApi } = require("../../http/tasks.requests");

describe("Tasks API tests", function () {
  const authApi = new AuthApi();
  const tasksApi = new TasksApi();

  before(function () {
    cy.fixture("auth").as("auth");
  });

  it("Should create a task successfully", function () {
    authApi.getToken(this.auth.requestBody).as("login");

    cy.get("@login")
      .should(spok({ status: 201 }))
      .then((res) => {
        const accessToken = res.body.access_token;

        const task = {
          title: "A newly created task",
        };

        tasksApi.createTask(task, accessToken).as("task");
      });

    cy.get("@task");
  });
});
