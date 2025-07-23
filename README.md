# 👗 WTWR: What To Wear

## 🌦️ Project Overview

WTWR (What To Wear) is a full-stack web application that helps users decide how to dress based on the current weather conditions. This repository focuses on the **backend configuration** of WTWR, powering features like user management, clothing item recommendations, and interaction endpoints (likes, deletions, and more).

Whether you're facing wind, snow, or blazing sunshine—WTWR equips you with the perfect wardrobe guidance.

---

## 🧠 Functionality

- 🔐 Authenticated user support
- 👕 CRUD operations for clothing items
- 👍 Ability to like/unlike clothing items
- ❌ Delete items (with ownership check)
- 📦 Graceful error handling via centralized `handleError` logic
- ✅ Route protection using middleware
- 🌐 Modular routing structure with Express Router

---

## ⚙️ Technologies Used

| Tech           | Purpose                                |
| -------------- | -------------------------------------- |
| **Express.js** | Backend routing and middleware setup   |
| **MongoDB**    | NoSQL database for user & item storage |
| **Mongoose**   | Elegant object modeling for MongoDB    |
| **NPM**        | Package management                     |
| **ES6**        | Modern JS syntax and structure         |
| **Postman**    | API testing and validation             |
| **Prettier**   | Code formatting and consistency        |

---

## 📸 Screenshots

### 🗂️ Express Folder Structure

![Express Folder Structure](./images/ExpressFolderStructure.png)

> A clean modular architecture showcasing organized routes, controllers, models, and utilities for scalability and maintainability.

---

### 🛢️ MongoDB Collection Overview

![MongoDB](./images/MOngoDB.png)

> A snapshot of how user and clothing item data is structured and stored in MongoDB collections.

---

### 🧪 Postman Test Scripts

![Postman Test Scripts](./images/PostmanTestScripts.png)

> End-to-end route testing with Postman to confirm functionality, validation, and error handling.

---

## 🚀 Getting Started

1. Clone this repo  
   `git clone https://github.com/your-username/wtwr-backend.git`

2. Install dependencies  
   `npm install`

3. Set up environment variables and MongoDB connection

4. Run the server  
   `npm start`

---

## 👤 Author

Developed with love by **Chonda** 💻✨

---

## 📜 License

This project is licensed under the MIT License.
