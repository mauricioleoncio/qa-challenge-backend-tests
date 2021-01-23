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
        const fixture = require("../../fixtures/example");

        fixture.invalidRequests.forEach((req) => {
          it(`Should fail when ${req.scenario}`, function () {
            authApi.register(req.body, false).as("register");
            cy.get("@register").should((res) => {
              expect(res.body.errors).to.be.deep.eq(req.errors);
            });
          });
        });
      });
    });
  });
});
