# 🏏 KPL Auction System

A full-stack web application that simulates a professional cricket auction platform where teams can bid for players in real time. The system provides an engaging and interactive experience for administrators, team owners, and participants.

## 🚀 Live Demo

🌐 https://kpl-auction-seven.vercel.app

---

## 📖 Overview

KPL Auction System is designed to streamline the player auction process for cricket tournaments. It allows administrators to manage players and teams while enabling team owners to participate in live bidding sessions.

The application provides a modern UI, secure authentication, real-time auction management, and efficient player allocation.

---

## ✨ Features

### 🔐 Authentication & Authorization
- User Registration
- Secure Login System
- Role-Based Access Control
- Protected Routes

### 👨‍💼 Admin Panel
- Manage Players
- Manage Teams
- Start/Stop Auctions
- Monitor Auction Activity
- View Auction Results

### 🏏 Player Management
- Add New Players
- Update Player Details
- Delete Players
- Categorize Players
- Track Sold/Unsold Status

### 💰 Auction System
- Real-Time Bidding
- Team Purse Management
- Highest Bid Tracking
- Automatic Player Assignment
- Auction History

### 📊 Dashboard
- Team Details
- Player Statistics
- Auction Summary
- Team Spending Overview

### 📱 Responsive Design
- Mobile Friendly
- Tablet Compatible
- Desktop Optimized

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Bootstrap / Tailwind CSS
- Context API

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JWT (JSON Web Token)
- Bcrypt

### Deployment
- Frontend: Vercel
- Backend: Render / Railway
- Database: MongoDB Atlas

---

## 📂 Project Structure

```bash
KPL-Auction/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.js
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/KPL-Auction.git
cd KPL-Auction
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

```bash
cd ../server
npm install
```

### Configure Environment Variables

Create a `.env` file inside the server folder:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

### Run Backend

```bash
npm start
```

### Run Frontend

```bash
npm start
```

---

## 📸 Screenshots

### Home Page
(Add Screenshot Here)

### Auction Dashboard
(Add Screenshot Here)

### Admin Panel
(Add Screenshot Here)

### Team Management
(Add Screenshot Here)

---

## 🔒 Security Features

- Password Encryption using Bcrypt
- JWT Authentication
- Protected APIs
- Role-Based Authorization
- Secure Environment Variables

---

## 🎯 Future Enhancements

- Live WebSocket Auction
- Real-Time Notifications
- Team Owner Dashboard
- Auction Analytics
- Player Performance Statistics
- Payment Integration
- Tournament Management Module

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the project
2. Create your feature branch

```bash
git checkout -b feature/NewFeature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to branch

```bash
git push origin feature/NewFeature
```

5. Open a Pull Request

---

## 👨‍💻 Author

**Partha Kar**

Full Stack Developer

- MERN Stack Developer
- Java & Spring Boot Enthusiast
- .NET Learner

---

## 📜 License

This project is licensed under the MIT License.
