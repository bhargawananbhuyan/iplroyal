import { ApolloProvider } from '@apollo/client'
import { BrowserRouter } from 'react-router-dom'
import Routes from './Routes'
import client from './utils/apolloUtils'

const App = () => {
	return (
		<ApolloProvider client={client}>
			<BrowserRouter>
				<div className='app'>
					<header>This is the header</header>

					<main>
						<Routes />
					</main>

					<footer>This is the footer</footer>
				</div>
			</BrowserRouter>
		</ApolloProvider>
	)
}

export default App
