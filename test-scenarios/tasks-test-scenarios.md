# Tasks tests - /api/v1/tasks

## Happy flow

> - Given the client has a valid bearer token
> - And the client sends a valid title for tasks
> - Then a task should be successfully created

> - Given the client had a valid bearer token
> - When the client tries to GET the task list
> - Then the response should list all the tasks related to that token/user

> - Given the client has a valid bearer token
> - And the client sends a valid title for tasks
> - Then a task should be successfully created
> - When the client tries to GET the task list
> - And the client has the same bearer token
> - Then the response should list all the tasks related to that token/user

> - Given the client has a valid bearer token
> - And the client sends a valid title for tasks
> - Then a task should be successfully created
> - When the client sends a DELETE request passing the taskId
> - Then the task should not be listed anymore

---

## Unhappy flows

> - Given the client sends a valid title for the task
> - But the client does not send the bearer token
> - Then an error message "Unauthenticated." should be displayed
> - And the status code must be 401

> - Given the client sends a valid title for the task
> - But the client sends an invalid bearer token
> - Then an error message "Unauthenticated." should be displayed
> - And the status code must be 401

> - Given the client sends a valid title for the task
> - But the client sends an expired bearer token
> - Then an error message "Unauthenticated." should be displayed
> - And the status code must be 401

> - Given the client send a GET request to /tasks
> - But the client sends the request without authorization
> - Then an error message "Unauthenticated." should be displayed
> - And the status code must be 401


> - Given the client send a GET request to /tasks
> - But the client sends an invalid bearer token
> - Then an error message "Unauthenticated." should be displayed
> - And the status code must be 401


> - Given the client send a GET request to /tasks
> - But the client sends an expired bearer token
> - Then an error message "Unauthenticated." should be displayed
> - And the status code must be 401

> - Given the client sends a valid title for the task
> - But the client sends an token which will only be available in the future
> - Then an error message "Unauthenticated." should be displayed
> - And the status code must be 401

> - Given the client send a request with a valid bearer token
> - But client sends a blank title for the task
> - Then an error message "The title field is required." should be displayed
> - And the status code must be 422

> - Given the client send a request with a valid bearer token
> - But client does not send the title field
> - Then an error message "The title field is required." should be displayed
> - And the status code must be 422

> - Given the client send a request with a valid bearer token
> - But client sends a title with more than 255 characteres
> - Then an error message "The title may not be greater than 255 characters." > - should be displayed
> - And the status code must be 422

> - Given the client sends a valid title for tasks
> - But client sends an invalid token
> - Then an error message "Unauthorized" should be displayed

> - Given the client sends a valid title for tasks
> - But client sends an expired token
> - Then an error message "Unauthorized" should be displayed

> - Given the client sends a valid title for tasks
> - But client does note send the token
> - Then an error message "Unauthorized" should be displayed

> - Given an user with valid credentials
> - And this user creates a task
> - When another user tries to delete the first one task
> - Then an error message "Unauthorized" should be displayed