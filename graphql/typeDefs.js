const { gql } = require('apollo-server-express')

module.exports = gql`
	scalar Date

	type User {
		id: ID!
		fullName: String
		email: String!
		password: String!
		created_at: Date!
	}

	type Query {
		getUser: User!
	}

	type Mutation {
		createUser(email: String!, password: String!): User!
		signinUser(email: String!, password: String!): String!
	}
`
