# Backend - Express.js API

## Getting Started

### Installation
```bash
npm install
```

### Environment Variables
Copy `.env.example` to `.env` and configure your environment variables:
```bash
cp .env.example .env
```

### Running the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Project Structure

```
backend/
├── src/
│   ├── config/       # Configuration files
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Custom middleware
│   ├── models/       # Data models
│   ├── routes/       # API routes
│   ├── utils/        # Utility functions
│   └── index.js      # Entry point
├── .env              # Environment variables
├── .env.example      # Example environment variables
└── package.json      # Dependencies and scripts
```

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint
