import React from 'react'
import { Routes as Switch, Route } from 'react-router-dom'
import Signin from './views/Signin'

const Routes: React.FC = () => {
	return (
		<Switch>
			<Route path='/signin' element={<Signin />} />
		</Switch>
	)
}

export default Routes
