# Hostel Complaint Management System - Requirements Document

## 1. Project Overview

A web-based application for managing hostel complaints. Users (students) can log in and submit complaints regarding hostel issues. Admins can view all complaints, assign workers to resolve them, and track status. Both admins and users can monitor the progress of complaints.

---

## 2. Stakeholders

- **Student (User):** Can register, log in, submit complaints, and track their complaint status.
- **Admin:** Manages complaints, assigns workers, tracks progress, and views complaint analytics.
- **Worker:** Receives complaints assigned by admin, marks them as resolved.

---

## 3. Functional Requirements

### 3.1 User Module

- **User Registration & Login**
  - Registration with hostel details (name, room, email, phone, password).
  - Secure login/authentication.
- **Submit Complaint**
  - Select category (maintenance, cleanliness, food, etc.).
  - Enter complaint description.
  - Option to attach images.
- **View Complaint Status**
  - List of complaints submitted by the user.
  - Track status: Pending, Assigned, In Progress, Resolved.
  - View admin/worker comments on complaint.
- **Edit Profile**
  - Update personal details.

### 3.2 Admin Module

- **Login**
  - Secure authentication for admin.
- **View All Complaints**
  - Complaint dashboard: filter by status, category, user, date.
  - View complaint details (user info, description, images).
- **Assign Worker**
  - Assign complaints to available workers.
  - Notify worker upon assignment.
- **Track Complaints**
  - Monitor progress and update status.
  - Add comments or feedback.
- **Complaint Analytics**
  - View statistics: complaints per category, resolution time, etc.

### 3.3 Worker Module

- **Login**
  - Worker authentication.
- **View Assigned Complaints**
  - List of complaints assigned by admin.
  - View complaint details.
- **Update Complaint Status**
  - Mark as In Progress/Resolved.
  - Add resolution comments.

---

## 4. Non-Functional Requirements

- **Responsiveness:** Works on mobile, tablet, and desktop.
- **Security:** Secure password storage, JWT-based authentication.
- **Scalability:** Designed for multiple hostels and users.
- **Performance:** Fast response times.
- **Usability:** Easy and intuitive UI.

---

## 5. Data Model Overview

### 5.1 User Model
- userId (unique)
- name
- roomNumber
- email
- phone
- password (hashed)
- role (student/admin/worker)

### 5.2 Complaint Model
- complaintId (unique)
- userId (reference)
- category
- description
- images (array)
- status (Pending/Assigned/In Progress/Resolved)
- assignedWorkerId (reference, optional)
- createdAt
- updatedAt
- comments (array: {author, message, timestamp})

### 5.3 Worker Model
- workerId (unique)
- name
- contactInfo
- assignedComplaints (array of complaintId)

---

## 6. User Stories

### As a Student
- I want to register and log in so I can submit complaints.
- I want to submit complaints with details and images.
- I want to track the status and comments of my complaints.

### As an Admin
- I want to view all complaints, filter them, and assign workers.
- I want to track complaint progress and update status.
- I want to analyze complaint trends.

### As a Worker
- I want to view complaints assigned to me.
- I want to update the status and add resolution comments.

---

## 7. Technology Stack

- **Frontend:** React.js
- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **File Uploads:** Multer (for images)

---

## 8. Basic Workflow

1. **User registers/logs in.**
2. **User submits complaint.**
3. **Admin views complaint and assigns to worker.**
4. **Worker updates complaint status.**
5. **User/admin can track complaints and see updates.**

---

## 9. API Endpoints (Sample)

- `POST /api/register` - Register user
- `POST /api/login` - Login
- `POST /api/complaints` - Submit complaint
- `GET /api/complaints` - Get complaints (user/admin)
- `PUT /api/complaints/:id/assign` - Admin assigns worker
- `PUT /api/complaints/:id/status` - Update complaint status (worker/admin)
- `GET /api/complaints/user/:userId` - Get all complaints by user

---

## 10. Future Enhancements

- Notification system (email/SMS)
- Multi-hostel support
- Feedback and rating for workers
- Complaint escalation mechanism

---

## 11. Appendix

- Sample UI wireframes
- Error handling guidelines
- Deployment instructions
