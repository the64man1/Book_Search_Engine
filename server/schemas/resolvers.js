const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (contex.user) {
                const foundUser = await User.findOne({ _id: context.user_id });
    
                return foundUser;
            }
            throw new AuthenticationError('Please log in');
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { body }) => {
            const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });

            if (!user) {
                throw new AuthenticationError('User not found')
            }

            const correctPw = await user.isCorrectPassword(body.password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect password')
            }

            const token = signToken(user)
            
            return ({ token, user });
        },
        saveBook: async (parent, { body }, context) => {
            if(context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: body } },
                    { new: true, runValidators: true }
                  );
                return updatedUser;
            }

            throw new AuthenticationError('You must be logged in')
        },
        removeBook: async (parent, { bookId }, context) => {
            if(context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                );
                return updatedUser;
            }

            throw new AuthenticationError('You must be logged in');
        }
    }
}

module.exports = resolvers;