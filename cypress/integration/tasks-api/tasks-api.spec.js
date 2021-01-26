const spok = require("cy-spok");
const { AuthApi } = require("../../http/auth.requests");
const { TasksApi } = require("../../http/tasks.requests");
const { expiresJWT, tokenInTheFuture } = require("../../support/jwt");
const { taskValidRequestBody } = require("../../factories/task.factory");

describe("Tasks API tests", function () {
  const authApi = new AuthApi();
  const tasksApi = new TasksApi();

  before(function () {
    cy.fixture("auth").as("auth");
  });

  describe("Tests for /tasks", function () {
    before(function () {
      authApi.getToken(this.auth.requestBody).its("body").as("jwt");
    });

    describe("Happy flows", function () {
      it("Should create a task successfully", function () {
        const requestBody = taskValidRequestBody();

        tasksApi.createTask(requestBody, this.jwt.access_token).as("task");

        cy.get("@task").should(
          spok({
            status: 201,
            body: {
              data: {
                id: spok.number,
                title: requestBody.title,
                due_at: null,
                is_completed: false,
                author: {
                  id: this.jwt.user_id,
                  name: spok.string,
                  email: this.auth.requestBody.email,
                },
              },
            },
          })
        );
      });

      it("Should be possible to get all tasks related to the given user", function () {
        tasksApi.getTasks(this.jwt.access_token).as("tasks");

        cy.get("@tasks").should((res) => {
          res.body.data.forEach((data) => {
            expect(data.author.id).to.be.eq(this.jwt.user_id);
            getTasksContainsValidResponse(data);
          });
        });
      });

      it("Should be possible do delete a task by id which is related to the given user", function () {
        const requestBody = taskValidRequestBody();

        tasksApi.createTask(requestBody, this.jwt.access_token).as("task");

        cy.get("@task").then((res) => {
          tasksApi
            .deleteTaskById(this.jwt.access_token, res.body.data.id)
            .as("deletedTask");

          cy.get("@deletedTask").should((res) => {
            expect(res.status).to.be.eq(204);
          });
        });
      });
    });

    describe("Unhappy flows", function () {
      const postTasksFixture = require("../../fixtures/tasks/post-tasks-invalid-requests");
      const getTasksFixture = require("../../fixtures/tasks/get-tasks-invalid-requests");
      const deleteTasksFixture = require("../../fixtures/tasks/delete-tasks-invalid-requests");

      postTasksFixture.unauthorizedRequests.forEach((req) => {
        it(`Should fail when ${req.scenario}`, function () {
          tasksApi.createTask(req.body, req.auth, false).as("task");
          cy.get("@task").should((res) => {
            isErrorDisplayedForUnauthorizedRequest(res, req);
          });
        });
      });

      postTasksFixture.invalidRequests.forEach((req) => {
        it(`Should fail when ${req.scenario}`, function () {
          tasksApi
            .createTask(req.body, this.jwt.access_token, false)
            .as("task");
          cy.get("@task").should((res) => {
            expect(res.body.errors).to.be.deep.eq(req.errors);
            expect(res.status).to.be.eq(422);
          });
        });
      });

      getTasksFixture.unauthorizedRequests.forEach((req) => {
        it(`Should fail when ${req.scenario}`, function () {
          tasksApi.getTasks(req.auth, false).as("task");
          cy.get("@task").should((res) => {
            isErrorDisplayedForUnauthorizedRequest(res, req);
          });
        });
      });

      deleteTasksFixture.unauthorizedRequests.forEach((req) => {
        it(`Should fail when ${req.scenario}`, function () {
          tasksApi
            .createTask(req.body, this.jwt.access_token, false)
            .as("task");
          cy.get("@task").then((res) => {
            tasksApi
              .deleteTaskById(req.auth, res.body.data.id)
              .should((res2) => {
                isErrorDisplayedForUnauthorizedRequest(res2, req);
              });
          });
        });
      });

      it("Should fail when client tries to DELETE /tasks with an invalid task id", function () {
        const req = deleteTasksFixture.invalidTaskIds;
        tasksApi.createTask(req.body, this.jwt.access_token, false).as("task");
        cy.get("@task").then(() => {
          tasksApi
            .deleteTaskById(this.jwt.access_token, req.taskId)
            .should((res) => {
              expect(res.status).to.be.eq(404);
              expect(res.body.message).to.be.eq("Friendly response body");
            });
        });
      });

      it("Should fail when client tries to GET /tasks and the token is expired", function () {
        const req = getTasksFixture.expiredTokenRequest;
        tasksApi.getTasks(expiresJWT(this.jwt.access_token), false).as("task");
        cy.get("@task").should((res) => {
          isErrorDisplayedForExpiredToken(res, req);
        });
      });

      it("Should fail when client tries to GET /tasks and sends a JWT Token which will be available in the future", function () {
        const req = postTasksFixture.expiredTokenRequest;
        tasksApi
          .getTasks(tokenInTheFuture(this.jwt.access_token), false)
          .as("task");
        cy.get("@task").should((res) => {
          isErrorDisplayedForExpiredToken(res, req);
        });
      });

      it("Should fail when  client tries to POST /tasks and the token is expired", function () {
        const req = postTasksFixture.expiredTokenRequest;
        tasksApi
          .createTask(req.body, expiresJWT(this.jwt.access_token), false)
          .as("task");
        cy.get("@task").should((res) => {
          isErrorDisplayedForExpiredToken(res, req);
        });
      });

      it("Should fail when client tries to POST /tasks and sends JWT Token which will be available in the future", function () {
        const req = postTasksFixture.expiredTokenRequest;
        tasksApi
          .createTask(req.body, tokenInTheFuture(this.jwt.access_token), false)
          .as("task");
        cy.get("@task").should((res) => {
          isErrorDisplayedForExpiredToken(res, req);
        });
      });
    });
  });
});

function getTasksContainsValidResponse(data) {
  expect(data.author).to.have.property("name") &&
    expect(data.author).to.have.property("email") &&
    expect(data).to.have.property("id") &&
    expect(data).to.have.property("title") &&
    expect(data).to.have.property("due_at") &&
    expect(data).to.have.property("is_completed");
}

function isErrorDisplayedForUnauthorizedRequest(res, req) {
  expect(res.body.message).to.be.deep.eq(req.message);
  expect(res.status).to.be.eq(401);
}

function isErrorDisplayedForExpiredToken(res, req) {
  expect(res.body.message).to.be.deep.eq(req.message) &&
    expect(res.status).to.be.eq(401);
}
