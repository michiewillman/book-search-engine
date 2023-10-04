const { gql } = require("apollo-server-express");

const typeDefs = gql`
type User {
  _id: ID!
  username: String!
  email: String!
  password: String!
  bookCount: Int
  savedBooks: [Book]
}

  type Book {
    bookId: ID!
    authors: [String]
    description: String!
    image: String
    link: String
    title: String!
  }

  type Query {
    books: [Book]
    users: [User]
  }

  type Mutation {
  }
`;

module.exports = typeDefs;