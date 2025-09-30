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

### 2. Diagnostic Records Management

- **Display Records**: Show list of automotive diagnostic records
- **Multiple Engine Types**: Support for Theta, Atkinson, Gamma, and Smartstream engines
- **Pagination**: Server-side pagination
- **Search/Filter**: Search by VIN, engine type, date range
- **CRUD Operations**: Create, Read, Update, Delete diagnostic records
- **Download**: Export diagnostic data as CSV/PDF
- **Authorization**: Only authenticated users can access

---

## API Design

### Authentication Endpoints

#### POST `/api/auth/login`

**Request:**

```json
{
  "userId": "string",
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

### Diagnostic Record Endpoints

#### GET `/api/diagnostics?page=0&size=10&engineType=THETA&search=&startDate=&endDate=`

**Query Parameters:**
- `page`: Page number (default: 0)
- `size`: Page size (default: 10)
- `engineType`: Engine type filter (THETA, ATKINSON, GAMMA, SMARTSTREAM)
- `search`: Search by VIN or chassis number
- `startDate`: Filter by date range (ISO 8601 format)
- `endDate`: Filter by date range (ISO 8601 format)

**Response:**

```json
{
  "content": [
    {
      "id": "number",
      "vin": "string",
      "chassisNumber": "string",
      "engineType": "THETA | ATKINSON | GAMMA | SMARTSTREAM",
      "modelYear": "number",
      "vehicleModel": "string",
      "rpm": "number",
      "engineTemp": "number",
      "oilPressure": "number",
      "fuelPressure": "number",
      "intakeAirTemp": "number",
      "throttlePosition": "number",
      "maf": "number",
      "dtcCodes": ["string"],
      "mileage": "number",
      "diagnosticDate": "string",
      "technician": "string",
      "notes": "string",
      "status": "NORMAL | WARNING | CRITICAL",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "totalPages": "number",
  "totalElements": "number",
  "currentPage": "number"
}
```

#### GET `/api/diagnostics/{id}`

**Response:**

```json
{
  "id": "number",
  "vin": "string",
  "chassisNumber": "string",
  "engineType": "THETA | ATKINSON | GAMMA | SMARTSTREAM",
  "modelYear": "number",
  "vehicleModel": "string",
  "rpm": "number",
  "engineTemp": "number",
  "oilPressure": "number",
  "fuelPressure": "number",
  "intakeAirTemp": "number",
  "throttlePosition": "number",
  "maf": "number",
  "dtcCodes": ["string"],
  "mileage": "number",
  "diagnosticDate": "string",
  "technician": "string",
  "notes": "string",
  "status": "NORMAL | WARNING | CRITICAL",
  "createdAt": "string",
  "updatedAt": "string"
}
```

#### POST `/api/diagnostics`

**Request:**

```json
{
  "vin": "string",
  "chassisNumber": "string",
  "engineType": "THETA | ATKINSON | GAMMA | SMARTSTREAM",
  "modelYear": "number",
  "vehicleModel": "string",
  "rpm": "number",
  "engineTemp": "number",
  "oilPressure": "number",
  "fuelPressure": "number",
  "intakeAirTemp": "number",
  "throttlePosition": "number",
  "maf": "number",
  "dtcCodes": ["string"],
  "mileage": "number",
  "diagnosticDate": "string",
  "technician": "string",
  "notes": "string",
  "status": "NORMAL | WARNING | CRITICAL"
}
```

#### PUT `/api/diagnostics/{id}`

**Request:**

```json
{
  "vin": "string",
  "chassisNumber": "string",
  "engineType": "THETA | ATKINSON | GAMMA | SMARTSTREAM",
  "modelYear": "number",
  "vehicleModel": "string",
  "rpm": "number",
  "engineTemp": "number",
  "oilPressure": "number",
  "fuelPressure": "number",
  "intakeAirTemp": "number",
  "throttlePosition": "number",
  "maf": "number",
  "dtcCodes": ["string"],
  "mileage": "number",
  "diagnosticDate": "string",
  "technician": "string",
  "notes": "string",
  "status": "NORMAL | WARNING | CRITICAL"
}
```

#### DELETE `/api/diagnostics/{id}`

#### GET `/api/diagnostics/download?engineType=&startDate=&endDate=&format=csv`

**Query Parameters:**
- `engineType`: Filter by engine type
- `startDate`: Start date for export
- `endDate`: End date for export
- `format`: Export format (csv or pdf)

**Response:**
- File download (CSV or PDF)

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

### Diagnostic Records Table

```sql
CREATE TABLE diagnostic_records (
    id BIGSERIAL PRIMARY KEY,
    vin VARCHAR(17) NOT NULL,
    chassis_number VARCHAR(50) NOT NULL,
    engine_type VARCHAR(20) NOT NULL CHECK (engine_type IN ('THETA', 'ATKINSON', 'GAMMA', 'SMARTSTREAM')),
    model_year INT NOT NULL,
    vehicle_model VARCHAR(100) NOT NULL,
    rpm DECIMAL(10, 2),
    engine_temp DECIMAL(10, 2),
    oil_pressure DECIMAL(10, 2),
    fuel_pressure DECIMAL(10, 2),
    intake_air_temp DECIMAL(10, 2),
    throttle_position DECIMAL(10, 2),
    maf DECIMAL(10, 2),
    dtc_codes TEXT,
    mileage INT,
    diagnostic_date TIMESTAMP NOT NULL,
    technician VARCHAR(100),
    notes TEXT,
    status VARCHAR(20) CHECK (status IN ('NORMAL', 'WARNING', 'CRITICAL')),
    user_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_vin (vin),
    INDEX idx_engine_type (engine_type),
    INDEX idx_diagnostic_date (diagnostic_date),
    INDEX idx_status (status)
);
```

**Field Descriptions:**
- `vin`: Vehicle Identification Number (17 characters)
- `chassis_number`: Chassis/Frame number
- `engine_type`: Engine type (THETA, ATKINSON, GAMMA, SMARTSTREAM)
- `rpm`: Engine RPM at diagnostic time
- `engine_temp`: Engine temperature (°C)
- `oil_pressure`: Oil pressure (PSI)
- `fuel_pressure`: Fuel pressure (PSI)
- `intake_air_temp`: Intake air temperature (°C)
- `throttle_position`: Throttle position percentage (%)
- `maf`: Mass Air Flow (g/s)
- `dtc_codes`: Diagnostic Trouble Codes (JSON array stored as TEXT)
- `mileage`: Vehicle mileage (km)
- `status`: Diagnostic status

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
   - Implement DiagnosticRecord entity with engine type enum
   - Create CRUD operations with filtering by engine type
   - Add CSV/PDF download functionality
   - Add exception handling and validation

2. **Frontend Setup**

   - Initialize React project with Vite
   - Setup routing and layouts
   - Create API service layer
   - Implement authentication context
   - Build login page
   - Build diagnostic records list page with engine type tabs (Theta, Atkinson, Gamma, Smartstream)
   - Implement CRUD operations with detailed diagnostic form
   - Add search and date range filters
   - Add download button for CSV/PDF export
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
