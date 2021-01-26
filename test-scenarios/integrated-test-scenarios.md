delete a task and try to get it byId
delete a task and check that it isn't on getAll response
try to delete with invalidToken

integratated scenario: 
    - - Registering with the same email is allowed
    1. 
        - After registering the user, try to log in with its password
        - An errror message is displayed "These credentials do not match our records."
    2.
        - Aftter registering the user, use its given bearer token to create a task
        - GET the tasks with the "real" email 
        - The tasks lists contains different tasks from different users