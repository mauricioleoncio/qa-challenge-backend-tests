const faker = require("faker");

export function registerValidRequestBody() {
  const pwd = faker.random.uuid();
  return {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: pwd,
    password_confirmation: pwd,
  };
}
