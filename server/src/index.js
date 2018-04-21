import { GraphQLServer } from "graphql-yoga";

const typeDefs = `
    type Query {
        hi: String!
    }
`;

const resolvers = {
  Query: {
    hi: () => "Hi"
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() =>
  console.log(`Server is running on PORT: ${server.options.port}  💃  🎉  👌`)
);
