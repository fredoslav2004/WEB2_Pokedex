import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getPokemonDetails, preloadPokemonDetails } from '../api/pokemonApi.js'
import {
  formatPokemonName,
  getPokemonArtwork,
  getPokemonColor,
} from '../pokemonVisuals.js'

function PokemonCard({ name }) {
  const location = useLocation()
  const [pokemon, setPokemon] = useState(null)

  useEffect(() => {
    let isCancelled = false

    getPokemonDetails(name).then((data) => {
      if (!isCancelled) {
        setPokemon(data)
      }
    })

    return () => {
      isCancelled = true
    }
  }, [name])

  function preloadDetails() {
    preloadPokemonDetails(name)
  }

  const color = getPokemonColor(pokemon)
  const artwork = getPokemonArtwork(pokemon)

  return (
    <Link
      className="pokemon-card"
      style={{ '--pokemon-color': color }}
      to={`/pokemon/${name}${location.search}`}
      onFocus={preloadDetails}
      onMouseEnter={preloadDetails}
    >
      {artwork && (
        <img
          className="pokemon-card__image"
          src={artwork}
          alt={formatPokemonName(name)}
        />
      )}
      <span className="pokemon-name">{formatPokemonName(name)}</span>
    </Link>
  )
}

export default PokemonCard
