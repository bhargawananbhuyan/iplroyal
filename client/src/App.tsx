import { ApolloProvider } from '@apollo/client'
import { BrowserRouter } from 'react-router-dom'
import Routes from './Routes'
import client from './utils/apolloUtils'

const App = () => {
	return (
		<ApolloProvider client={client}>
			<BrowserRouter>
				<div className='app'>
					<header>IPL Royal</header>

					<main>
						<Routes />
					</main>

					<footer>&copy; 2022, All rights reserved</footer>
				</div>
			</BrowserRouter>
		</ApolloProvider>
	)
}

export default App
