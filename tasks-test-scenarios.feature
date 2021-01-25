## Tasks tests

# POST /api/v1/tasks

# Happy flow
Given the client has a valid bearer token
And the client sends a valid title for tasks
Then a task should be successfully created
OK

Given the client had a valid bearer token
When the client tries to GET the task list
Then the response should list all the tasks related to that token/user
OK


Given the client has a valid bearer token
And the client sends a valid title for tasks
Then a task should be successfully created
When the client tries to GET the task list
And the client has the same bearer token
Then the response should list all the tasks related to that token/user


## delete a task and try to get it byId
## delete a task and check that it isn't on getAll response
## try to delete with invalidToken
## integratated scenario: 
    - - Registering with the same email is allowed
    1. 
        - After registering the user, try to log in with its password
        - An errror message is displayed "These credentials do not match our records."
    2.
        - Aftter registering the user, use its given bearer token to create a task
        - GET the tasks with the "real" email 
        - The tasks lists contains different tasks from different users

#Unhappy flows

Given the client sends a valid title for the task
But the client sends the request without authorization
Then an error message "Unauthenticated." should be displayed
And the status code must be 401
OK

Given the client sends a valid title for the task
But the client sends an invalid bearer token
Then an error message "Unauthenticated." should be displayed
And the status code must be 401
OK

Given the client sends a valid title for the task
But the client sends an expired bearer token
Then an error message "Unauthenticated." should be displayed
And the status code must be 401
OK


Given the client send a GET request to /tasks
But the client sends the request without authorization
Then an error message "Unauthenticated." should be displayed
And the status code must be 401
OK

Given the client send a GET request to /tasks
But the client sends an invalid bearer token
Then an error message "Unauthenticated." should be displayed
And the status code must be 401
OK

Given the client send a GET request to /tasks
But the client sends an expired bearer token
Then an error message "Unauthenticated." should be displayed
And the status code must be 401
OK


Given the client sends a valid title for the task
But the client sends an token which will only be available in the future
Then an error message "Unauthenticated." should be displayed
And the status code must be 401
OK

Given the client send a request with a valid bearer token
But client sends a blank title for the task
Then an error message "The title field is required." should be displayed
And the status code must be 422
OK

Given the client send a request with a valid bearer token
But client does not send the title field
Then an error message "The title field is required." should be displayed
And the status code must be 422
OK

Given the client send a request with a valid bearer token
But client sends a title with more than 255 characteres
Then an error message "The title may not be greater than 255 characters." should be displayed
And the status code must be 422
OK

SQL: select * from `tasks` where `id` = 3054 limit 1)


