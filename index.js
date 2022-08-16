require('dotenv').config()
const express = require('express')
const path = require('path')
const { createServer } = require('http')
const { ApolloServer } = require('apollo-server-express')
const { connect } = require('mongoose')
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')

const startApp = async () => {
	const app = express()
	const port = process.env.PORT || 5000
	const httpServer = createServer(app)

	// database connection
	await connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
		.then(() => {
			console.log('connected to database')
		})
		.catch((error) => {
			console.error(error)
		})

	// configure cors
	if (process.env.NODE_ENV === 'development') app.use(require('cors')({ origin: '*' }))

	// apollo GraphQL server
	const apolloServer = new ApolloServer({
		typeDefs,
		resolvers,
		context: ({ req, res }) => {
			return { req, res }
		},
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	})
	await apolloServer.start()
	apolloServer.applyMiddleware({ app })

	// serving static files
	if (process.env.NODE_ENV === 'production') {
		app.use(express.static(path.join(__dirname, 'client', 'dist')))
		app.get('*', (_, res) => {
			res.sendFile(path.join(__dirname, 'client', 'dist/index.html'))
		})
	}

	await new Promise((resolve) => httpServer.listen({ port }, resolve))
	console.log(`listening to server on port ${port}`)
}

startApp()
