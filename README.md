# Enterprise NestJS CRUD API

> **Professional Grade REST API** built with [NestJS](https://nestjs.com/), designed for scalability, maintainability, and performance. This project demonstrates a production-ready architecture handling complex requirements like Role-Based Access Control (RBAC), Pagination, Filtering, and File Management.

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

---

## 🏛️ Architecture & Design Philosophy

This project adopts a **Modular Monolithic Architecture**, favoring strict separation of concerns and high cohesion. It is structured to easily scale from a simple MVP to a complex microservices-ready system.

### 1. Conceptual Layers

The application is strictly layered to enforce clean architecture principles:

- **Presentation Layer (Controllers)**: Handles HTTP requests, input validation (DTOs), and response formatting. It intentionally contains _no business logic_.
- **Application Layer (Services)**: The heart of the application. Contains all business rules, orchestration of data flow, and transaction management.
- **Domain Layer (Entities)**: Represents the core business objects and their relationships (e.g., `Product`, `Category`, `User`).
- **Infrastructure Layer (TypeORM/Config)**: Manages technical details like database connections, file storage, and third-party integrations, keeping the core logic agnostic of implementation details.

### 2. Request Lifecycle (The "NestJS Way")

A request flows through a unified pipeline ensuring security and consistency:

1.  **Request** hits the server.
2.  **Guards** (`JwtAuthGuard`, `RolesGuard`): Verify Identity (Who are you?) and Permissions (Can you do this?).
3.  **Pipes** (`ValidationPipe`): Validate and Transform input data (DTOs) before it reaches code.
4.  **Controller**: Routes the request to the appropriate service.
5.  **Service**: Executes business logic (e.g., "Create Product, deduct stock").
6.  **Interceptor** (`TransformInterceptor`): Wraps the response in a standard JSON envelope (`{ success: true, data: ... }`).
7.  **Filter** (`HttpExceptionFilter`): Catches any errors and formats them into a standard error response.

---

## 🛠️ Technology Stack & Decisions

### Core Framework

- **NestJS (Node.js)**: Chosen for its opinionated structure (Angular-inspired) which forces developers to use Dependency Injection and Decorators, leading to testable and decoupled code.
- **TypeScript**: Ensures type safety across the entire stack, reducing runtime errors significantly.

### Data Persistence

- **PostgreSQL**: Selected for its reliability and robust structured data handling.
- **TypeORM**: An advanced ORM providing a clean implementation of the Repository Pattern and Active Record Pattern (used here for flexibility). It handles complex relations (ManyToOne, OneToMany) seamlessly.

### Security

- **JWT (JSON Web Tokens)**: Stateless authentication mechanism ideal for scalable APIs.
- **Bcrypt**: Industry-standard hashing for password storage.
- **RBAC (Role-Based Access Control)**: Custom decorators (`@Roles`) to enforce permission levels (Admin vs User).

### Infrastructure

- **Docker & Docker Compose**: Containerizes the Application and Database, ensuring "It works on my machine" translates to production.

---

## 🧩 Project Structure & Modules

The codebase is organized by **Domain Modules**, not technical layers. This means all code related to "Products" is in one folder, making it easier to maintain.

```plaintext
src/
├── app.module.ts              # Root Module (Orchestrator)
├── main.ts                    # Entry Point
├── auth/                      # Authentication (Login, Register, JWT Strategy)
├── users/                     # User Management & Profile
├── products/                  # Product Catalog (Search, Filter, Pagination)
├── categories/                # Taxonomy & Hierarchy
├── files/                     # File Upload Handling (Local Storage)
└── common/                    # Shared Resources (Cross-Cutting Concerns)
    ├── decorators/            # Custom Decorators (@Roles, @CurrentUser)
    ├── filters/               # Global Exception Filters
    ├── interceptors/          # Response Transformers
    └── dto/                   # Shared Data Transfer Objects
```

---

## ✨ Key Technical Features

### User Management & Security

- **Authentication**: Secure login/register flow using JWT.
- **Authorization**: Granular control. Example: Public can _view_ products, but only Admins can _create/delete_ them.
- **Guards**: `JwtAuthGuard` automatically verifies tokens on protected routes.

### Enhanced Data Handling

- **Advanced Querying**:
  - **Pagination**: Server-side pagination to handle thousands of records efficiently.
  - **Filtering**: Dynamic filters (by category, price range) via query params.
  - **Sorting**: Flexible sorting fields (`sortBy` and `order`).
- **Search**: Full-text search capability integrated into the query builder.

### Robustness

- **Global Error Handling**: A centralized `HttpExceptionFilter` ensures clients always receive a consistent JSON error format, never a raw stack trace.
- **Response Wrapping**: The `TransformInterceptor` guarantees that every 200 OK response has the same shape: `{ success: true, data: { ... } }`.
- **Validation**: `class-validator` ensures no bad data enters the system.

---

## 🚀 Running the Project

This project relies on Docker for a consistent environment.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running.

### Quick Start (CLI)

1.  **Clone & Enter**:

    ```bash
    git clone <repo_url>
    cd crud-app
    ```

2.  **Start Application**:

    ```bash
    docker-compose up --build
    ```

    _This command builds the container, sets up the Postgres database, runs migrations, and starts the server on port 3000._

3.  **Access**:
    - **API**: `http://localhost:3000`
    - **Swagger Documentation**: `http://localhost:3000/api/docs`

---

## 📝 API Documentation

Complete API documentation acts as the single source of truth for frontend developers. It is auto-generated using **Swagger (OpenAPI)**.

Visit `http://localhost:3000/api/docs` to see:

- All available endpoints.
- Required parameters and request bodies (DTO schemas).
- Live testing interface ("Try it out").
