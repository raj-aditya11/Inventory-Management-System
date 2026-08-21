# Inventory Management System

A full-stack web-based Inventory Management System developed during my summer internship. The system digitizes inventory operations, asset assignment, transfers, disposal requests, and user management through a role-based workflow.

## 📌 Overview

The Inventory Management System is designed to provide a centralized platform for managing organizational assets and their movement between users and groups.

The system supports three primary roles:

* **Admin**
* **Inventory Holder**
* **User**

Each role has a dedicated dashboard and access to functionality based on its responsibilities.

## ✨ Key Features

### 🔐 Authentication & Authorization

* Secure user login
* Role-based access control
* Separate workflows for Admin, Inventory Holder, and User
* Protected routes and API endpoints

### 👨‍💼 Admin Module

* Dashboard
* User management
* Create and manage users
* Group management
* Create, update, and delete groups

### 📦 Inventory Holder Module

* Inventory dashboard
* View inventory
* Receive new stock
* Assign assets to users
* View personally assigned assets
* Manage asset transfer requests
* Approve/reject transfer requests
* Handle disposal requests
* Manage group-level disposals

### 👤 User Module

* User dashboard
* View assigned assets
* Submit asset transfer requests
* Submit disposal requests
* View request status
* Manage profile

### 🔄 Asset Management

* Asset and inventory tracking
* Ledger number tracking
* Quantity management
* Asset assignment
* Asset transfers
* Disposal management
* Inventory status tracking

## 🏗️ System Architecture

The application follows a client-server architecture:

```text
┌──────────────────────┐
│      React Client    │
│                      │
│  React + Vite        │
│  Tailwind CSS        │
│  React Router        │
└──────────┬───────────┘
           │
           │ REST API
           ▼
┌──────────────────────┐
│     Node.js Server   │
│                      │
│  Express.js          │
│  Controllers         │
│  Routes              │
│  Authentication      │
└──────────┬───────────┘
           │
           │ SQL Queries
           ▼
┌──────────────────────┐
│       MySQL          │
│                      │
│ Users                │
│ Groups               │
│ Assets               │
│ Inventory            │
│ Assignments          │
│ Transfers            │
│ Disposals            │
└──────────────────────┘
```

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* React Icons
* Axios
* React Hot Toast

### Backend

* Node.js
* Express.js
* REST APIs
* JWT-based authentication
* Role-based authorization

### Database

* MySQL

### Development Tools

* Visual Studio Code
* Git
* GitHub
* MySQL Workbench

## 📁 Project Structure

```text
Inventory-Management-System/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   └── package.json
│
└── README.md
```

## 🔑 Role-Based Workflow

### Admin

```text
Login
  ↓
Admin Dashboard
  ├── Manage Users
  └── Manage Groups
```

### Inventory Holder

```text
Login
  ↓
Inventory Dashboard
  ├── View Inventory
  ├── Receive Stock
  ├── Assign Assets
  ├── View My Assets
  ├── Manage Transfers
  ├── Manage Disposals
  └── Manage Group Disposals
```

### User

```text
Login
  ↓
User Dashboard
  ├── View My Assets
  ├── Transfer Request
  ├── Disposal Request
  └── Profile
```

## 🔄 Core Asset Workflow

```text
Stock Received
      ↓
Inventory
      ↓
Asset Assigned
      ↓
User Receives Asset
      ↓
 ┌────┴─────────────┐
 ↓                  ↓
Transfer          Disposal
 ↓                  ↓
Approval           Request
 ↓                  ↓
New User          Disposal
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/raj-aditya11/Inventory-Management-System.git
cd Inventory-Management-System
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

### 4. Configure environment variables

Create a `.env` file in the server directory and configure the required database and authentication variables.

Example:

```env
PORT=5000

DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=inventory_management

JWT_SECRET=your_secret_key
```

> Do not commit your `.env` file or database credentials to GitHub.

### 5. Start the backend

```bash
cd server
npm run dev
```

### 6. Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend will then be available through the local development URL provided by Vite.

## 🗄️ Database

The project uses **MySQL** for persistent data storage.

The database contains entities for managing:

* Users
* Groups
* Assets
* Inventory
* Asset Assignments
* Transfer Requests
* Disposal Requests

The database design was developed using an EER model before implementation.

## 🔒 Security

The application implements:

* JWT-based authentication
* Password-protected accounts
* Role-based authorization
* Protected API routes
* Input validation
* Soft deletion for applicable records
* Environment variables for sensitive configuration

## 🚀 Future Improvements

Potential future enhancements include:

* Advanced inventory analytics
* Exportable inventory reports
* Automated email notifications
* Audit logs
* Advanced search and filtering
* Asset maintenance tracking
* Improved dashboard visualizations
* Deployment to a production environment

## 👨‍💻 Author

**Aditya Raj**

B.Tech Student
Bharati Vidyapeeth's College of Engineering, New Delhi
GGSIPU

---

## 📄 Project Status

**Completed as part of a Summer Internship Project.**
