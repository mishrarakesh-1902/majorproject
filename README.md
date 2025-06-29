# 🏡 Major Project - Dynamic Listings Web App  
**Deployed on Render | Built with Node.js, Express & MongoDB**

[![Deployed on Render](https://img.shields.io/badge/Live-Demo-brightgreen)](https://majorproject-lg4r.onrender.com/)

---

## 🧭 Overview

**Major Project** is a full-stack Node.js web application designed for listing-based marketplaces. Built using Express.js and MongoDB, the app allows users to create, view, update, and delete listings, each with integrated location mapping powered by Mapbox.

🌍 Designed to make location-based listings modern, visual, and intuitive.

---

## ✨ Key Features

### 👤 User Authentication
- Secure registration/login using Passport.js
- Role-based permissions for listing owners

### 📍 Interactive Map Integration
- Mapbox GL JS for dynamic maps
- Automatically geocodes listing locations

### 🖼 Image Upload & Cloud Storage
- Users can upload images for their listings
- Handled securely using Cloudinary + Multer

### 📝 Listing Management
- Create/Edit/Delete listings
- View detailed pages with reviews, location, and user data

### 💬 Reviews & Ratings
- Authenticated users can leave reviews on listings
- Reviews linked with user accounts

---

## 🛠 Tech Stack

| Layer        | Technologies Used                                  |
|--------------|-----------------------------------------------------|
| 💻 Frontend   | EJS, HTML, CSS, Bootstrap                          |
| ⚙️ Backend    | Node.js, Express.js                                |
| 🗃 Database   | MongoDB with Mongoose ODM                          |
| 🧭 Maps       | Mapbox SDK + Mapbox GL JS                          |
| ☁️ File Uploads | Multer & Cloudinary                               |
| 🔐 Auth       | Passport.js, express-session, connect-flash       |
| 🌐 Deployment | Render (Free Tier Hosting)                         |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mishrarakesh-1902/majorproject.git
cd majorproject
```
---
## Install Dependencies
```
npm install
```

## Create .env File
```
touch .env

Add the following environment variables to your .env:
MAP_TOKEN=your_mapbox_token
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
DB_URL=your_mongodb_connection_string
SECRET=session_secret_key
```

## Run the Server
```
npm start
```
## 📁 Project Structure
```
majorproject/
│
├── models/                # Mongoose models (Listing, Review, User)
├── routes/                # Express routes
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
├── controllers/           # Route controllers
├── views/                 # EJS templates
│   ├── listings/
│   ├── reviews/
│   └── users/
├── public/                # Static assets (CSS, JS, images)
├── utils/                 # Utility files like ExpressError, middleware
├── app.js                 # Entry point
├── package.json
└── .env.example           # Sample environment variables
```

## 📸 Screenshots
![image](https://github.com/user-attachments/assets/ed89bdd0-18a4-406b-93d6-ae6f4b0c73ce)

![image](https://github.com/user-attachments/assets/bac4da85-31d5-4317-9d2e-acd40cb80875)

![image](https://github.com/user-attachments/assets/0afa5339-64f5-4d33-8847-72a267528a0e)

![image](https://github.com/user-attachments/assets/fb8d9330-76b6-41b8-9b67-25710508775c)

---

## 🙋‍♂️ Author
Rakesh Kumar Mishra
📧 mishrarakeshkumar766@gmail.com
🔗 [GitHub](https://github.com/mishrarakesh-1902/majorproject)
🔗 [LinkedIn](https://www.linkedin.com/in/rakesh-kumar-b64934284/)

### ✅ How to Use:
- Save this as `README.md` in your GitHub repo root.
- Add screenshots in the 📸 section.
- Replace dummy keys in `.env` setup with your real environment variable names.

Let me know if you want to:
- Add GitHub action/deploy badges
- Generate a Hindi version
- Add a Contributors section

Happy coding, Rakesh! 🚀
















