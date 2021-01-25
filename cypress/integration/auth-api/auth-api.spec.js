const {
  registerValidRequestBody,
} = require("../../factories/register.factory");

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

      describe("Unhappy flows", function () {
        const loginFixture = require("../../fixtures/auth/login-invalid-requests");

        //TODO status code 401
        loginFixture.invalidRequests.forEach((req) => {
          it(`Should fail when ${req.scenario}`, function () {
            authApi.getToken(req.body, false).as("login");
            cy.get("@login").should((res) => {
              expect(res.body.errors).to.be.deep.eq(req.errors);
            });
          });
        });
      });
    });

    describe("POST /auth/register", function () {
      describe("Happy flows", function () {
        const requestBody = registerValidRequestBody();

        it("Should register am user successfully", function () {
          authApi.register(requestBody).as("register");
          cy.get("@register").should(
            spok({
              status: 201,
              body: {
                access_token: spok.string,
                expires_in: 3600,
                token_type: "bearer",
                user_id: spok.number,
              },
            })
          );
        });

        it("Recently registered user should be able to login", function () {
          authApi
            .getToken({
              email: requestBody.email,
              password: requestBody.password,
            })
            .as("login");
          cy.get("@login").should(
            spok({
              status: 201,
              body: {
                access_token: spok.string,
                expires_in: 3600,
                token_type: "bearer",
                user_id: spok.number,
              },
            })
          );
        });
      });

      describe("Unhappy flows", function () {
        const registerFixture = require("../../fixtures/auth/register-invalid-requests");

        registerFixture.invalidRequests.forEach((req) => {
          it(`Should fail when ${req.scenario}`, function () {
            authApi.register(req.body, false).as("register");
            cy.get("@register").should((res) => {
              expect(res.body.errors).to.be.deep.eq(req.errors);
              expect(res.status).to.be.eq(422);
            });
          });
        });
      });
    });
  });
});
