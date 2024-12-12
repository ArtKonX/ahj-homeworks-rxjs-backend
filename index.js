const express = require('express');
const cors = require('cors');
const { faker } = require('@faker-js/faker');
const pino = require('pino');
const pinoPretty = require('pino-pretty');
const logger = pino(pinoPretty());

const createRandomMessage = () => {
  return {
    id: faker.string.uuid(),
    from: `${faker.person.firstName()}@${faker.person.lastName()}`,
    subject: Math.random() >= 0.5 ? `Hello from ${faker.person.firstName()}` : `Hello from ${faker.person.firstName()} ${faker.person.lastName()}!`,
    body: faker.lorem.lines(),
    received: Date.now()
  };
}

const generateRandomMessages = () => {
  return faker.helpers.multiple(createRandomMessage, {
    count: 1,
  })
}

const app = express();
app.use(cors());

app.get('/messages/unread', (request, response) => {
  const res = { status: 'ok', timestamp: Date.now(), messages: generateRandomMessages() };

  response.send(JSON.stringify(res));
});

const port = process.env.PORT || 7070;

const bootstrap = async () => {
  try {
    app.listen(port, () =>
      logger.info(`Server has been started on http://localhost:${port}`)
    );
  } catch (error) {
    console.error(error);
  }
};

bootstrap();