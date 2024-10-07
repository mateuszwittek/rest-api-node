# Rest API Node

This project is a RESTful API built with Node.js, Express.js, MongoDB and using TypeScript.

## Getting Started

### Prerequisites

1. Node.js (version 16.20.1 or higher)
2. MongoDB (version 4.4 or higher)

If you haven't installed MongoDB yet, please follow the official MongoDB installation guide for your operating system:

[MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

### Installation

To get started, follow these steps:

```bash
git clone https://github.com/mateuszwittek/rest-api-node.git
npm install
```

Set up your MongoDB database:

- Start your MongoDB server
- Create a new database for this project

Create a .env file in the root directory and add the following variables:

```text
PORT=YOUR_PORT
NODE_ENV=development
DATABASE_URI=YOUR_MONGODB_URI
```

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

The app will run on specified port.

## Endpoints

### /people

- `GET /people`: Returns a list of all people from the database.
- `GET /people/:id`: Retrieves a specific person by their ID.
- `POST /people`: Adds a new person to the database.

Request body for POST:

```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com"
}
```

## License

This project is licensed under the ISC License.

## Contributing

Please open an issue or submit a pull request with your changes.
