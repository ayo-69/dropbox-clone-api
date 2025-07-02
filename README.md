# Dropbox Clone

A simple Dropbox-like backend service built with Node.js, Express, MongoDB, and MinIO, containerized using Docker and orchestrated with Docker Compose.

## Features

- User registration and authentication (JWT)
- MongoDB for user data storage
- MinIO for S3-compatible object storage
- RESTful API endpoints
- Dockerized for easy deployment

## Project Structure

```
backend/
  index.js              # Express app entry point
  Dockerfile            # Backend Docker image
  package.json          # Node.js dependencies and scripts
  middleware/
    auth.js             # JWT authentication middleware
  models/
    User.js             # Mongoose user schema
  routes/
    auth.js             # Auth routes (register, login)
    test.js             # Protected test route
  utils/
    validation.js       # Joi validation schemas
docker-compose.yaml     # Multi-service orchestration
```

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

### Environment Variables

Create a `.env` file in `backend/` with:

```
MONGO_URI=mongodb://mongo:27017/mydatabase
JWT_SECRET=your_jwt_secret
PORT=3000
MINIO_BUCKET=your_bucket_name
MINIO_ENDPOINT=your_endpoint
MINIO_ACCESS_KEY=your_access_key
MINIO_SECRET_KEY=your_secret_key
MINIO_PORT=your_chosen_port
```

> Note: `.env` is gitignored.

### Running the Project

1. Build and start all services:

   ```powershell
   docker-compose up --build
   ```

2. The backend API will be available at `http://localhost:3000`.

### API Endpoints

#### Auth 
- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login and receive JWT
- `GET /secure` — Protected route (requires Bearer token)

#### Files
 - `POST /files` — Upload a new file
 - `GET /files` — Get all file metadata
 - `GET /files/:filename` — Download a file
 - `DELETE /files/:filename` — Delete a file

> Note: All files endpoints are protected

### Stopping Services

```powershell
docker-compose down
```

## Services

- **backend**: Node.js Express API
- **mongo**: MongoDB database
- **minio**: S3-compatible object storage

## License

MIT
