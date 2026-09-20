# TaskFlow - Task Management Web Application

## Project Information

**Project Title:** Design and Development of a Full Stack Task Management Web Application

**Domain:** Full Stack Development

**Project Type:** Individual Minor Project

**Duration:** 7 Days

**Organization:** Quillance Infotech Pvt. Ltd.

---

## About the Project

TaskFlow is a full stack task management web application designed to help users create, organize, update, complete, and track their daily tasks.

The application provides a simple and user-friendly interface for managing tasks and also includes features such as task priority, due dates, subtasks, task health, task recovery, search, filtering, sorting, and dashboard summaries.

---

## Main Features

### User Management

- User Registration
- User Login
- User Profile
- Profile Update
- Logout

### Task Management

- Create Task
- View Tasks
- Edit Task
- Delete Task
- Complete/Reopen Task
- Task Description
- Due Date
- Priority
- Status

### Task Organization

- Search Tasks
- Filter Tasks
- Sort Tasks
- Status Tabs
- Priority Filter
- Task Health Filter

### Additional Features

- Subtasks
- Task Health
- Task Recovery
- Task Rescheduling
- Waiting Status
- Blocked Status
- Dashboard Summary
- Start Here Task
- Needs Attention Tasks

---

## Task Status

The application supports the following task statuses:

- Not Started
- In Progress
- Waiting
- Blocked
- Completed

---

## Task Health

Task Health is calculated dynamically based on the current condition of a task.

The application displays:

- On Track
- Needs Attention
- At Risk

Task Health is different from the task status.

---

## Task Recovery

When a task becomes difficult, delayed, or blocked, the user can record the reason.

Available recovery reasons include:

- Too difficult
- Too much work
- Don't know where to start
- Waiting for someone
- Blocked
- No longer needed
- Other

Recovery actions can include:

- Breaking down a task
- Adding a first step
- Rescheduling
- Changing task status
- Waiting for someone
- Continuing the task

---

## Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Other Tools

- Git
- GitHub
- Thunder Client
- bcrypt

---

## Project Architecture

```text
User
 ↓
Frontend
 ↓
REST API
 ↓
Node.js + Express.js
 ↓
Controllers
 ↓
Mongoose
 ↓
MongoDB
 ↓
Response
 ↓
Frontend