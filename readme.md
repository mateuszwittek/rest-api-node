# Rest API Node

This is a simple REST API built with Node.js, Express.js and MongoDB, providing endpoints for managing people data.

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

Then start the server:

```bash
npm start
```

App is running on specified port.

For development purposes, you can use nodemon to automatically restart the server when file changes are detected. To start the server with nodemon, use the following command:

```bash
npm run dev
```

This will start the server and watch for any changes in the src and config directories and the .env file.

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
