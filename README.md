# Vehicle Rental System
### A modular backend API for managing vehicle rentals.

### Live URL: https://vechile-rental-system.vercel.app/

## Features

- JWT Authentication (Signup, Signin)

- Role-based Authorization (Admin, Customer)

- User Management (view, update, delete users)

- Vehicle Management (add, update, delete, list vehicles)

- Booking System (create, cancel, return bookings)

- Automatic Price Calculation

- Vehicle Availability Tracking

- PostgreSQL Database (Neon)

- Modular Folder Structure

- Global Error Handling

- Vercel Deployment Ready


## Tech Stack

-   **Backend:** Node.js, Express.js, TypeScript
-   **Database:** PostgreSQL (Neon DB)
-   **Authentication:** JWT
-   **Tools:** Postman, Git, JWT Authentication
-   **Deployment:** Vercel

## Project Structure

    src/
     ├── config/
     ├── middlewares/
     ├── modules/
     │    ├── auth/
     │    ├── user/
     │    ├── vehicle/
     │    └── booking/
     ├── utils/
     ├── app.ts
     └── server.ts

##  Setup Instructions

### 1. Clone the repository

    git clone https://github.com/SyedRahadHossain/vehicle-rental-system.git
    cd project-folder

### 2. Install dependencies

    npm install

### 3. Create `.env` file

    PORT=5000
    CONNECTION_STR=neon-db-connection-url
    JWT_SECRET=secret-key

### 4. Run the project locally

    npm run dev
- Server runs on http://localhost:5000

- API prefix: /api/v1/
------------------------------------------------------------------------

### 5. API Usage with Postman

**1. Create Environment**

  - Add environment in Postman

  - Set base_url and token variables

**2. Sign In**

- Use /api/v1/auth/signin

- Token auto-saves in environment

**3. Access Other APIs**

- Use Authorization: Bearer {{token}}

--------------------------------------------------------------------


### 7. API Endpoints Overview

| Module   | Route                       | Method | Roles          |
| -------- | ----------------------------| ------ | -------------- |
| Auth     | /api/v1/auth/signin         | POST   | Public         |
| Auth     | /api/v1/auth/signup         | POST   | Public         |
| Vehicles | /api/v1/vehicles            | POST   | Admin          |
| Vehicles | /api/v1/vehicles            | GET    | Public         |
| Vehicles | /api/v1/vehicles/:vehicleId | GET    | Public         |
| Vehicles | /api/v1/vehicles/:vehicleId | PUT    | Admin          |
| Vehicles | /api/v1/vehicles/:vehicleId | DELETE | Admin          |
| Bookings | /api/v1/bookings            | POST   | Admin/Customer |
| Bookings | /api/v1/bookings            | GET    | Admin/Customer |
| Bookings | /api/v1/bookings/:bookingId | PUT    | Admin/Customer |
| Users    | /api/v1/users               | GET    | Admin          |
| Users    | /api/v1/users/:userId       | PUT    | Admin/Customer |
| Users    | /api/v1/users/:userId       | DELETE | Admin          |


--------------------------------------------------------------------


### 8. Running in Production

**1. Push code to GitHub**

**2. Deploy via Vercel:**

- Set environment variables in Project Settings

- Deploy

**3. API is ready to use**
