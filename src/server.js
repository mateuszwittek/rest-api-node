import config from './config/config.js';
import app from './app.js';

const { port } = config;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
