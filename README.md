# VoiceUp: Your Voice, Your Solution 🗣️

## Empowering Citizens, Streamlining Governance.

VoiceUp is a **full-stack Complaint Management System** meticulously crafted to bridge the communication gap between citizens and government services. Our mission is to empower individuals to effortlessly raise and track public service issues, fostering a new era of transparency, accountability, and efficient interaction.

---

## ✨ Key Features

VoiceUp is packed with intuitive features designed to make your voice heard and problems resolved:

### Citizen-Facing Features:

*   **Effortless Complaint Submission:**
    *   **Visual Evidence:** Capture and upload photos or videos directly from your camera or gallery.
    *   **Detailed Descriptions:** Clearly articulate your concerns with comprehensive captions.
    *   **Smart Location Tagging:** Auto-detects your location with options for manual adjustment.
*   **Real-time Complaint Tracking:**
    *   Monitor the live status of your submitted complaints with an enhanced, responsive UI.
    *   Powerful filtering capabilities: Easily search by ID, description, location, status, category, and date.
*   **Community Engagement:**
    *   **Commenting:** Engage in discussions on existing problems to provide additional information or context.
    *   **Liking:** Show your support for a complaint and help to highlight its importance.

### Departmental Features:

*   **Secure Departmental Authentication:**
    *   Dedicated signup, email verification, and login pages for government departments.
    *   JWT-based authentication for secure access.
    *   **Trusted Device Verification:** For enhanced security, logins from new devices are verified via an OTP sent to the department's registered email.
*   **Departmental Dashboard:**
    *   Overview of problem statistics (resolved, in progress, pending).
    *   Integration with problem list and map views for comprehensive monitoring.
*   **Complaint Management:** Departments can view and manage complaints relevant to them, including updating complaint statuses and viewing attached media.

---

## 🚀 Tech Stack

| Category          | Technology                                                                      |
| ----------------- | ------------------------------------------------------------------------------- |
| **Frontend**      | [React.js](https://reactjs.org/)                                                |
| **Backend**       | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)             |
| **Database**      | [MongoDB](https://www.mongodb.com/) (with [Mongoose](https://mongoosejs.com/))    |
| **Cloud Storage** | [Cloudinary](https://cloudinary.com/)                                           |
| **Email Service** | [Nodemailer](https://nodemailer.com/)                                           |
| **Authentication**| [JSON Web Tokens (JWT)](https://jwt.io/), [bcrypt](https://www.npmjs.com/package/bcrypt) |


---

## ⚙️ Core Functionality Overview

### Backend Architecture:

The backend is built with Node.js and Express.js, providing a RESTful API.

*   **Server Setup:** `server.js` acts as the entry point, handling middleware (CORS, JSON/URL parsing, Multer for multipart data), connecting to MongoDB via Mongoose, and mounting API routes.
*   **Problem Module:** Manages all complaint-related operations. This includes creating problems with media uploads (handled by Cloudinary), retrieving problems (all, by ID, by coordinates), deleting problems, adding comments, and liking problems. It also supports updating problem statuses.
*   **Department Module:** Handles the full lifecycle of departmental accounts, from secure signup (with password hashing via bcrypt and custom `departmentId` generation) and email verification (using Nodemailer and generated codes) to JWT-based login with an additional layer of security through trusted device verification.
*   **Models:**
    *   `Problem.model.js`: Defines the schema for complaints, including details like title, description, category, location, media, status, likes, and comments.
    *   `Department.model.js`: Defines the schema for department accounts, including authentication details, department information, and verification status.
    *   `TrustedDevice.model.js`: Stores information about devices that have been verified for a department, enabling a smoother login experience on recognized devices.

### Frontend Architecture:

The frontend is a React.js single-page application, utilizing `react-router-dom` for navigation.

*   **Routing:** `App.js` centralizes all application routes, distinguishing between user-facing and departmental sections. It uses `ProtectedRoute` to secure departmental pages.
*   **User Interface:**
    *   **Citizen-Facing:** Provides intuitive forms for complaint submission (integrating camera/gallery and geolocation), a comprehensive tracking page with advanced filtering, and detailed views for individual complaints.
    *   **Departmental-Facing:** Features secure login and signup flows. Includes dashboard components for an overview of problem statistics and a map view. Departments can update complaint statuses and view attached media directly from the complaint details page.
*   **API Communication:** `axiosInstance.js` creates a centralized Axios instance for making API calls to the backend, with the base URL configured via environment variables.

---

## 🛠️ Getting Started

Follow these simple steps to get VoiceUp up and running on your local machine.

### Prerequisites

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   npm (Node Package Manager) or Yarn
*   Git
*   MongoDB instance (local or cloud-based, e.g., [MongoDB Atlas](https://www.mongodb.com/atlas/))
*   [Cloudinary](https://cloudinary.com/) account (for image storage)
*   Gmail account credentials for email verification (for backend `.env`)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/VoiceUp.git
    cd VoiceUp
    ```
2.  **Backend Setup:**
    ```bash
    cd backend
    # Create a .env file in the 'backend' directory with your credentials:
    # MONGODB_URL=<Your MongoDB Connection String>
    # CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
    # CLOUDINARY_API_KEY=<Your Cloudinary API Key>
    # CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>
    # JWT_SECRET=<A strong, random secret string for JWT>
    # GMAIL_USER=<Your Gmail Email Address>
    # GMAIL_PASS=<Your Gmail App Password>
    # REQUEST_SCHEDULER_URL=<Optional: URL to ping for keeping server awake, e.g., your deployed backend URL>
    npm install
    npm start
    ```
3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    # Create a .env file in the 'frontend' directory:
    # REACT_APP_API_URL=http://localhost:5000 (or your deployed backend URL)
    npm install
    npm start
    ```

Once both servers are running, open your browser and navigate to `http://localhost:3000`.

---

## 📸 Screenshots

*(Help us showcase VoiceUp! Add compelling screenshots here to highlight the application's key features and responsive design.)*

*   **Homepage (Desktop):** [Placeholder for image]
*   **Complaint Submission Form:** [Placeholder for image]
*   **Complaint Tracking Page:** [Placeholder for image]
*   **Department Login Page:** [Placeholder for image]
*   **Department Dashboard:** [Placeholder for image]

---

## 💡 Future Enhancements

We're continuously working to improve VoiceUp. Here are some planned features:

*   **Real-time Notifications:** Instant updates on complaint status changes.
*   **User Feedback System:** Allow citizens to provide feedback on resolved issues.
*   **Advanced Analytics:** Generate insights into complaint trends and resolution efficiency.
*   **Robust User Authentication:** Further enhance security and user management (e.g., password reset, multi-factor authentication).
*   **"Like Once" Enforcement:** Implement backend logic to ensure users can only like a problem once.
*   **Unified Branding:** Standardize brand name ("VoiceUp") across all components (e.g., footer).
*   **Improved Frontend Styling:** Refactor inline CSS into modules for better maintainability.
*   **Enhanced Departmental Links:** Update footer and header links to point to correct departmental pages.

---

## ⚠️ Known Issues

*   **"Resloved" Typo:** There is a known typo in the database where the "Resolved" status is sometimes misspelled as "Resloved". This has been addressed in the backend model to prevent validation errors, but data cleanup may still be beneficial.

---

## 🤝 Contributing

We welcome contributions from the community! If you have suggestions, bug reports, or want to contribute code, please feel free to open an issue or submit a pull request.

---

## 📄 License

This project is intended to be licensed under an open-source license. (e.g., MIT License)
