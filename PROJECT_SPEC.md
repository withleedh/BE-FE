# Project Specification

## Overview

Full-stack application with Spring Boot backend and React frontend, implementing authentication and list management features.

---

## Tech Stack

### Backend

- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Security**: Spring Security + JWT
- **Database**: H2 (dev) / PostgreSQL (production)
- **ORM**: Spring Data JPA
- **Build Tool**: Gradle
- **Architecture**: Layered (Controller → Service → Repository)

### Frontend

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux
- **Routing**: React Router v6
- **UI Framework**: Tailwind CSS
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Validation**: Zod

---

## Project Structure

```
gogo/
├── backend/
│   └── src/
│       └── main/
│           ├── java/com/example/gogo/
│           │   ├── config/          # Security, CORS config
│           │   ├── controller/      # REST controllers
│           │   ├── service/         # Business logic
│           │   ├── repository/      # Data access
│           │   ├── entity/          # JPA entities
│           │   ├── dto/             # Data transfer objects
│           │   ├── security/        # JWT, UserDetails
│           │   └── exception/       # Custom exceptions
│           └── resources/
│               └── application.yml
└── frontend/
    └── src/
        ├── components/          # Reusable components
        ├── pages/              # Page components
        ├── hooks/              # Custom hooks
        ├── services/           # API services
        ├── types/              # TypeScript types
        ├── contexts/           # React contexts
        └── utils/              # Utilities
```

---

## Features

### 1. Authentication (Login)

- **User Login**: Email/username + password
- **Access Token**: Short-lived JWT (15 minutes) for API requests
- **Refresh Token**: Long-lived token (7 days) stored in httpOnly cookie
- **Token Refresh**: Auto-refresh access token when expired
- **Auto Logout**: On refresh token expiration
- **Protected Routes**: Redirect to login if not authenticated

### 2. List View

- **Display Items**: Show list of items (e.g., tasks, products, posts)
- **Pagination**: Server-side pagination
- **Search/Filter**: Basic search functionality
- **CRUD Operations**: Create, Read, Update, Delete items
- **Authorization**: Only authenticated users can access

---

## API Design

### Authentication Endpoints

#### POST `/api/auth/login`

**Request:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string"
  }
}
```

**Note**: `refreshToken` will also be set in httpOnly cookie

#### POST `/api/auth/refresh`

**Request:**

```json
{
  "refreshToken": "string"
}
```

**Response:**

```json
{
  "accessToken": "string",
  "refreshToken": "string"
}
```

#### POST `/api/auth/logout`

**Request:**
- Requires Authorization header with Bearer token

**Response:**

```json
{
  "message": "Logged out successfully"
}
```

#### POST `/api/auth/register`

**Request:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "message": "User registered successfully"
}
```

### Item Endpoints

#### GET `/api/items?page=0&size=10&search=`

**Response:**

```json
{
  "content": [
    {
      "id": "number",
      "title": "string",
      "description": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "totalPages": "number",
  "totalElements": "number",
  "currentPage": "number"
}
```

#### POST `/api/items`

**Request:**

```json
{
  "title": "string",
  "description": "string"
}
```

#### PUT `/api/items/{id}`

**Request:**

```json
{
  "title": "string",
  "description": "string"
}
```

#### DELETE `/api/items/{id}`

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Items Table

```sql
CREATE TABLE items (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    user_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Refresh Tokens Table

```sql
CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    user_id BIGINT REFERENCES users(id),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN DEFAULT FALSE
);
```

---

## Best Practices

### Backend

- ✅ Use DTOs for request/response to avoid exposing entities
- ✅ Implement global exception handling with @ControllerAdvice
- ✅ Use BCrypt for password hashing
- ✅ Implement proper CORS configuration
- ✅ Add request validation with @Valid and Bean Validation
- ✅ Use constructor injection for dependencies
- ✅ Separate business logic from controllers
- ✅ Add proper logging (SLF4J)
- ✅ Use environment-specific configuration files

### Frontend

- ✅ Use TypeScript for type safety
- ✅ Implement custom hooks for reusable logic
- ✅ Use React Query for server state management
- ✅ Implement proper error boundaries
- ✅ Add loading and error states
- ✅ Use environment variables for API URLs
- ✅ Implement route guards for protected pages
- ✅ Add form validation
- ✅ Use interceptors for adding JWT to requests
- ✅ Implement responsive design

---

## Development Order

1. **Backend Setup**

   - Initialize Spring Boot project
   - Configure database and security
   - Implement User entity and repository
   - Create authentication service with JWT
   - Build auth controllers and endpoints
   - Implement Item entity and CRUD operations
   - Add exception handling and validation

2. **Frontend Setup**

   - Initialize React project with Vite
   - Setup routing and layouts
   - Create API service layer
   - Implement authentication context
   - Build login page
   - Build list page with CRUD operations
   - Add error handling and loading states

3. **Integration & Testing**
   - Test API endpoints
   - Test frontend flows
   - Fix CORS issues
   - End-to-end testing

---

## Environment Configuration

### Backend (`application.yml`)

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true

jwt:
  secret: your-secret-key
  access-token-expiration: 900000 # 15 minutes
  refresh-token-expiration: 604800000 # 7 days
```

### Frontend (`.env`)

```
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## Running the Application

### Backend

```bash
cd backend
./gradlew bootRun
# Runs on http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```
