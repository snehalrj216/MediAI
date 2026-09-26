# 🩺 MediAI

An AI-powered full-stack doctor appointment platform that helps patients find doctors, get AI-assisted specialization guidance, and manage appointments online.

**Smart Healthcare, Simplified.**

## 📌 Overview

MediAI is a full-stack healthcare appointment management application built using React.js, Node.js, Express.js, MongoDB, and Google Gemini API.

## 🔄 Application Flow

### Patient

Register/Login  
↓  
AI Health Assistant  
↓  
Find Doctor  
↓  
Book Appointment  
↓  
Track Appointment  
↓  
Cancel / View Appointment

### Doctor

Doctor Login  
↓  
Doctor Dashboard  
↓  
View Patient Appointments  
↓  
Confirm / Cancel  
↓  
Mark Completed  
↓  
Remove from View  
↓  
Completed History

## 👤 Patient Features

- Register and login
- AI-powered health assistant
- Get suggested doctor specialization based on a health concern
- Search doctors by name or specialization
- View doctor experience and availability
- Book appointments
- View appointment history
- Track appointment status
- Cancel appointments

## 👨‍⚕️ Doctor Features

- Doctor registration and login
- Role-based doctor dashboard
- View patient appointments
- View appointment statistics
- Confirm appointments
- Cancel appointments
- Mark appointments as completed
- Remove completed appointments from the main       dashboard view
- View completed appointment history

## 🤖 AI Health Assistant

The application integrates Google Gemini API to provide general healthcare guidance.

Patients can describe their concern in natural language.

Example:

> "I have frequent headaches and sometimes feel dizzy."

The AI can suggest a relevant medical specialization such as:

> Neurologist

The AI response also includes general guidance and an important disclaimer that it does not provide a medical diagnosis.

## 📅 Appointment Management

Patients can select:

- Doctor
- Appointment date
- Appointment time
- Reason for visit

The appointment is stored in MongoDB and can be viewed from the patient's appointment dashboard.

Doctors can manage appointment status:

```text
Pending → Confirmed → Completed


🛠️ Tech Stack
Frontend
React.js
JavaScript
React Router
Lucide React
CSS
Vite
Backend
Node.js
Express.js
REST APIs
JWT
bcryptjs
CORS
Database
MongoDB
Mongoose
Generative AI
Google Gemini API
Development Tools
VS Code
Git
GitHub
Chrome DevTools
🔒 Security

The project uses:

bcrypt for password hashing
JWT for authentication
Environment variables for API keys and database credentials
Role-based access for patients and doctors
CORS for frontend-backend communication

Sensitive credentials are stored in environment variables and are not committed to GitHub.

🤖 AI Safety

The AI Health Assistant is intended for general guidance only.

It does not provide medical diagnosis or replace professional medical advice.

Users are encouraged to consult a qualified healthcare professional for medical concerns.

📚 What I Learned

Through this project, I worked with:

React.js
Full-stack application development
REST API development
MongoDB and Mongoose
JWT authentication
Password hashing
Role-based authentication
React Router
Asynchronous API requests
Generative AI integration
Google Gemini API
Frontend-backend integration
Error handling
Git and GitHub
🔮 Future Improvements

Possible future improvements include:

Doctor availability scheduling
Appointment reminders
Email notifications
Online consultation
Payment integration
Admin dashboard
Improved AI appointment assistance
👩‍💻 Author

Snehal Jadhav

B.E. Artificial Intelligence & Data Science

## 📸 Screenshots

### 🏠 Home

![MediAI Home](Screenshot%202026-09-26%20124539.png)

### 👨‍⚕️ Find Doctors

![Find Doctors](Screenshot%202026-09-26%20124631-2.png)

### 🤖 AI Health Assistant

![AI Health Assistant](Screenshot%202026-09-26%20124619.png)

### 📅 Book Appointment

![Book Appointment](Screenshot%202026-09-26%20132424.png)

### 📋 My Appointments

![My Appointments](Screenshot%202026-09-26%20124640.png)

### 🩺 Doctor Dashboard

![Doctor Dashboard](Screenshot%202026-09-26%20124710.png)

![Completed History](Screenshot%202026-09-26%20124727.png)

Since this is a healthcare application, I'd add:
```markdown
## ⚠️ Disclaimer

MediAI is a portfolio/educational project. The AI Health Assistant provides general informational guidance and is not a medical diagnostic tool. Users should consult qualified healthcare professionals for medical advice.

