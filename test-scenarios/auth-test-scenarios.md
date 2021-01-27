# Auth tests - /api/v1/auth

## Happy Flow /auth/login

> - Given the client sends valid credentials to /auth/login
> - Then a valid token should be on the response
> - And the status code should be 201

## Unhappy Flow /auth/login

> - Given the client sends a valid e-mail with wrong password
> - Then an error message "These credentials do not match our records.." should be displayed

> - Given the client sends an invalid e-mail with valid password
> - Then an error message "Not In our system" should be displayed

> - Given the client sends an empty e-mail with valid password
> - Then an error message "The email field is required" should be displayed

> - Given the client sends an empty password with valid password
> - Then an error message "The password field is required." should be displayed

> - Given the client does not send the email field
> - Then an error message "The email field is required." should be displayed

> - Given the client does not send the password field
> - Then an error message "The email password is required." should be displayed

> - Given the client sends all fields in blank
> - Then an error message "The email field is required." should be displayed
> - Abd the error message "The password field is required." should be displayed


## Happy flow - /auth/register
> - Given the client sends a valid request body to /auth/register
> - Then a valid access_token should be displayed
> - And the status should be 201 

> - Given the client sends a valid request body to /auth/register
> - And the name in the request had <= 255 chars
> - Then a valid access_token should be displayed
> - And the status should be 201 

> - Given the client sends a valid request body to /auth/register
> - And the name in the request had <= 255 chars
> - Then a valid access_token should be displayed
> - And the status should be 201 
> - When client sends a request to /auth/login using the registered user
> - Then a valid access_token should be displayed
> - And the status should be 201 

## Unhappy flow - /auth/register

### NAME FIELD 
> - Given the client sends a request with a blank name
> - Then an error message "The name field is required." should be displayed
> - And the status code must be 422

> - Given the client does not send the name field
> - Then an error message "The name field is required." should be displayed
> - And the status code must be 422

> - Given the client sends a request with name with more than 255 chars
> - Then an error message "The name may not be greater than 255 characters." should be displayed
> - And the status code must be 422

> - Given the client sends a request with name with characters != 'letters, numbers, dashes and underscores'
> - Then an error message "The name may only contain letters, numbers, dashes and underscores." should be displayed
> - And the status code must be 422

### EMAIL FIELD 

> - Given the client sends a request with an existing e-mail
> - Then an error message informing that this e-mail is already in use should be displayed
> - And the status code must be 422

> - Given the client sends a request with a blank email
> - Then an error message "The email field is required." should be displayed
> - And the status code must be 422

> - Given the client does not send the email field
> - Then an error message "The email field is required." should be displayed
> - And the status code must be 422

> - Given the client sends a request with email with more than 255 chars
> - Then an error message "The email may not be greater than 255 characters." should be displayed
> - And the status code must be 422

> - Given the client sends a request with an email containing invalid chars ([check allowed chars here](https://stackoverflow.com/questions/2049502/what-characters-are-allowed-in-an-email-address))
> - Then an error message "The email must be a valid email address." should be displayed
> - And the status code must be 422

### PASSWORD FIELD 

> - Given the client sends a request with a blank password
> - Then an error message "The password field is required." should be displayed
> - And the status code must be 422

> - Given the client does not send the password field
> - Then an error message "The password field is required." should be displayed
> - And the status code must be 422

> - Given the client sends the password field with less than 8 chars
> - Then an error message "The password must be at least 8 characters." should be displayed
> - And the status code must be 422

> - Given the client sends a valid password 
> - But sends a different password_confirmation
> - Then an error message "The password confirmation does not match." should be displayed
> - And the status code must be 422

> - Given the client sends a valid password 
> - But sends a empty password_confirmation
> - Then an error message "The password confirmation does not match." should be displayed
> - And the status code must be 422

> - Given the client sends a valid password 
> - But does not send a password_confirmation
> - Then an error message "The password confirmation does not match." should be displayed
> - And the status code must be 422

> - Given the client sends a password/password_confirmation with more than 255 chars 
> - Then an error message "The email may not be greater than  64 characters." should be displayed ([check OWASP recommendations here](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html))
> - And the status code must be 422

## ALL FIELDS 
> - Given the client sends a request with name with characters != 'letters, numbers, dashes and underscores'
> - And sends an invalid e-mail
> - And sends a password with less than 8 chars
> - And sends a password_confirmation != from the password
> - Then a list of errors should be displayed
> - And the list should contains the error message "The name may only contain letters, numbers, dashes and underscores."
> - And the error message "The email must be a valid email address."
> - And the error message "The password must be at least 8 characters."
> - And the error message "The password confirmation does not match."