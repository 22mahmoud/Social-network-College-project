import { GraphQLServer } from "graphql-yoga";
import * as express from "express";

import { permissions, resolvers, typeDefs } from "./modules";
import constants from "./config/constants";
import "./config/db";

const options = {
  port: constants.PORT,
  endpoint: constants.ENDPOINT_URL,
  playground: constants.GRAPHQL_PLAYGROUND_URL
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: req => ({ ...req }),
  middlewares: [permissions]
});

server.express.use(express.static("public"));

server.start(options, () =>
  console.log(
    `Server is running ⚡  on PORT: ${server.options.port}  💃  🎉  👌`
  )
);
