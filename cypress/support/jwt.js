const SECRET = Cypress.env("jwt-auth-secret");
var jwt = require("jsonwebtoken");

export function expiresJWT(payload) {
  const decoded = jwt.decode(payload);
  var body = JSON.parse(JSON.stringify(decoded));
  body.exp = 1611603065;

  return jwt.sign(JSON.stringify(body), SECRET);
}

export function tokenInTheFuture(payload) {
  const decoded = jwt.decode(payload);
  var body = JSON.parse(JSON.stringify(decoded));
  body.exp = 4102444800;
  body.nbf = 4102444800;

  return jwt.sign(JSON.stringify(body), SECRET);
}
