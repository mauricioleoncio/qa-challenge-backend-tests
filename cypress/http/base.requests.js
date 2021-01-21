const TASKS_ENV = Cypress.env("tasks-api");

export class BaseHttpRequest {
  post(url, requestBody, token, failOnStatusCode) {
    const shouldFail =
      typeof failOnStatusCode !== "undefined" ? failOnStatusCode : true;

    return cy.request({
      method: "POST",
      url: TASKS_ENV.baseUrl + url,
      body: requestBody,
      auth: {
        bearer: token,
      },
      failOnStatusCode: shouldFail,
    });
  }

  post(url, requestBody, failOnStatusCode) {
    const shouldFail =
      typeof failOnStatusCode !== "undefined" ? failOnStatusCode : true;

    return cy.request({
      method: "POST",
      url: TASKS_ENV.baseUrl + url,
      body: requestBody,
      failOnStatusCode: shouldFail,
    });
  }
}
