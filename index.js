const express = require('express')
const path = require('path')

const startApp = async () => {
	const app = express()
	const port = process.env.PORT || 5000

	app.use(express.static(path.join(__dirname, 'client', 'dist')))
	app.get('*', (_, res) => {
		res.sendFile(path.join(__dirname, 'client', 'dist/index.html'))
	})

	await new Promise((resolve) => app.listen(port, resolve))
	console.log(`listening to server on port ${port}`)
}

startApp()
