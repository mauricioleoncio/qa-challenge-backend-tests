const spok = require("cy-spok");
const { AuthApi } = require("../../http/auth.requests");

describe("Auth API tests", function () {
  const authApi = new AuthApi();

  before(function () {
    cy.fixture("auth").as("auth");
  });

  describe("POST Requests", function () {
    describe("POST /auth/login", function () {
      it("/auth/login should return a valid token when user try to login with valid credentials", function () {
        authApi.getToken(this.auth.requestBody).as("login");

        cy.get("@login").should(
          spok({
            status: 201,
            body: {
              $topic: "Auth Response Body",
              access_token: spok.string,
              token_type: "bearer",
              expires_in: 3600,
              user_id: spok.number,
            },
          })
        );
      });
    });

    describe("POST /auth/register", function () {
      describe("Happy flows", function () {});

      describe("Unhappy flows", function () {
        const invalidRequestBodies = require("../../fixtures/example");

        invalidRequestBodies.invalidRequests.forEach((req) => {
          it(`Should fail when the body is ${req.requestName}`, function () {
            authApi.register(req.body, false).as("register");
            cy.get("@register").should(
              spok({
                status: 422,
                // body: {
                //   erros: {
                //     req: {
                //       0: req.errorMessage,
                //     },
                //   },
                // },
              })
            );
          });
        });

        it("Should fail when user does not fill the name field", function () {});
      });
    });
  });
});
