# Just Eat QA Coding Challenge

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install the dependencies.

```bash
npm install
```

**Note:** cypress@6.3.0 Requires Node version >= 10.0.0

---

# Usage

- Here you can find the tests scenarios artifact for [tasks](test-scenarios/tasks-test-scenarios.md) and [auth](test-scenarios/auth-test-scenarios.md) endpoints.
- To run the scenarios manually, I used the Postman app. Here you can find my [collection](postman-collection/justeat-challenge.postman_collection.json) and my [environment variables](postman-collection/justeat-challenge-local-envVars.postman_environment.json). Import both files to run manual tests.
- The bugs that I encountered can be found in the [bug report](bug-report.md)
- There's a logic to expire the token in `cypress/support/jwt.js`
- Time statistics regarding to test steps can be found on the generated report file

---

## Running the Automated Tests

First, make sure that you have an instance of `qa-challenge` running in your machine on port 8000.

To run the backend tests use the command below:

```bash
npm run test:backend
```

The command above will trigger all the tests implemented for this challenge. Once it's done, another command will be triggered to generate and merge the reports, which will be found in `cypress/results/qa-challenge-report.html`. I'm using [mochawesome](https://www.npmjs.com/package/mochawesome) reporter.

Mochawesome Report Sample:

![mochawesome-report-sample](mochawesome-report-sample.png)

---

## API Tests: Repo Structure and Approach

The API tests are under `cypress/integration/backend/`.

They are using [cy-spok](https://github.com/bahmutov/cy-spok) to validate the responses received by the endpoints maped in `cypress/http` based on requests created using the bodies factories `cypress/factories` and the fixtures `cypress/fixtures`. Also, I'm using the [Chai](https://github.com/chaijs/chai) assertion library which is bundled by cypress.io.
Instead of using Cypress fixtures for all requests, I prefered to create those factories to use [faker](https://www.npmjs.com/package/faker) for dynamic values (there is a bug opened in Cypress fixtures when using .js files for fixtures [issues/1271](https://github.com/cypress-io/cypress/issues/1271))

Below we have an example of how it's implemented using cy-spok:

```javascript

const spok = require("cy-spok");
const { AuthApi } = require("../../http/auth.requests");

describe("Auth API tests", function () {
  const authApi = new AuthApi();

  before(function () {
    cy.fixture("auth").as("auth");
  });

  describe("Tests for /auth/login", function () {
    describe("Happy flows", function () {
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
  }
}
```

In the example above I'm creating an instance of `AuthApi` class to use it's `getToken()` method passing as parameter the requestBody from `fixture/auth.json`. Give it an alias to work with the response and make the assertions using `cy-spok`.

Another approach that I mentioned, using the Chai assertion:

```javascript
describe("Unhappy flows", function () {
  const loginFixture = require("../../fixtures/auth/login-invalid-requests");

  loginFixture.invalidRequests.forEach((req) => {
    it(`Should fail when ${req.scenario}`, function () {
      authApi.getToken(req.body, false).as("login");
      cy.get("@login").should((res) => {
        expect(res.body.errors).to.be.deep.eq(req.errors);
      });
    });
  });
});
```

In the example above I'm reading the fixtures and using all the invalid payloads that it contains, using chai to check if the endpoint response is deepEqual to the expected by the fixture.

---