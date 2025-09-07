Create a student CRUD REST API  Federal University of Technology Akure Computer Science students using nodejs and a simple frontend to access the api. 
Using the API we should be able to perform the following operations.

Add a new student.

Get all students.

Get a student with an ID.

Update existing student information.

Delete a student record.

The repository should contain the following:

README.md file explaining the purpose of the repo, along with local setup instructions.

Explicitly maintaining dependencies in a file.

Makefile to build and run the REST API locally.

Ability to run DB schema migrations to create the student table.

Config (such as database URL) should not be hard-coded in the code and should be passed through environment variables.

Postman collection for the APIs.

API expectations:

Support API versioning using semver (e.g., api/v1/<resource>).

Using proper HTTP verbs for different operations.

API should emit meaningful logs with appropriate log levels.

API should have a /healthcheck endpoint.

Unit tests for different endpoints.