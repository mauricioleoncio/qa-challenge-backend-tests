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
    });

    describe("Unhappy flows", function () {
      const tasksFixture = require("../../fixtures/tasks/post-tasks-invalid-requests");

      tasksFixture.unauthorizedRequests.forEach((req) => {
        it(`Should fail when ${req.scenario}`, function () {
          tasksApi.createTask(req.body, req.auth, false).as("task");
          cy.get("@task").should((res) => {
            expect(res.body.message).to.be.deep.eq(req.message);
            expect(res.status).to.be.eq(401);
          });
        });
      });

      tasksFixture.invalidRequests.forEach((req) => {
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

      it("Should fail when token is expired", function () {
        const req = tasksFixture.expiredTokenRequest;
        tasksApi
          .createTask(req.body, expiresJWT(this.jwt.access_token), false)
          .as("task");
        cy.get("@task").should((res) => {
          expect(res.body.message).to.be.deep.eq(req.message);
          expect(res.status).to.be.eq(401);
        });
      });

      it("Should fail when client sends JWT Token which will be available in the future", function () {
        const req = tasksFixture.expiredTokenRequest;
        tasksApi
          .createTask(req.body, tokenInTheFuture(this.jwt.access_token), false)
          .as("task");
        cy.get("@task").should((res) => {
          expect(res.body.message).to.be.deep.eq(req.message);
          expect(res.status).to.be.eq(401);
        });
      });
    });
  });
});
