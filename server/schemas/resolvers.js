const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const data = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );

        return data;
      }

      throw new AuthenticationError("Please log in.");
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError(
          "Login email or password is incorrect. Try again."
        );
      }

      const pass = await user.isCorrectPassword(password);

      if (!pass) {
        throw new AuthenticationError(
          "Login email or password is incorrect. Try again."
        );
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const user = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );

        return user;
      }

      throw new AuthenticationError("Please log in or sign up.");
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        return user;
      }

      throw new AuthenticationError("Please log in or sign up.");
    },
  },
};

module.exports = resolvers;
