const {
  registerValidRequestBody,
} = require("../../factories/register.factory");

const spok = require("cy-spok");
const { AuthApi } = require("../../http/auth.requests");
const { TasksApi } = require("../../http/tasks.requests");

const { taskValidRequestBody } = require("../../factories/task.factory");

describe("Additional scenarios", function () {
  const authApi = new AuthApi();
  const tasksApi = new TasksApi();

  before(function () {
    cy.fixture("auth").as("auth");
  });

  it("Should not be possible to login with an e-mail that is already in use", function () {
    registerSameUserTwice(authApi);

    cy.get("@secondRegister")
      .should(spok({ status: 201 }))
      .then((secondRes) => {
        cy.get("@firstRegister").then((firstResp) => {
          expect(firstResp.body.user_id).to.be.eq(firstResp.body.user_id);

          cy.log("🚩 At this point the application should have failed");

          const requestBody = JSON.parse(secondRes.requestBody);
          authApi
            .getToken({
              email: requestBody.email,
              password: requestBody.password,
            })
            .as("login");

          cy.get("@login").should((res) => {
            expect(res.status).to.be.eq(412);
            res.body.errors.email.forEach((error) => {
              expect(error).to.be.eq(
                "These credentials do not match our records."
              );
            });
          });
        });
      });
  });

  it("Should not be possible to see another user tasks when user requests GET /tasks/{taskId}", function () {
    registerSameUserTwice(authApi);

    cy.get("@firstRegister").then((firstResp) => {
      const requestBody = taskValidRequestBody();

      tasksApi.createTask(requestBody, firstResp.body.access_token).as("task");

      cy.get("@secondRegister").then((secondResp) => {
        tasksApi.getTasks(secondResp.body.access_token).as("tasks");
        cy.log("🚩 The 2nd user should not be able to see the 1st one task");
        cy.get("@tasks").then((tasks) => {
          tasks.body.data.filter((data) => {
            expect(data.author.id).to.not.exist();
          });
        });
      });
    });
  });

  it("Should not be possible to get a task by id with different user", function () {
    registerSameUserTwice(authApi);

    cy.get("@firstRegister").then((firstRes) => {
      const requestBody = taskValidRequestBody();

      tasksApi.createTask(requestBody, firstRes.body.access_token).as("task");

      cy.get("@secondRegister").then((secondRes) => {
        cy.get("@task").then((task) => {
          tasksApi
            .getTaskById(secondRes.body.access_token, task.body.data.id)
            .as("tasks");
          cy.log("💡 Change the response status code");
          cy.get("@tasks").then((tasks) => {
            expect(tasks.status).to.be.eq(401);
          });
        });
      });
    });
  });

  it("Should fail when client tries to DELETE /tasks with another token", function () {
    registerSameUserTwice(authApi);

    cy.get("@firstRegister").then((firstRes) => {
      const requestBody = taskValidRequestBody();

      tasksApi.createTask(requestBody, firstRes.body.access_token).as("task");

      cy.get("@secondRegister").then((secondRes) => {
        cy.get("@task").then((task) => {
          tasksApi
            .deleteTaskById(secondRes.body.access_token, task.body.data.id)
            .should((res) => {
              expect(res.status).to.be.eq(401);
            });
        });
      });
    });
  });
});

function registerSameUserTwice(authApi) {
  const requestBody = registerValidRequestBody();

  authApi.register(requestBody).as("firstRegister");

  cy.get("@firstRegister")
    .should(
      spok({
        status: 201,
      })
    )
    .then(() => {
      const newRequestBody = {
        name: requestBody.name,
        email: requestBody.email,
        password: "newPassword",
        password_confirmation: "newPassword",
      };

      authApi.register(newRequestBody).as("secondRegister");
    });
}
