# Barber Management System

A full-stack platform for managing barber shop and salon operations. The application brings appointment booking, customer and team records, services, queues, payments, and operational dashboards together in a React web interface backed by a Node.js API.

> **Project status:** Active development. Review the configuration and verify integrations in your environment before using this application with live customers or payments.

## Contents

- [Overview](#overview)
- [Technology](#technology)
- [Repository layout](#repository-layout)
- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [Running the application](#running-the-application)
- [Available scripts](#available-scripts)
- [Integrations and services](#integrations-and-services)
- [Security and data handling](#security-and-data-handling)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

Barber Management System is organized as a frontend and backend application:

- **Frontend:** React single-page application served during development by Vite.
- **Backend:** Express API with MongoDB persistence, Redis-backed queue infrastructure, real-time Socket.IO communication, and integrations for payment processing, email, and image storage.

The backend source is organized into route handlers, controllers, services, models, middleware, validators, configuration, and utilities. The domain includes appointments, users, barbers, branches, chairs, services, queues, payments, audit logs, authentication, and dashboard features.

## Technology

| Area | Technologies |
| --- | --- |
| Web client | React, Vite, React Router, Tailwind CSS |
| API | Node.js (ES modules), Express |
| Data | MongoDB with Mongoose |
| Queue and background work | Redis and Bull |
| Real-time communication | Socket.IO |
| Payments | Stripe |
| Image storage | Cloudinary |
| Email | SMTP via Nodemailer |

## Repository layout

```text
.
├── backend/
│   ├── src/
│   │   ├── config/       # Database, Redis, Stripe, Cloudinary, logging
│   │   ├── controllers/  # HTTP request handlers
│   │   ├── middlewares/  # Authentication, validation, errors, rate limits
│   │   ├── models/       # MongoDB models
│   │   ├── queues/       # Queue setup
│   │   ├── routers/      # API route definitions
│   │   ├── services/     # Application and domain logic
│   │   ├── validators/   # Request validation
│   │   └── websockets/   # Socket.IO events
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/              # React application
│   ├── public/           # Static assets
│   ├── .env.example
│   └── package.json
└── README.md
```

## Requirements

- Node.js and npm compatible with the versions required by the installed dependencies.
- A MongoDB instance (local or hosted).
- A Redis instance for the queue and background-job features.
- Provider credentials for any integrations you intend to use: Stripe, Cloudinary, and an SMTP service.

Use supported, maintained versions of these tools and consult each dependency's official documentation for installation instructions.

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/<your-account>/<your-repository>.git
cd <your-repository>
```

### 2. Configure the backend

Copy `backend/.env.example` to `backend/.env`, then replace the example values with settings for your environment. Do not commit the resulting `.env` file.

PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

macOS/Linux:

```bash
cp backend/.env.example backend/.env
```

### 3. Configure the frontend

Copy `frontend/.env.example` to `frontend/.env` and adjust the API, Socket.IO, and Stripe publishable-key values for your local setup.

PowerShell:

```powershell
Copy-Item frontend/.env.example frontend/.env
```

macOS/Linux:

```bash
cp frontend/.env.example frontend/.env
```

### 4. Install dependencies

Install dependencies separately in each application directory:

```bash
cd backend
npm install
cd ../frontend
npm install
```

## Configuration

### Backend environment

`backend/.env.example` documents the expected settings. Configure values appropriate to your environment:

| Variable | Purpose |
| --- | --- |
| `PORT` | HTTP server port |
| `NODE_ENV` | Runtime environment, such as `development` |
| `TIMEZONE` | Application timezone used by scheduling logic |
| `MONGODB_URI` | MongoDB connection string |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` | Redis connection settings |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | Token signing secret and expiry |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Stripe API and webhook credentials |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Outgoing mail connection settings |
| `MAX_FUTURE_DAYS` | Booking horizon configuration |
| `MIN_ADVANCE_MINUTES` | Minimum booking lead time configuration |
| `NO_SHOW_GRACE_MINUTES` | No-show grace period configuration |
| `QUEUE_MAX_CAPACITY` | Queue capacity configuration |
| `SLOT_INTERVAL_MINUTES` | Scheduling slot interval configuration |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary image storage credentials |

Some features require external services to be available and correctly configured. Check the backend source when adapting the sample configuration for your deployment.

### Frontend environment

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL used by the frontend to reach the API |
| `VITE_SOCKET_URL` | Socket.IO server URL |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for browser-side payment flows |

Vite exposes variables prefixed with `VITE_` to client-side code. Never put server secrets (for example, a Stripe secret key or JWT secret) in frontend environment variables.

## Running the application

Start the backend in a terminal:

```bash
cd backend
npm run dev
```

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

Vite prints the local frontend URL when it starts. Ensure MongoDB, Redis, and any services needed by the features you are exercising are running and reachable. The API and Socket.IO URLs in `frontend/.env` must match your backend configuration.

## Available scripts

### Backend (`backend/`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start the backend development server with Nodemon and dotenv configuration |

### Frontend (`frontend/`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the frontend for production |
| `npm run preview` | Preview a production build locally |
| `npm run lint` | Run ESLint on the frontend source |

## Integrations and services

- **MongoDB:** Stores application records through Mongoose models.
- **Redis and Bull:** Support queue and background processing features.
- **Socket.IO:** Provides real-time client/server communication.
- **Stripe:** Supports payment-related flows. Configure webhook credentials and endpoints in the Stripe dashboard for the environment where the backend runs.
- **Cloudinary:** Stores profile images and related media.
- **SMTP:** Sends email through the configured mail provider.

Integration behavior depends on provider account configuration, network access, and valid credentials. Use provider test or sandbox credentials during development.

## Security and data handling

- Keep `.env` files, API keys, database credentials, signing secrets, webhook secrets, and SMTP passwords out of Git.
- Use strong, unique secrets and restrict production credentials to the services and environments that need them.
- Do not use real customer or payment data in development environments.
- Protect production databases and Redis instances with appropriate authentication, network restrictions, backups, and access controls.
- Rotate credentials immediately if they are accidentally exposed.
- Review authentication, authorization, validation, payment, and deployment settings before exposing the application publicly.

The root `.gitignore` excludes local environment files, dependency folders, build output, and logs. Keep it in place when contributing.

## Troubleshooting

**The backend cannot connect to MongoDB or Redis**

Confirm the services are running, that their host and port values are correct, and that any credentials in `backend/.env` are valid.

**The frontend cannot reach the API or connect to sockets**

Check `VITE_API_BASE_URL` and `VITE_SOCKET_URL`, then restart Vite after changing `.env` values. Ensure the backend is running and permits the frontend origin according to its CORS configuration.

**Payment, email, or image features fail**

Verify that credentials correspond to the intended provider environment, that required webhook configuration is set up, and that the backend can reach the provider.

**The browser does not reflect an environment change**

Stop and restart the Vite development server after editing frontend environment variables.

## Contributing

Contributions are welcome. A useful change should include a clear description of the problem and solution. Before opening a pull request:

1. Keep changes focused and follow the existing project structure.
2. Do not commit secrets, generated dependencies, logs, or local environment files.
3. Run the frontend lint and production build when relevant:

   ```bash
   cd frontend
   npm run lint
   npm run build
   ```

4. Describe any setup, configuration, or migration changes in the pull request.

## License

The backend package currently declares the ISC license. Confirm the intended license for the complete project and add a root-level `LICENSE` file before redistributing it. See `backend/package.json` for the backend package metadata.
