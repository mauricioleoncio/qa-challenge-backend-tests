# just a draft

- Status code must be 401 when user cannot log in
- Client still creating tasks after /logout
- Password with more than 255 chars
- Registering with the same email is allowed
    1. 
        - After registering the user, try to log in with its password
        - An errror message is displayed "These credentials do not match our records."
    2.
        - Aftter registering the user, use its given bearer token to create a task
        - GET the tasks with the "real" email 
        - The tasks lists contains different tasks from different users
- Client still creating tasks even if the bearer token is expired
- Client still creating tasks even if the bearer token is available only in the future


SQL: select * from `tasks` where `id` = 3054 limit 1)