# Football Field Management System - Backend

This is the backend for the Football Field Management System, built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- Field management
- Booking management
- Club application management
- Field status management

## Prerequisites

- Node.js (v14 or higher)
- MongoDB

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

\`\`\`bash
npm install
\`\`\`

4. Create a `.env` file based on `.env.example`
5. Start the server:

\`\`\`bash
npm start
\`\`\`

For development:

\`\`\`bash
npm run dev
\`\`\`

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-tokens` - Refresh auth tokens

### Users

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:userId` - Get user by ID
- `POST /api/users` - Create a new user (Admin only)
- `PUT /api/users/:userId` - Update user
- `DELETE /api/users/:userId` - Delete user (Admin only)

### Fields

- `GET /api/fields` - Get all fields
- `GET /api/fields/:fieldId` - Get field by ID
- `POST /api/fields` - Create a new field (Admin only)
- `PUT /api/fields/:fieldId` - Update field (Admin only)
- `DELETE /api/fields/:fieldId` - Delete field (Admin only)

### Bookings

- `GET /api/bookings` - Get all bookings (Admin/Manager)
- `GET /api/bookings/:bookingId` - Get booking by ID
- `GET /api/bookings/user/:userId` - Get bookings by user ID
- `POST /api/bookings` - Create a new booking
- `PUT /api/bookings/:bookingId` - Update booking
- `PUT /api/bookings/:bookingId/confirm` - Confirm booking (Admin/Manager)
- `PUT /api/bookings/:bookingId/cancel` - Cancel booking
- `DELETE /api/bookings/:bookingId` - Delete booking (Admin only)

### Club Applications

- `GET /api/club-applications` - Get all club applications (Admin/Manager)
- `GET /api/club-applications/:applicationId` - Get club application by ID
- `GET /api/club-applications/user/:userId` - Get club applications by user ID
- `POST /api/club-applications` - Create a new club application
- `PUT /api/club-applications/:applicationId` - Update club application
- `PUT /api/club-applications/:applicationId/approve` - Approve club application (Admin/Manager)
- `PUT /api/club-applications/:applicationId/reject` - Reject club application (Admin/Manager)
- `DELETE /api/club-applications/:applicationId` - Delete club application (Admin only)

### Field Status

- `GET /api/field-status/date/:date` - Get field status by date
- `GET /api/field-status/:fieldId/date/:date` - Get field status by field ID and date
- `PUT /api/field-status/:fieldId/date/:date` - Create or update field status (Admin/Manager)
- `PUT /api/field-status/:fieldId/date/:date/slot/:slotId` - Update time slot status (Admin/Manager)
