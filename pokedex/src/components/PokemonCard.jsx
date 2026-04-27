import { Link } from 'react-router-dom'

function PokemonCard({ name }) {
  return <Link to={`/pokemon/${name}`}>{name}</Link>
}

export default PokemonCard
