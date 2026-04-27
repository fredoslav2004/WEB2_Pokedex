import { useEffect, useState } from 'react'
import { getPokemonList } from '../api/pokemonApi.js'
import PokemonCard from '../components/PokemonCard.jsx'

function PokemonListPage() {
  const [pokemon, setPokemon] = useState([])

  useEffect(() => {
    getPokemonList().then((data) => setPokemon(data.results))
  }, [])

  return (
    <main>
      <h1>All Pokemon</h1>

      <ul className="pokemon-list">
        {pokemon.map((item) => (
          <li key={item.name}>
            <PokemonCard name={item.name} />
          </li>
        ))}
      </ul>
    </main>
  )
}

export default PokemonListPage
