const express = require("express");
// Apollo server
const { ApolloServer } = require("apollo-server-express");

// GraphQL schema necessities
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// New instance of Apollo server with GraphQL schema
const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  // Once started, start listening
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

// Start server
startApolloServer();
