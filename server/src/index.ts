import { GraphQLServer } from "graphql-yoga";

import resolvers from "./graphql/resovlers";
import typeDefs from "./graphql/schema";
import constants from "./config/constants";
import "./config/db";

const options = {
  port: constants.PORT,
  endpoint: constants.ENDPOINT_URL,
  playground: constants.GRAPHQL_PLAYGROUND_URL
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(options, () =>
  console.log(
    `Server is running ⚡  on PORT: ${server.options.port}  💃  🎉  👌`
  )
);
