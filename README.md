# 🏥 DocRounds – Daily Patient Care Portal

DocRounds is a healthcare management and doctor round monitoring system developed as an MCA Mini Project.
The application helps hospitals manage doctors, patients, daily round reports, blood requirements, and medical updates through a centralized digital platform.

The system is built using **React**, **Python Flask**, and **MongoDB Atlas**, providing scalable and efficient healthcare data management.

---

## 🚀 Features

* 🔐 Role-Based Authentication

  * Admin
  * Hospital
  * Doctor
  * Patient

* 🏥 Hospital Management

  * Register hospitals
  * Manage hospital details
  * Track active status

* 👨‍⚕️ Doctor Management

  * Add and manage doctors
  * Assign doctors to hospitals
  * Store specialization details

* 🧑‍🤝‍🧑 Patient Management

  * Register patients
  * Assign doctors
  * Maintain patient records

* 📋 Daily Round Reports

  * Doctors can submit patient round reports
  * Store timestamps and medical observations

* 🩸 Blood Requirement Management

  * Blood request tracking
  * Hospital blood requirement updates

* 🖼️ Medical Report Upload

  * Upload medical images using Cloudinary
  * Store secure image URLs in MongoDB

* 📱 SMS Notification Support

  * Twilio integration for notifications
  * Guardian alerts and report updates

---

# 🛠️ Tech Stack

## Frontend

* React.js
* HTML5
* CSS3
* JavaScript

## Backend

* Python
* Flask
* REST APIs

## Database

* MongoDB
* MongoDB Atlas

## Third-Party Services

* Cloudinary
* Twilio SMS API

---

# 📂 Project Structure

```bash
DocRounds/
│
├── frontend/          # React Frontend
│
├── backend/           # Flask Backend
│
├── README.md
│
├── package.json
└── package-lock.json
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Shreyas-ven/DocRounds.git
cd DocRounds
```

---

## 2️⃣ Setup Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```bash
http://localhost:3000
```

---

## 3️⃣ Setup Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs on:

```bash
http://localhost:5000
```

---

# 🍃 MongoDB Configuration

Create a `.env` file inside backend folder:

```env
MONGO_URI=your_mongodb_atlas_connection
SECRET_KEY=your_secret_key
CLOUDINARY_URL=your_cloudinary_url
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

---

# 🧾 Sample MongoDB Collections

* Hospitals
* Doctors
* Patients
* RoundReports
* BloodRequirements
* MedicalRequirements

---

# 📸 Project Snapshots

## MongoDB Atlas Dashboard

* Database collections and cloud storage management

## Hospital Dashboard

* Hospital registration and management

## Doctor Dashboard

* Doctor profile and round management

## Patient Dashboard

* Patient records and doctor assignment

## Round Report Dashboard

* Daily report submission and tracking

---

# 🔒 Security Features

* Password Hashing
* Role-Based Access Control
* API Validation
* Secure Database Access
* Protected Medical Records

---

# 📈 Future Enhancements

* AI-based patient analysis
* Video consultation support
* Real-time emergency alerts
* Mobile application integration
* Advanced analytics dashboard

---

# 🎓 Academic Information

### MCA – 1st Semester Mini Project

**Project Title:**
DocRounds – Daily Patient Care Portal

**University:**
Sapthagiri NPS University

**Department:**
School of Applied Science

---

# 👨‍💻 Author

## Shreyas V

MCA Student
Sapthagiri NPS University

GitHub:
[Shreyas-ven/DocRounds Repository](https://github.com/Shreyas-ven/DocRounds?utm_source=chatgpt.com)

---

# 📚 References

* [Flask Documentation](https://flask.palletsprojects.com/?utm_source=chatgpt.com)
* [MongoDB Documentation](https://www.mongodb.com/docs/?utm_source=chatgpt.com)
* [Cloudinary Documentation](https://cloudinary.com/documentation?utm_source=chatgpt.com)
* [Twilio Documentation](https://www.twilio.com/docs/?utm_source=chatgpt.com)

---

# ⭐ Support

If you found this project useful, consider giving the repository a ⭐ on GitHub.
