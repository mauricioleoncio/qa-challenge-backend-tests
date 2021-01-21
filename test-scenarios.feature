# TODO: Translate it to english and use gherkin | Se tiver tempo, criar regex para validar e-mail
#### Auth API scenarios ####

### Happy Flow

Dado um usuário com credenciais válidas
E usuário enviar requisição para o endpoint /auth/login
Então um token válido deve ser retornado no corpo da resposta

Dado que um usuário com dados validos
Quando o usuário tenta se registrar
E usuário enviar a requisição para o endpoint /auth/register
Então ele deve ser registrado
E um token válido deve ser retornado no corpo da resposta

Dado que um usuário quer se registrar
Quando ele informa um 'name' com <= 255 chars
Então ele deve ser registrado
E um token válido deve ser retornado no corpo da resposta

Dado que um usuário quer se registrar
Quando ele informa o 'email' com valor 'n@n'
E informa o 'password' com o valor '!#$%&'*+-/=?^_`{|}~' 
E usuário tenta efetuar login
Então ele deve ser registrado
E um token válido deve ser retornado no corpo da resposta
Quando usuário tenta efetuar login com as credentiais cadastradas
Então um token válido deve ser retornado no corpo da resposta
# not in our system VS These credentials do not match our records.


### Unhappy flow - /auth/register

### name field ###
Dado que um usuário quer se registrar
Quando ele informa um 'name' em branco
Então a aplicação deve retornar mensagem de erro 'The given data was invalid'
E o erro 'The name field is required.'

Dado que um usuário quer se registrar
Quando não informa o campo 'name'
Então a aplicação deve retornar mensagem de erro 'The given data was invalid'
E o erro 'The name field is required.'

Dado que um usuário quer se registrar
Quando ele informa um 'name' com > 255 chars
Então a aplicação deve retornar mensagem de erro 'The name may not be greater than 255 characters.'

Dado que um usuário quer se registrar
Quando ele informa um 'name' contendo characters != 'letters, numbers, dashes and underscores'
Então a aplicação deve retornar mensagem de erro 'The name may only contain letters, numbers, dashes and underscores.' 



## EMAIL FIELD ###
Dado que um usuário quer se registrar
Quando ele informa um 'email' já registrado
Então a aplicação deve retornar uma mensagem de erro informando que usuário já está registrado

Dado que um usuário quer se registrar
Quando ele informa um 'email' em branco
Então a aplicação deve retornar mensagem de erro 'The given data was invalid.'
E o erro 'The email field is required.'

Dado que um usuário quer se registrar
Quando não informa o campo 'email'
Então a aplicação deve retornar mensagem de erro 'The given data was invalid'
E o erro 'The email field is required.'

Dado que um usuário quer se registrar
Quando ele informa um 'email' com > 255 chars
Então a aplicação deve retornar mensagem de erro 'The email may not be greater than 255 characters.'

Dado que um usuário quer se registrar
Quando ele informar um 'email' com characters inválido (https://stackoverflow.com/questions/2049502/what-characters-are-allowed-in-an-email-address) #criar regex
Então a aplicação deve retornar mensagem de erro 'The email must be a valid email address.'


## PASSWORD FIELD ###
Dado que um usuário quer se registrar
Quando ele informa um 'password' em branco
Então a aplicação deve retornar mensagem de erro 'The given data was invalid.'
E o erro 'The password field is required.'

Dado que um usuário quer se registrar
Quando não informa o campo 'password'
Então a aplicação deve retornar mensagem de erro 'The given data was invalid'
E o erro 'The password field is required.'

Dado que um usuário quer se registrar
Quando ele informa um 'password' com < 8 chars
Então a aplicação deve retornar mensagem de erro 'The password must be at least 8 characters.'

Dado que um usuário quer se registrar
Quando ele informa um 'password'
E informa um 'password_confirmation' diferente do 'password'
Então a aplicação deve retornar mensagem de erro 'The password confirmation does not match.'

Dado que um usuário quer se registrar
Quando ele informa um 'password'
E informa um 'password_confirmation' em branco
Então a aplicação deve retornar mensagem de erro 'The password confirmation does not match.'

Dado que um usuário quer se registrar
Quando ele informa um 'password'
E não informa um 'password_confirmation' 
Então a aplicação deve retornar mensagem de erro 'The password confirmation does not match.'

Dado que um usuário quer se registrar
Quando ele informa um 'password' com > 255 chars
Então a aplicação deve retornar mensagem de erro 'The password may not be greater than 255 characters.'
## Aplicação está aceitando infinitos valores (https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)


### ALL FIELDS ###
Dado que um usuário quer se registrar
Quando ele informar um 'name' contendo characters != 'letters, numbers, dashes and underscores'
E ele informar um 'email' inválido
E ele informar um 'password' com < 8 chars
E ele informar um 'password_confirmation' != do 'password'
Então ele deve ver uma lista de erros
E a lista de erro deve conter a mensagem 'The name may only contain letters, numbers, dashes and underscores.'
E a mensagem de erro 'The email must be a valid email address.'
E a mensagem de erro 'The password must be at least 8 characters.'
E a mensagem de erro 'The password confirmation does not match.'

