## Tasks tests

# POST /api/v1/tasks

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


