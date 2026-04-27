import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import PokemonDetailsPage from './pages/PokemonDetailsPage.jsx'
import PokemonListPage from './pages/PokemonListPage.jsx'

function App() {
  return (
    <>
      <header>
        <Link to="/">Pokedex</Link>
      </header>

      <Routes>
        <Route path="/" element={<PokemonListPage />} />
        <Route path="/pokemon/:pokemonName" element={<PokemonDetailsPage />} />
      </Routes>
    </>
  )
}

export default App
