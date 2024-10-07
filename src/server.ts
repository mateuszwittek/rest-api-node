import config from './config/config.js';
import app from './app.js';

const { port } = config;
const server = (): void => {
  console.log(`Server is listening on port ${port}`);
};

app.listen(port, server);
