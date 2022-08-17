import React, { lazy, Suspense } from 'react'
import { Routes as Switch, Route } from 'react-router-dom'
import ProtectedView from './components/ProtectedView'

const Homepage = lazy(() => import('./views/Homepage'))
const Signin = lazy(() => import('./views/Signin'))

const Routes: React.FC = () => {
	return (
		<Suspense fallback={<div>loading...</div>}>
			<Switch>
				<Route
					path='/'
					element={
						<ProtectedView>
							<Homepage />
						</ProtectedView>
					}
				/>
				<Route path='/signin' element={<Signin />} />
			</Switch>
		</Suspense>
	)
}

export default Routes
