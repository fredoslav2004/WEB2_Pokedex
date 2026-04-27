import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPokemonDetails } from '../api/pokemonApi.js'
import LoadingMessage from '../components/LoadingMessage.jsx'

function PokemonDetailsPage() {
  const { pokemonName } = useParams()
  const [pokemon, setPokemon] = useState(null)

  useEffect(() => {
    getPokemonDetails(pokemonName).then((data) => setPokemon(data))
  }, [pokemonName])

  if (!pokemon) {
    return <LoadingMessage />
  }

  return (
    <main>
      <Link to="/">Back</Link>

      <h1>{pokemon.name}</h1>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />

      <p>Height: {pokemon.height}</p>
      <p>Weight: {pokemon.weight}</p>
    </main>
  )
}

export default PokemonDetailsPage
