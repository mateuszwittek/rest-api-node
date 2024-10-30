# Rest API Node

This project is a RESTful API built with Node.js, Express.js, MongoDB, Jest, and TypeScript.

## Getting Started

### Prerequisites

1. Node.js (version 16.20.1 or higher)
2. MongoDB (version 4.4 or higher)

If you haven't installed MongoDB yet, please follow the official MongoDB installation guide for your operating system:

[MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

### Installation

To get started, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/mateuszwittek/rest-api-node.git
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment files:
   - Copy `.env.example` to `.env` for development
   - Copy `.env.test.example` to `.env.test` for testing
   - Modify the values according to your needs

## Running the Application

### Development

To run the application in development mode, use the following command:

```bash
npm run dev
```

It uses nodemon to watch for file changes and restart the server automatically.

### Production

Build the TypeScript files and start the server:

```bash
npm run build
npm run start
```

The app will run on the specified port.

## Endpoints

This API uses URL path versioning. The current version is v1. All endpoints should be prefixed with /api/v1.

### /people

- `GET api/v1/people`: Returns a list of all people from the database.
- `GET api/v1/people/:param`: Retrieves a specific person by email or username.
- `POST api/v1/people`: Adds a new person to the database.
- `PUT api/v1/people/:param`: Updates an existing person by email or username.
- `DELETE api/v1/people/:param`: Deletes a person by email or username.

Request body for POST/PUT:

```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com"
}
```

## Testing

This project uses [Jest](https://jestjs.io/) for unit and integration testing.

### Running Tests

You can find tests in the /test directory. To run them, use the following command:

```bash
npm run test
```

### Test Coverage

Tests cover:

- API Endpoints (CRUD operations)
- Data Validation
- Error Handling
- Rate Limiting
- Security Features
- Database Operations
- Input Sanitization

## License

This project is licensed under the ISC License.

## Contributing

Please open an issue or submit a pull request with your changes.
