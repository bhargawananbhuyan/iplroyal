import { BrowserRouter } from 'react-router-dom'
import Routes from './Routes'

const App = () => {
	return (
		<BrowserRouter>
			<div className='app'>
				<header>This is the header</header>

				<main>
					<Routes />
				</main>

				<footer>This is the footer</footer>
			</div>
		</BrowserRouter>
	)
}

export default App
