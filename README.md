# 🎬 Book My Movie - Movie Ticket Booking System

A full-stack movie ticket booking application built with **Spring Boot** (Backend) and **React** (Frontend), featuring a complete booking flow with city-based filtering, show selection, seat booking, and payment simulation.

## ✨ Features

- 🎥 **Movie Browsing** - Browse movies by city
- 🎭 **Theater & Show Selection** - View available theaters and show timings
- 💺 **Seat Selection** - Interactive seat grid (50 seats per show)
- 📱 **Payment Simulation** - Fake UPI scanner with QR code animation
- ✅ **Booking Confirmation** - Real-time seat updates in database
- 🔄 **Dynamic Updates** - Available seats decrease after booking

## 🛠️ Tech Stack

### Backend

- **Java 17**
- **Spring Boot 3.3.4**
- **Spring Data JPA** (Hibernate)
- **MySQL 8.0**
- **Maven**
- **Lombok**

### Frontend

- **React 18**
- **React Router** (Navigation)
- **Axios** (API calls)
- **CSS3** (Animations & Styling)

## 📋 Prerequisites

Before running this project, ensure you have:

- ☕ **Java 17** or higher
- 🐬 **MySQL 8.0** or higher
- 📦 **Node.js 16+** and npm
- 🔨 **Maven 3.9+**

## 🚀 Setup Instructions

### 1️⃣ Database Setup

1. Start MySQL server
2. Create database:

```sql
CREATE DATABASE Bookmymovies;
USE Bookmymovies;
```

3. Create tables:

```sql
-- Movies table
CREATE TABLE movies (
    movie_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30),
    genre VARCHAR(30),
    lang VARCHAR(30),
    duration INT
);

-- Theaters table
CREATE TABLE theaters (
    theater_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30),
    city VARCHAR(30)
);

-- Shows table
CREATE TABLE shows (
    show_id INT PRIMARY KEY AUTO_INCREMENT,
    movie_id INT,
    theater_id INT,
    timing VARCHAR(30),
    available_seats INT,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
    FOREIGN KEY (theater_id) REFERENCES theaters(theater_id)
);

-- Seats table
CREATE TABLE seat (
    seat_id INT PRIMARY KEY AUTO_INCREMENT,
    show_id INT,
    seat_number VARCHAR(30),
    is_booked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (show_id) REFERENCES shows(show_id)
);

-- Users table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30),
    email VARCHAR(30) UNIQUE,
    phone VARCHAR(30)
);

-- Bookings table
CREATE TABLE bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    show_id INT,
    seats_booked VARCHAR(255),
    total_price DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (show_id) REFERENCES shows(show_id)
);
```

4. Add sample data (insert movies, theaters, shows, and seats as needed)

### 2️⃣ Backend Setup

1. Navigate to backend folder:

```bash
cd backend
```

2. Update `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/Bookmymovies
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD_HERE
```

3. Build and run:

```bash
# Windows - Set Java 17
set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "PATH=%JAVA_HOME%\bin;%PATH%"

# Build
mvn clean install

# Run
mvn spring-boot:run
```

Backend will start on: **http://localhost:8080**

### 3️⃣ Frontend Setup

1. Navigate to frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm start
```

Frontend will start on: **http://localhost:3000**

## 🎯 How to Use

1. **Select City** - Choose a city from dropdown
2. **Browse Movies** - See movies available in that city
3. **Book Tickets** - Click on any movie
4. **Select Show** - Choose theater and timing
5. **Enter Details** - Provide name, email, phone
6. **Pick Seats** - Click on seats to select (A1-E10 grid)
7. **Payment** - Click "Pay with UPI" to see fake scanner
8. **Confirm** - Click "Done" to complete booking
9. **Success!** - Seats are booked in database

## 🗂️ Project Structure

```
Book_my_movie/
├── backend/
│   ├── src/main/java/com/bookmymovie/backend/
│   │   ├── controller/          # REST API endpoints
│   │   ├── model/                # JPA entities
│   │   ├── repository/           # Data access layer
│   │   └── BookMyMovieApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── Movies.js            # Home page
│   │   ├── Booking.js           # Booking flow
│   │   ├── api.js               # API calls
│   │   └── *.css                # Styling
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Movies

- `GET /api/movies` - Get all movies
- `GET /api/movies/{id}` - Get movie by ID

### Theaters

- `GET /api/theaters` - Get all theaters

### Shows

- `GET /api/shows?movieId={id}` - Get shows for a movie
- `GET /api/shows/{showId}/seats` - Get seats for a show

### Bookings

- `POST /api/bookings` - Create new booking
  - Request Body:
  ```json
  {
    "userInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890"
    },
    "showInfo": {
      "showId": 1
    },
    "seatIds": [1, 2, 3],
    "totalPrice": 750.0
  }
  ```

## 🚢 Deployment Options

### Backend (Spring Boot)

**Option 1: Heroku**

```bash
cd backend
heroku create your-app-name
heroku addons:create cleardb:ignite
# Set config vars
heroku config:set SPRING_DATASOURCE_URL=jdbc:mysql://...
heroku config:set SPRING_DATASOURCE_USERNAME=...
heroku config:set SPRING_DATASOURCE_PASSWORD=...
git push heroku main
```

**Option 2: AWS EC2**

1. Launch EC2 instance (Ubuntu)
2. Install Java 17 and MySQL
3. Upload JAR file:

```bash
mvn clean package
scp target/*.jar ubuntu@your-ip:/home/ubuntu/
ssh ubuntu@your-ip
java -jar book-my-movie-backend.jar
```

**Option 3: Railway**

- Connect GitHub repository
- Add MySQL database addon
- Deploy automatically

### Frontend (React)

**Option 1: Vercel (Recommended)**

```bash
npm install -g vercel
cd frontend
vercel
```

**Option 2: Netlify**

```bash
npm run build
# Drag & drop build folder to Netlify
```

**Option 3: GitHub Pages**

```bash
npm install -g gh-pages
npm run build
gh-pages -d build
```

### Full Stack with Docker

Create `docker-compose.yml`:

```yaml
version: "3.8"
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: Bookmymovies
      MYSQL_ROOT_PASSWORD: password
    ports:
      - "3306:3306"

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - mysql

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

Deploy:

```bash
docker-compose up -d
```

## 🐛 Troubleshooting

**Port 8080 already in use:**

```bash
# Windows
netstat -ano | findstr :8080
taskkill /F /PID <PID>
```

**MySQL Connection Error:**

- Check if MySQL is running
- Verify username/password in application.properties
- Ensure database `Bookmymovies` exists

**CORS Error:**

- Backend has @CrossOrigin enabled
- Check frontend API URL is `http://localhost:8080`

**Maven Build Fails:**

- Ensure Java 17 is being used (not Java 25)
- Run `mvn clean install` to clear cache

## 📝 License

MIT License - feel free to use for learning and projects!

## 👨‍💻 Author

**Mayank** - DevOps & Full Stack Development

---

⭐ **Star this repo** if you found it helpful!
