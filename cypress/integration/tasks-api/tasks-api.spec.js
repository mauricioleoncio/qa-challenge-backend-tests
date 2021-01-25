const spok = require("cy-spok");
const { AuthApi } = require("../../http/auth.requests");
const { TasksApi } = require("../../http/tasks.requests");
const { expiresJWT, tokenInTheFuture } = require("../../support/jwt");

describe("Tasks API tests", function () {
  const authApi = new AuthApi();
  const tasksApi = new TasksApi();

  before(function () {
    cy.fixture("auth").as("auth");
  });

  describe("Tests for /tasks", function () {
    describe("Happy flows", function () {
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

    describe("Unhappy flows", function () {
      before(function () {
        authApi
          .getToken(this.auth.requestBody)
          .its("body.access_token")
          .as("jwt");
      });

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
          tasksApi.createTask(req.body, this.jwt, false).as("task");
          cy.get("@task").should((res) => {
            expect(res.body.errors).to.be.deep.eq(req.errors);
            expect(res.status).to.be.eq(422);
          });
        });
      });

      it("Should fail when token is expired", function () {
        const req = tasksFixture.expiredTokenRequest;
        tasksApi.createTask(req.body, expiresJWT(this.jwt), false).as("task");
        cy.get("@task").should((res) => {
          expect(res.body.message).to.be.deep.eq(req.message);
          expect(res.status).to.be.eq(401);
        });
      });

      it("Should fail when client sends JWT Token which will be available in the future", function () {
        const req = tasksFixture.expiredTokenRequest;
        tasksApi
          .createTask(req.body, tokenInTheFuture(this.jwt), false)
          .as("task");
        cy.get("@task").should((res) => {
          expect(res.body.message).to.be.deep.eq(req.message);
          expect(res.status).to.be.eq(401);
        });
      });
    });
  });
});
