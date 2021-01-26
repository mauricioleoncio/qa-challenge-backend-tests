# Bug & Improvements Report - Just Eat QA Coding Challenge

🚩 **#BUG-001**: in `/auth/register` - It's possible to register an user with the same e-mail.

**Steps to Reproduce:**

1. Use the `/auth/register` to registrate a new user. E.g.:

   ```
   name: Mauricio
   email: mauricio@just.eat
   password: password
   password_confirmation: password
   ```

2. Notice in the response the `user_id`

3. Use the `/auth/register` to registrate another user with same e-mail, but different password. E.g.:

   ```
   name: Mauricio
   email: mauricio@just.eat
   password: newPassword
   password_confirmation: newPassword
   ```

4. Notice that the response returned another `user_id`

5. Try to log in using the `/auth/login` endpoint with the first user created. E.g.:

   ```
   email: mauricio@just.eat
   password: password
   ```

6. The user is successfully logged in and the `access_token` is returned on the response

7. Now, try to log in using the `/auth/login` endpoint with the last user created. E.g.:

   ```
   email: mauricio@just.eat
   password: newPassword
   ```

8. An error occurs and shows the error message: `These credentials do not match our records.`

**Expected Result:**

The endpoint `/auth/register` should not allow duplicated e-mails to avoid this problem.

---

🚩 **#BUG-002**: in `/tasks` - It's possible to see tasks using an user which has it's e-mail duplicated.

**Steps to reproduce:**

1. Follow the **#BUG-001** steps until the 4th

2. With the response from `/auth/register` in hands, save the `access_token` returned by it to use in the next steps

3. Request the `POST /tasks` endpoint, filling the Bearer Token with the token from the `step 2`

4. Notice that the task was created with the `user_id` of the duplicated user.

5. Request the `GET /tasks` endpoint, filling the Bearer Token with the token from the `step 2`

6. Notice that the task list contains the `user_id` of the duplicated user.

7. Now reques an `access_token` using the original user and check it's `user_id`

8. Request the `POST /tasks` endpoint, filling the Bearer Token with the token from the `step 7`

9. Notice that the task was created with the `user_id` of the original user.

10. Request the `GET /tasks` endpoint, filling the Bearer Token with the token from the `step 7`

11. Notice that in the tasks list there will be 2 tasks:

- 1 related to the duplicated user, containing it's `user_id`
- 1 related to the original user, containing it's `user_id`

**Expected Result:**

Should not be possible to see another user task. This will be fixed when the **#BUG-001** is fixed.

---

🚩 **#BUG-003**: in `/tasks` - It's possible to delete tasks using an user which has it's e-mail duplicated.

**Steps to reproduce:**

1. Follow the **#BUG-001** steps until the 4th

2. Follow the **#BUG-002** steps until the 11th

3. Request the `POST /tasks` endpoint, filling the Bearer Token with the token from the `step 2`

4. With the bearer token of the duplicated user, try to `DELETE /tasks/{{taskId}}` passing the taskId created by the original user

5. Request the `GET /tasks` endpoint, filling the Bearer Token with the token of the original user

6. Notice that the duplicated user has deleted the task of the original user

**Expected Result:**

Should not be possible to delete another user task. This will be fixed when the **#BUG-001** is fixed.

**Notes**

The same error occurs when trying to delete the task using a valid Bearer from an existing user

---

🚩 **#BUG-004**: in `/tasks` - It's possible to manage tasks even after user has logged out

**Steps to reproduce:**

1. Use the `POST /auth/login` using valid credentials. E.g.:

   ```
   email: test@test.com
   password: 4nak1n
   ```

2. Use the `DELETE /auth/logout` using the step 1 Bearer Token

3. Notice that the message `Successfully logged out` is displayed on the response

4. Use the `POST /tasks` to create a new task using the step 1 Bearer Token

5. Use the `GET /tasks/{{taskId}}` using the task id generated in step 4

6. Use the `GET /tasks` and check the list of tasks

7. Use the `DELETE /tasks/{{taskId}}` using the task id generated in step 4 and validate tha it's deleted using the `GET /tasks/{{taskId}}`

**Expected Result:**

Should not be possible to manage tasks after user has logged out

---

🚩 **#BUG-005**: in `/tasks/{{taskId}}` - The response body is not handled when user pass an invalid or deleted task id as parameter

**Steps to reproduce:**

1. With a valid Bearer Token use the `POST /tasks` to create a new task

2. Use the `DELETE /tasks/{{taskId}}` passing the task id generate in step 1

3. Use the `GET /tasks/{{taskId}}` to check it's deleted

4. Check that the message returned by the server is not handled

5. Use the `GET /tasks/{{taskId}}` passing an invalid task id (e.g. invalid characteres, string, etc)

**Expected Result:**

A friendly message should be displayed when a task is not found in database

---

🚩 **#BUG-006**: in `/tasks/{{taskId}}` - Unhandled error message and wrong status code when requesting to get a task by id with different user

**Steps to reproduce:**

1. With a valid Bearer Token use the `POST /tasks` to create a new task

2. Generate another Bearer Token with another user

3. Try to `GET /tasks/{{taskId}}`

**Expected Result:**
A friendly message should be displayed and the error must be handled
The response status code is 403 and the expected is 401

---

🚩 **#BUG-007**: in `DELETE /tasks/{{taskId}}` - It's possible to delete another user task

**Steps to reproduce:**

1. With a valid Bearer Token use the `POST /tasks` to create a new task

2. Generate another Bearer Token with another user

3. Try to `DETLETE /tasks/{{taskId}}` with the last generated token

**Expected Result:**
An unauthorized message should be displayed

---

💡 **#IMPROVEMENT-001**: in `/auth/register` - There's no characteres limit for the password & password_confirmation.

Suggestion: Follow the [OWASP Proper Password Strength Controls](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) recommendations and set a maximum password lenght.

> It is important to set a maximum password length [to prevent long password Denial of Service attacks.](https://www.acunetix.com/vulnerabilities/web/long-password-denial-of-service/)

---

💡 **#IMPROVEMENT-002**: in `/auth/login` - the response status code should be 401 when user tries to log in with an invalid password and valid e-mail

Suggestions:

- Change the response status code when user tries to login with invalid credentials. Actual: 412 / Expected: 401

---

💡 **#IMPROVEMENT-003**: in `/auth/login` - the response status code should be 401 when user tries to log in with an e-mail not registered

Suggestions:

- Change the response status code when user tries to login with not registered e-mail. Actual: 418 / Expected: 401
