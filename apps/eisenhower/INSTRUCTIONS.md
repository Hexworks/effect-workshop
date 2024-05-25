# Eisenhower Matrix App

An Eisenhower Matrix holds todos in four quadrants: Urgent and Important, Not Urgent and Important, Urgent and Not Important, and Not Urgent and Not Important.

The goal is to create a simple app that allows users to use the features listed below. No authentication is necessary. The app should be accessible through a HTTP API. No UI is necessary, simple CLI access (via `curl` for example) is sufficient.

## Features

### Create New Matrix

As a user I want to be able to create a new Eisenhower Matrix.

Parameters:
- name

No tasks should be present initially.


### Create New Task

As a user I want to be able to create a new Task in a quadrant (combination of urgency and importance).

Parameters:
- title
- description
- due date
- urgency
- importance


### Complete Task

As a user I want to be able to mark a Task as completed.

Parameters:
- id of the Task


### Delete Task

As a user I want to be able to delete a Task.

Parameters:
- id of the Task


### List Tasks in Matrix

As a user I want to be able to list all my tasks in a matrix.

Parameters:
- id of the matrix


### Get Task Notifications

As a user I want to get task notifications whenever there is a task that's past its due date. This notification should arrive via email.

> Note: This feature can be stubbed, i.e. it doesn't have to actually send an email. It's enough to print a message to the console.


### Create Excel Export

As a user I want to be able to create an Excel export of the matrices in the app.
Each matrix should have its own tab in the excel file, and tasks should be represented as rows.


## Other Tasks

- Apart from the features above, the app should also be observable, and traces should be sent to Prometheus.
- The services should be unit tested
- Data should be persisted to an external database (e.g. PostgreSQL, SQLite, etc.)