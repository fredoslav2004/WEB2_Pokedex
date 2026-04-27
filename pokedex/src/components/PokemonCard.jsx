import { Link, useLocation } from 'react-router-dom'
import { preloadPokemonDetails } from '../api/pokemonApi.js'

function PokemonCard({ name }) {
  const location = useLocation()

  function preloadDetails() {
    preloadPokemonDetails(name)
  }

  return (
    <Link
      to={`/pokemon/${name}${location.search}`}
      onFocus={preloadDetails}
      onMouseEnter={preloadDetails}
    >
      {name}
    </Link>
  )
}

export default PokemonCard
