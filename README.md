# HR Management Portal

A full-stack role-based Human Resource Management System built with **React (frontend)**, **Node.js + Express (backend)**, and **MongoDB (database)**. This system allows an organization to manage employees, departments, attendance, leave requests, and internal announcements with secure access control for admins and employees.

---

## Project Overview

This portal provides a centralized HR interface for managing employees and departments, monitoring attendance, handling leave requests, and sharing company-wide announcements. The system is accessible through two types of users: **Admins** (full control) and **Employees** (restricted self-service access).

---

## Features

### Authentication & Authorization
- JWT-based login system
- Role-based access control (Admin and Employee)

### Admin Capabilities
- Manage employees and departments
- Approve/reject leave requests
- View attendance
- Post internal announcements

### Employee Capabilities
- Request leave
- Mark attendance (check-in/check-out)
- View announcements
- View personal profile and records

---

## Technology Stack

| Layer        | Tech Stack                      |
|--------------|----------------------------------|
| Frontend     | React, Axios, React Router, Tailwind CSS (or Bootstrap) |
| Backend      | Node.js, Express.js             |
| Database     | MongoDB, Mongoose               |
| Auth         | JWT, bcrypt                     |
| Dev Tools    | nodemon, morgan, dotenv         |
| Security     | Helmet, CORS                    |

---

## 🛠️ Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/CoderRedwing/hr-management-system.git
cd hrms-portal

cd Backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and JWT secret
npm run dev


## System Architecture

```

Client (React)
|
\| HTTP (Axios)
v
Backend API (Express + Node.js)
|
v
Database (MongoDB)

```

- Role-based routing on frontend
- JWT stored securely on client (preferably HttpOnly cookie or localStorage)
- Token verification on every request to backend
- Admin and employee dashboards served based on role

---


## Installation

### Backend Setup

```bash
cd server
npm install
cp .env.example .env
npm start
````

### Frontend Setup

```bash
cd client
npm install
npm start
```

---

## Environment Variables

### `.env` (Backend)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hr_portal
JWT_SECRET=your_jwt_secret
```

---

## API Endpoints

### Authentication

| Method | Route  | Access | Description                |
| ------ | ------ | ------ | -------------------------- |
| POST   | /login | Public | Login as admin or employee |

---

### Admin Routes

| Method | Route                     | Description                     |
| ------ | ------------------------- | ------------------------------- |
| POST   | /admin/create-user        | Create new employee             |
| GET    | /admin/employees          | View all employees              |
| PUT    | /admin/employees/\:id     | Edit employee details           |
| DELETE | /admin/employees/\:id     | Delete employee                 |
| POST   | /admin/departments        | Add a new department            |
| GET    | /admin/departments        | View all departments            |
| PUT    | /admin/departments/\:id   | Edit a department               |
| DELETE | /admin/departments/\:id   | Delete a department             |
| GET    | /admin/leaves             | View all leave requests         |
| PATCH  | /admin/leaves/\:id/status | Approve or reject leave request |
| GET    | /admin/attendance         | View all attendance records     |
| POST   | /admin/announcements      | Post a new announcement         |

---

### Employee Routes

| Method | Route                | Description              |
| ------ | -------------------- | ------------------------ |
| GET    | /employee/me         | View own profile         |
| POST   | /attendance/checkin  | Check-in for today       |
| POST   | /attendance/checkout | Check-out for today      |
| GET    | /attendance/my       | View personal attendance |
| POST   | /leave/request       | Request a new leave      |
| GET    | /leave/my            | View own leave history   |
| GET    | /announcements       | View all announcements   |

---

## Security Measures

* Secure password hashing using bcrypt
* JWT-based authentication and role authorization
* Route protection using middleware on both frontend and backend
* Server-side validation of attendance (prevent duplicate check-ins, spoofing)
* Role-specific dashboards and restricted routing
* Helmet, CORS, and environment separation for safe deployment

---

## Future Improvements

* Employee password reset/change flow
* Email notification for leave approvals
* Attendance analytics and reports
* CSV/PDF export of reports
* Admin dashboard with graphical insights
* React admin panel enhancements (filters, pagination, etc.)

---

## License

This project is open-sourced under the MIT License.

