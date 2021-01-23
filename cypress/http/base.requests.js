const TASKS_ENV = Cypress.env("tasks-api");

export class BaseHttpRequest {
  post(url, requestBody, failOnStatusCode, token) {
    const options = {
      method: "POST",
      url: TASKS_ENV.baseUrl + url,
      body: requestBody,
      failOnStatusCode: failOnStatusCode === true,
    };

    if (token) options.auth = { bearer: token };

    return cy.request(options);
  }
}
