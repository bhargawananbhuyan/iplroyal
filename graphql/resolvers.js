const User = require('../models/User')
const { hashPassword, comparePassword } = require('../utils/passwordUtil')

const { GraphQLScalarType, Kind } = require('graphql')
const { AuthenticationError } = require('apollo-server-core')
const { sign } = require('jsonwebtoken')
const verifyUser = require('../utils/verifyUser')

module.exports = {
	Query: {
		getUser: async (_, __, { req }) => {
			const payload = verifyUser(req)
			if (payload._id) {
				try {
					const user = await User.findOne({ _id: payload._id })
					return user
				} catch (error) {
					throw new Error(error)
				}
			} else throw new AuthenticationError('user not logged in')
		},
	},

	Mutation: {
		createUser: async (_, args) => {
			const { email, password } = args
			try {
				const newUser = new User({ email, password: await hashPassword(password) })
				const savedUser = await newUser.save()
				return savedUser
			} catch (error) {
				throw new Error(error)
			}
		},

		signinUser: async (_, args) => {
			const { email, password } = args
			try {
				// check if user exists
				const existingUser = await User.findOne({ email })
				if (!existingUser) throw new AuthenticationError('user not registered')

				// check if password is correct
				if (!(await comparePassword(password, existingUser.password)))
					throw new AuthenticationError('incorrect password')

				// if all are okay, return JWT
				const token = sign({ _id: existingUser._id }, process.env.TOKEN_SECRET, {
					expiresIn: '1d',
				})

				return token
			} catch (error) {
				throw new Error(error)
			}
		},
	},

	Date: new GraphQLScalarType({
		name: 'Date',
		description: 'Date custom scalar type',
		serialize: (value) => value.getTime(),
		parseValue: (value) => new Date(value),
		parseLiteral: (ast) => {
			return ast.kind === Kind.INT ? new Date(parseInt(ast.value, 10)) : null
		},
	}),
}
