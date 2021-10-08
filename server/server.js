const fs = require('fs');
const http = require('http');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { execute, subscribe } = require('graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const cors = require('cors');
const express = require('express');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const port = 9000;
const jwtSecret = Buffer.from('xkMBdsE+P6242Z2dPV3RD91BPbLIko7t', 'base64');

const app = express();
app.use(cors(), express.json(), expressJwt({
  credentialsRequired: false,
  secret: jwtSecret,
  algorithms: ['HS256']
}));

app.post('/login', (req, res) => {
  const {name, password} = req.body;
  const user = db.users.get(name);
  if (!(user && user.password === password)) {
    res.sendStatus(401);
    return;
  }
  const token = jwt.sign({ sub: user.id }, jwtSecret);
  res.send({token});
});

const typeDefs = fs.readFileSync('./schema.graphql', { encoding: 'utf8' });
const resolvers = require('./resolvers');
const schema = makeExecutableSchema({ typeDefs, resolvers });

function createRequestContext({ req }) {
  if (req && req.user) {
    return { userId: req.user.sub };
  }
  return {};
}

function createConnectionContext({ accessToken }) {
  if (accessToken) {
    const decodedToken = jwt.verify(accessToken, jwtSecret);
    return { userId: decodedToken.sub };    
  }
  return {};
};

async function start() {
  const httpServer = http.createServer(app);
  const subscriptionServer = SubscriptionServer.create({
    schema, execute, subscribe, onConnect: createConnectionContext
  }, {
    server: httpServer, path: '/graphql'
  });

  const httpServerPlugin = ApolloServerPluginDrainHttpServer({ httpServer });
  const subscriptionServerPlugin = {
    async serverWillStart() {
      return {
        async drainServer() {
          subscriptionServer.close();
        }
      };
    }
  };
  const apolloServer = new ApolloServer({
    schema, context: createRequestContext,
    plugins: [httpServerPlugin, subscriptionServerPlugin]
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  httpServer.listen(port, () => console.log(`Server started on port ${port}`));
}

start();
