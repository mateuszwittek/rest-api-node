# Rest API Node

This is a simple REST API built with Node.js and Express, providing endpoints for managing people data.

## Getting Started

To get started, follow these steps:

```bash
git clone https://github.com/mateuszwittek/rest-api-node.git
npm install
npm start`
```

App is running on port 3001.

## Endpoints

### /people

- `GET /people`: Returns a list of all people from a JSON file.
- `GET /people/:id`: Retrieves a specific person by their ID.
- `POST /people`: Adds a new person to the list.

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
