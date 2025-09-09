# VoiceUp: Your Voice, Your Solution 🗣️

## Empowering Citizens, Streamlining Governance.

VoiceUp is a **full-stack Complaint Management System** meticulously crafted to bridge the communication gap between citizens and government services. Our mission is to empower individuals to effortlessly raise and track public service issues, fostering a new era of transparency, accountability, and efficient interaction.

---

## ✨ Key Features

VoiceUp is packed with intuitive features designed to make your voice heard and problems resolved:

### Citizen-Facing Features:

*   **Effortless Complaint Submission:**
    *   **Visual Evidence:** Capture and upload photos or videos directly from your camera or gallery to provide undeniable proof.
    *   **Detailed Descriptions:** Clearly articulate your concerns with comprehensive captions.
    *   **Smart Location Tagging:** Auto-detects your location with options for manual adjustment, ensuring precise reporting.
*   **Real-time Complaint Tracking:**
    *   Monitor the live status of your submitted complaints with an enhanced, responsive UI.
    *   Powerful filtering capabilities: Easily search by ID, description, location, status, category, and date.
*   **Community Engagement:**
    *   **Commenting:** Engage in discussions on existing problems to provide additional information or context, with comments now displaying author information (anonymous or departmental).
    *   **Liking:** Show your support for a complaint and help to highlight its importance. (Note: Current implementation allows multiple likes from the same browser; "Like Once" logic needs further development.)
*   **Adaptive & Intuitive User Interface:**
    *   **Responsive Design:** A modern, clean interface that looks stunning and performs flawlessly on any device (desktop, tablet, mobile).
    *   **Streamlined Navigation:** Quick access to Home, Services, Track, and Login pages, optimized for mobile.
    *   **Engaging Hero Section:** "Raise Your Voice. Get Your Problem Resolved." - a powerful call to action.
    *   **Comprehensive Services:** Highlights key government service categories (electricity, water, sanitation, healthcare, police, transport).
    *   **Always-On Complaint Button:** A floating button for instant complaint submission from any page.
    *   **Informative Footer:** Essential links and social media integration for a complete experience.

### Departmental Features:

*   **Secure Departmental Authentication:**
    *   Dedicated signup, email verification, and login pages for government departments.
    
    *   JWT-based authentication for secure access.
*   **Departmental Dashboard:**
    *   Overview of problem statistics (resolved, in progress, pending).
    *   Integration with problem list and map views for comprehensive monitoring.
*   **Complaint Management:** Departments can now view and manage complaints relevant to them, including updating complaint statuses (e.g., Mark In Progress, Mark as Resolved) and viewing attached media (images/videos).

---

## 🚀 Tech Stack

Built with robust and modern technologies to ensure performance and scalability:

*   **Frontend:** React.js (a powerful JavaScript library for building user interfaces)
*   **Backend:** Node.js & Express.js (a fast, unopinionated, minimalist web framework for Node.js)
*   **Database:** MongoDB (a flexible NoSQL database for storing complaint data)
*   **Cloud Storage:** Cloudinary (for secure and efficient image/video uploads and management)
*   **Email Service:** Nodemailer (for sending email verifications)
*   **Background Tasks:** Custom request scheduler (for keeping services active)

---

## ⚙️ Core Functionality Overview

### Backend Architecture:

The backend is built with Node.js and Express.js, providing a RESTful API.
*   **Server Setup:** `server.js` acts as the entry point, handling middleware (CORS, JSON/URL parsing, Multer for multipart data), connecting to MongoDB via Mongoose, and mounting API routes.
*   **Problem Module:** Manages all complaint-related operations. This includes creating problems with media uploads (handled by Cloudinary), retrieving problems (all, by ID, by coordinates), deleting problems, adding comments (with author information), and liking problems. It also now supports updating problem statuses.
*   **Department Module:** Handles the full lifecycle of departmental accounts, from secure signup (with password hashing via bcrypt and custom `departmentId` generation) and email verification (using Nodemailer and generated codes) to JWT-based login with optional IP validation.
*   **Utilities:** Includes an email service for sending verification codes and a request scheduler to send periodic HTTP GET requests, useful for maintaining server activity on certain hosting environments.

### Frontend Architecture:

The frontend is a React.js single-page application, utilizing `react-router-dom` for navigation.
*   **Routing:** `App.js` centralizes all application routes, distinguishing between user-facing and departmental sections.
*   **User Interface:**
    *   **Citizen-Facing:** Provides intuitive forms for complaint submission (integrating camera/gallery and geolocation), a comprehensive tracking page with advanced filtering (by ID, description, location, status, category, date), and detailed views for individual complaints with commenting capabilities (displaying author information).
    *   **Departmental-Facing:** Features secure login and signup flows. Includes dashboard components for an overview of problem statistics and a map view. Departments can now update complaint statuses and view attached media directly from the complaint details page.
*   **Global Components:** A consistent header, footer, and a floating button for quick complaint submission are integrated across the application. API calls are managed using Axios, with base URLs configured via environment variables for flexible deployment.

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