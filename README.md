# CodePlayground Backend

**Live API Base URL:** [https://playground-backend-oyl1.onrender.com](https://playground-backend-oyl1.onrender.com)

This is the backend for the CodePlayground project — a full-stack coding interview preparation platform that supports:

* User authentication (signup/login)
* Code execution via an isolated workspace for JavaScript, Python, and C++

---

## Features

### Authentication APIs

* `POST /api/auth/signup` – Register a new user
* `POST /api/auth/login` – Authenticate user and return JWT

### Code Execution API

* `POST /api/execute`

  * Accepts: `language`, `code`, and optional `input`
  * Supported languages: JavaScript, Python, C++
  * Returns the output or any runtime/compile error

---

## Tech Stack

* Node.js
* Express.js
* MongoDB with Mongoose
* JWT for authentication
* Child Process for code execution

---

## Folder Structure

```
server/
├── controllers/         # Auth logic
├── middleware/          # JWT auth middleware
├── models/              # Mongoose User model
├── routes/              # API routes (auth, execute)
├── temp/                # Temporary files created for execution
├── .env                 # Environment variables (not committed)
├── index.js             # Entry point
```

---

## Environment Variables (.env)

```
MONGO_URI=your_mongo_uri_here
JWT_SECRET=your_jwt_secret_here
```

---

## Run Locally

1. Clone the repo:

```bash
git clone https://github.com/sakshisinha-13/playground-backend.git
cd playground-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root with your MongoDB URI and JWT secret.

4. Start the server:

```bash
node index.js
```

> The server will run on `http://localhost:5000`

-----

---

## License

This project is licensed under the MIT License.
