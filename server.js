const SERVER_PORT = 5000;

const app = require('./app');
const logger = require('./src/middlewares/logger');

app.listen(SERVER_PORT, () => {
    logger.info(`Server is listening on port ${SERVER_PORT}`);
});