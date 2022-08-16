import React from 'react'
import { Routes as Switch, Route } from 'react-router-dom'
import Login from './views/Login'

const Routes: React.FC = () => {
	return (
		<Switch>
			<Route path='/signin' element={<Login />} />
		</Switch>
	)
}

export default Routes
