const { AuthenticationError } = require('apollo-server-core')
const { verify } = require('jsonwebtoken')

module.exports = (req) => {
	const bearerToken = req.headers['authorization']
	if (!bearerToken) throw new AuthenticationError('user not signed in')

	const token = bearerToken?.split(' ')[1]
	if (!token) throw new AuthenticationError('invalid token')

	const payload = verify(token, process.env.TOKEN_SECRET, (err, user) => {
		if (err) throw new Error(error)
		return user
	})

	return payload
}
