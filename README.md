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

