Task Managment Aplication
This app was made as part of intership for the university.Keep all your tasks in one place, organize them easily, and stay on top of everything with our Task Management App. It helps you manage your to-do list, prioritize tasks, and collaborate with others effortlessly.
Team Members
Marina Ćavar - Backend Developer
Mila Lovrić - Frontend Developer
Table of Contents
Installation
Backend Technologies
Frontend Technologies
Features
Registered Users
Administrators
Conclusion
Installation
Getting Started
Clone the repository to your local machine: git clone 
Using the editor such as Visual Studio Code, open the project folder.
Backend
Navigate to the backend directory: cd back
Install dependencies: npm install
Start the application: nodemon server.js
Frontend
Navigate to the frontend directory: cd frontend
Install dependencies: npm install
Start the application: npm run dev
Backend Technologies
Node.js
Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows developers to run JavaScript on the server-side, enabling the development of scalable and high-performance web applications.

Express.js
Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for building web applications and APIs. It simplifies the process of handling HTTP requests, routing, and middleware integration.

MongoDB
MongoDB is a popular NoSQL database that uses a flexible document-based model. It stores data in JSON-like documents, making it easy to store and retrieve data in a schema-less format.

Dependencies
bcrypt: Library for password hashing.
Used for securely storing user passwords in the database.
body-parser: Middleware for parsing request bodies.
Parses incoming request bodies in a middleware before handlers, available under the req.body property.
cookie-parser: Middleware for parsing cookies in requests.
Parses cookies attached to the client request object.
cors: Middleware for enabling Cross-Origin Resource Sharing (CORS) requests.
Enables the server to handle requests from different origins.
dotenv: Library for loading environment variables from a .env file.
Allows configuration variables to be stored in a separate file for easy management.
ejs: Template engine for generating HTML.
Allows dynamic generation of HTML pages on the server.
express-flash: Provides flash messages for Express.js.
Displays messages to users for a short period of time.
express-session: Middleware for managing sessions in Express.js.
Enables session management and authentication.
jsonwebtoken: Implementation of JSON Web Token (JWT) authentication.
Enables secure transmission of information between parties.
mongoose: MongoDB library for Node.js.
Provides a straight-forward, schema-based solution for modeling application data.
nodemailer: Library for sending email messages.
Facilitates sending email notifications to users.
passport: Middleware for user authentication.
Used for authenticating requests.
passport-local: Passport strategy for local authentication.
Used for authenticating users with a username and password.
upload: Library for file uploads.
Allows users to upload files, such as zip archives for workshop test submissions.
Frontend Technologies
Next.js
Next.js is a React framework that provides server-side rendering and static site generation capabilities. It simplifies the process of building React applications by offering features like automatic code splitting, hot module replacement, and route pre-fetching.

Tailwind CSS
Tailwind CSS is a utility-first CSS framework that allows developers to quickly build custom designs without writing traditional CSS. It provides a set of pre-defined utility classes that can be used to style HTML elements.

Dependencies
@hookform/resolvers: Library for form validation.
Enables client-side form validation.
@mui/material: Material design components for React.
Provides a set of ready-to-use UI components.
@nextui-org/react: React UI components.
Offers UI components for building React applications.
axios: HTTP client for making requests.
Allows making HTTP requests from the client-side.
cookie-cutter: Library for cookie manipulation in the browser.
Facilitates working with cookies in the browser.
jwt-decode: Library for decoding JSON Web Tokens (JWT).
Allows decoding JWTs to extract information.
next: Framework for React.
Provides features for server-side rendering and routing.
react: A library for building user interfaces.
The core library for building React components.
react-cookie: Library for handling cookies in React.
Provides hooks for managing cookies in React components.
react-dom: Library for DOM manipulation in React.
Used for rendering React components to the DOM.
react-hook-form: Library for managing forms in React.
Enables easy form validation and submission in React.
react-hot-toast: Toast notifications library for React.
Provides customizable toast notifications for React applications.
react-icons: Icon library for React applications.
Offers a wide range of icons for use in React components.
react-router-dom: React navigation components.
Provides routing capabilities for React applications.
yup: Library for data validation.
Enables schema-based validation of data.
Features
