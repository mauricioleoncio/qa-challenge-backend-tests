const faker = require("faker");

export function taskValidRequestBody() {
  return {
    title: `${faker.name.firstName()} must buy a ${faker.vehicle.vehicle()}`,
  };
}
