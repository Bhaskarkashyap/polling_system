# 🗳️ Real-Time Polling System Backend

This project is a scalable backend polling system built with **Node.js**, **Kafka**, **Zookeeper**, **PostgreSQL**, and **WebSockets**. It supports high-concurrency voting, fault-tolerant processing using Kafka, and real-time updates via WebSockets.

## ⚙️ Tech Stack

- **Backend**: Node.js (LTS)
- **Message Broker**: Kafka + Zookeeper
- **Database**: PostgreSQL
- **Real-time**: WebSockets
- **Containerization**: Docker & Docker Compose

---

## 📦 Setup Instructions

### 1. Clone the Repository

- **git clone https://github.com/your-username/realtime-polling-system.git**
- **cd realtime-polling-system**
- **npm install**

---

### 2. Create a .env file in the project root

- **PORT**= port
- **PG_USER**= username
- **PG_PASSWORD**= password
- **PG_DATABASE**= database_name
- **PG_HOST**= host
- **PG_PORT**= port
- **KAFKA_BROKER**= kafka:9092

---

### 3. Start all service with docker

Run

- **docker-compose up --build**

### 4. API Usage

✅ Create a Poll

POST /polls
Content-Type: application/json

{
"question": "What's your favorite language?",
"options": ["JavaScript", "Python", "Go", "Rust"]
}

✅ Vote on a Poll

POST /polls/:id/vote
Content-Type: application/json

{
"option": "Python"
}

✅ Get Poll Results

GET /polls/:id

GET /leaderboard

### 5. Run in public/index.html file for better view on browser
