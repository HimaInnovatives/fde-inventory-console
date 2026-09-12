# FDE Inventory Console

A full-stack inventory management application built with **Spring Boot**, **PostgreSQL**, and **React**. Supports creating, viewing, updating, and deleting inventory items through both a REST API and a web interface.

## Features

- Full CRUD operations on inventory items (product name, category, quantity, price)
- REST API built with Spring Boot and Spring Data JPA
- PostgreSQL persistence
- React frontend with form validation, loading states, and a clean dark UI
- Unit and integration tests on the backend (JUnit + Mockito + MockMvc)
- Frontend tests with Vitest and React Testing Library

## Tech Stack

**Backend**
- Java 17
- Spring Boot 4.1
- Spring Data JPA / Hibernate
- PostgreSQL
- Maven

**Frontend**
- React 18
- Vite
- Vitest + React Testing Library

## Project Structure
fde-inventory-console/
├── inventory-system/ # Spring Boot backend
│ └── src/main/java/com/fde/inventory_system/
│ ├── InventorySystemApplication.java
│ ├── InventoryItem.java
│ ├── InventoryRepository.java
│ ├── InventoryService.java
│ └── InventoryController.java
└── inventory-frontend/ # React frontend
└── src/
├── App.jsx
└── App.css


## Getting Started

### Prerequisites

- Java 17 or newer
- Node.js 18 or newer
- PostgreSQL running locally on port 5432

### Backend Setup

1. Create a PostgreSQL database named `postgres` (or update `application.properties` with your own database name).
2. Set your database credentials as environment variables, or use the defaults in `application.properties`:

DB_USER=postgres
DB_PASSWORD=root

3. Navigate to the backend folder and run the app:
```bash
   cd inventory-system
   ./mvnw spring-boot:run
```
4. The API will be available at `http://localhost:8080/api/items`.

### Frontend Setup

1. Navigate to the frontend folder:
```bash
   cd inventory-frontend
```
2. Install dependencies:
```bash
   npm install
```
3. Start the development server:
```bash
   npm run dev
```
4. Open `http://localhost:5173` in your browser.

## API Endpoints

| Method | Endpoint            | Description             |
|--------|---------------------|--------------------------|
| GET    | `/api/items`         | Get all items            |
| GET    | `/api/items/{id}`     | Get a single item by ID  |
| POST   | `/api/items`          | Create a new item        |
| PUT    | `/api/items/{id}`     | Update an existing item  |
| DELETE | `/api/items/{id}`     | Delete an item           |

## Running Tests

**Backend:**
```bash
cd inventory-system
./mvnw test
```

**Frontend:**
```bash
cd inventory-frontend
npm run test
```

## Author

Hima Varshini Yaleru