import { Link, useLocation } from 'react-router-dom'

function PokemonCard({ name }) {
  const location = useLocation()

  return <Link to={`/pokemon/${name}${location.search}`}>{name}</Link>
}

export default PokemonCard
