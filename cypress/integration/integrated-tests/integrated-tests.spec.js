const {
  registerValidRequestBody,
} = require("../../factories/register.factory");

const spok = require("cy-spok");
const { AuthApi } = require("../../http/auth.requests");

describe("Test", function () {
  const authApi = new AuthApi();

  before(function () {
    cy.fixture("auth").as("auth");
  });

  it("Test", function () {
    const requestBody = registerValidRequestBody();

    authApi.register(requestBody).as("register");

    cy.get("@register")
      .should(
        spok({
          status: 201,
        })
      )
      .then((res) => {
        const newRequestBody = {
          name: requestBody.name,
          email: requestBody.email,
          password: "newPassword",
          password_confirmation: "newPassword",
        };

        authApi.register(requestBody).as("secondRegister");

        cy.get("@secondRegister")
          .should(spok({ status: 201 }))
          .then((res2) => {
            expect(res.body.user_id).to.be.not.eq(res2.body.user_id);

            authApi
              .getToken({
                email: newRequestBody.email,
                password: newRequestBody.password,
              })
              .as("login");

            cy.get("@login").should(
              spok({
                status: 201,
              })
            );
          });
      });
  });
});
