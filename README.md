# Gradely – Role-Based Collaborative Grading Platform

Gradely is a full-stack web application designed to simplify course management, assignment distribution, and grading workflows for **faculty, TAs, and students**. It supports role-based access control, solution submissions, grading, and feedback — all in one place.

---

## 🚀 Features

- **Role-Based Access Control (RBAC):**
  - Faculty can create courses, upload assignments (PDFs stored on Cloudinary), and manage grading.
  - TAs can view and grade student submissions.
  - Students can view assignments, submit solutions, and track submission status (pending/submitted/overdue).

- **Assignment Management:**
  - Upload assignments with deadlines and max points.
  - View all assignments grouped by courses.

- **Solution Submissions:**
  - Students can upload solutions (PDF) directly to Cloudinary.
  - Submissions are tracked with timestamps and grading status.

- **Grading Workflow:**
  - TAs and faculty can grade submissions, give feedback, and update scores.
  - Graded/ungraded submissions are grouped for clarity.

- **Real-Time Status Tracking:**
  - Assignments are marked as **pending**, **submitted**, or **overdue** based on deadlines and submission status.

---

## 🛠 Tech Stack

### **Frontend:**
- [React (Vite)](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/) for responsive UI


### **Backend:**
- [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas) with Mongoose for database operations
- [Axios](https://axios-http.com/) for API communication
- [Firebase Auth](https://firebase.google.com/) + React Context API for authentication and state management
- [Cloudinary](https://cloudinary.com/) for PDF and file storage
- Role-based REST API design with modular routers

---
## ⚡ Getting Started

Follow these steps to run the project locally:


### **1. Clone the Repository**
```bash
git clone https://github.com/Kake27/gradely.git
cd gradely
```

### **2. Backend Setup**
```bash
cd classroom-backend
npm install
```

Create a .env file in the backend directory with the following environmental variables:
```python
PORT=your_preferred_port
CLASSROOM_DB_URI=your_mongodb_database_connection_string
```

Start the backend server:
```bash
npm run dev
```

### **3. Frontend Setup**
Open a new terminal, navigate to the frontend folder and install required packages
```bash
cd frontend
npm install
```
Create a .env file in the frontend directory with the following environmental variables:
```python
VITE_FIREBASE_API_KEY: "your_api_key"
VITE_FIREBASE_AUTH_DOMAIN: "your_auth_domain"
VITE_FIREBASE_PROJECT_ID: "your_project_id"
VITE_FIREBASE_STORAGE_BUCKET: "your_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID: "your_messaging_sender_id"
VITE_FIREBASE_APP_ID: "your_app_id"
VITE_FIREBASE_MEASUREMENT_ID: "your_measurement_id"

VITE_CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
VITE_CLOUDINARY_API_KEY="your_cloudinary_api_key"
VITE_CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
```

Start the frontend server using:
```bash
npm run dev
```
---





