
# VIVA / Interview Questions for VoiceUp Project

## General/Conceptual Questions

1.  **What is the purpose of the VoiceUp application? What problem does it solve?**
2.  **Can you give a high-level overview of the project's architecture?** (e.g., MERN stack, client-server architecture)
3.  **Who are the target users of this application?** (e.g., general public, government departments, administrators)
4.  **Walk me through the user flow of reporting a new problem.**
5.  **How does a department or organization register and get verified on the platform?**
6.  **What is the role of the administrator in this system?**
7.  **How do you handle user authentication and authorization?**
8.  **What are the key features of the VoiceUp application?**
9.  **What was your specific role in this project? What parts of the application did you work on?**
10. **What were the biggest challenges you faced during the development of this project? How did you overcome them?**
11. **If you had more time, what features would you add to the application?**
12. **How did you collaborate with your team members? What tools did you use for collaboration?** (e.g., Git, GitHub, etc.)

## Frontend (React) Questions

1.  **What version of React are you using? What are some of the key features of this version?**
2.  **Explain the folder structure of the `frontend` directory.**
3.  **What is the purpose of the `axiosInstance.js` file? Why is it important?**
4.  **How are you managing routing in the application? Explain the use of `react-router-dom`.**
5.  **What is the difference between `ProtectedRoute` and `AdminProtectedRoute`? How do they work?**
6.  **Explain the purpose of the `AuthContext.js` file. How does it manage authentication state?**
7.  **How are you handling asynchronous API calls in the frontend?** (e.g., `useEffect`, `axios`)
8.  **What is the purpose of the `ScrollToTop.jsx` component?**
9.  **How are you using `Chart.js` and `react-chartjs-2` in the application? Can you give an example?**
10. **Explain the use of `Leaflet` and `react-leaflet` for displaying maps.**
11. **How are you handling forms in the application? Are you using any form libraries?**
12. **How do you handle state management in the application? Are you using only component state (`useState`) or a state management library like Redux or MobX?**
13. **What is the purpose of the `proxy` setting in `package.json`?**
14. **How have you optimized the performance of the React application?** (e.g., code splitting, lazy loading, memoization)
15. **How have you handled styling in the application? Are you using CSS modules, styled-components, or another approach?**

## Backend (Node.js/Express) Questions

1.  **Explain the folder structure of the `backend` directory.**
2.  **What is the purpose of the `server.js` file? What middleware are you using and why?**
3.  **How are you handling environment variables in the backend?**
4.  **Explain the purpose of the `requestScheduler.js` file.**
5.  **What is the role of the `routes`, `controllers`, and `models` directories?**
6.  **How are you handling authentication and authorization in the backend? Explain the use of `jsonwebtoken` and `bcrypt`.**
7.  **What is the purpose of the `auth.middleware.js` and `admin.middleware.js` files?**
8.  **How are you handling file uploads? Explain the use of `multer` and `cloudinary`.**
9.  **How are you sending emails from the backend? Explain the use of `nodemailer`.**
10. **Explain the purpose of the `trustedDeviceService.js` file.**
11. **How have you structured your API routes? Can you give an example of a protected route?**
12. **How do you handle errors in your Express application?**
13. **What is the purpose of the `type: "module"` setting in `package.json`?**
14. **How have you optimized the performance of the Node.js application?**

## Database (MongoDB) Questions

1.  **Why did you choose MongoDB as the database for this project?**
2.  **Can you explain the schema for the `Problem`, `Department`, and `Admin` models?**
3.  **What is the purpose of the `TrustedDevice.model.js`?**
4.  **How have you used Mongoose to interact with the MongoDB database?**
5.  **What are some of the Mongoose queries you have used in the application?**
6.  **How have you handled data validation in your Mongoose schemas?**
7.  **Have you used any indexing in your MongoDB collections? Why is it important?**
8.  **How do you handle relationships between different collections?** (e.g., between `Problem` and `Department`)

## DevOps/Deployment Questions

1.  **How did you deploy the VoiceUp application? What platform did you use?** (e.g., Heroku, Vercel, AWS)
2.  **What is the purpose of the `.gitignore` file?**
3.  **What is the purpose of the `package-lock.json` file?**
4.  **How do you manage dependencies in the project?**
5.  **What is the purpose of the `scripts` section in `package.json`?**

## Security Questions

1.  **How have you protected the application against common security vulnerabilities like Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF)?**
2.  **How are you hashing user passwords? Why is it important?**
3.  **How are you handling sensitive information like API keys and database credentials?**
4.  **What is the purpose of the `cors` middleware in the backend?**
5.  **How do you ensure that only authorized users can access certain API endpoints?**
6.  **Have you implemented any rate limiting in the application?**
7.  **What is the purpose of the `trust proxy` setting in the Express application?**
