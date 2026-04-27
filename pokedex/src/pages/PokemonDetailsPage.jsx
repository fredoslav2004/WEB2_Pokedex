import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getPokemonDetails } from '../api/pokemonApi.js'
import LoadingMessage from '../components/LoadingMessage.jsx'

function PokemonDetailsPage() {
  const { pokemonName } = useParams()
  const location = useLocation()
  const backLink = `/${location.search}`
  const [pokemon, setPokemon] = useState(null)

  useEffect(() => {
    getPokemonDetails(pokemonName).then((data) => setPokemon(data))
  }, [pokemonName])

  if (!pokemon || pokemon.name !== pokemonName) {
    return <LoadingMessage />
  }

  return (
    <main>
      <Link to={backLink}>Back</Link>

      <h1>{pokemon.name}</h1>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />

      <section className="details-grid">
        <div>
          <h2>Profile</h2>
          <p>Height: {pokemon.height}</p>
          <p>Weight: {pokemon.weight}</p>
          <p>
            Types:{' '}
            {pokemon.types.map((item) => item.type.name).join(', ')}
          </p>
        </div>

        <div>
          <h2>Abilities</h2>
          <ul>
            {pokemon.abilities.map((item) => (
              <li key={item.ability.name}>{item.ability.name}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Stats</h2>
          <ul>
            {pokemon.stats.map((item) => (
              <li key={item.stat.name}>
                {item.stat.name}: {item.base_stat}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}

export default PokemonDetailsPage
