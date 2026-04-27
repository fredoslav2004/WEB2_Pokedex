const pokemonListCache = new Map()
const pokemonDetailsCache = new Map()
const pokemonImageCache = new Map()
let cacheLevel = 1

async function fetchPokemonList(limit = 20, offset = 0) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
  return await response.json()
}

async function fetchPokemonDetails(name) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
  const pokemon = await response.json()
  preloadImage(pokemon.sprites.front_default)
  return pokemon
}

function preloadImage(src) {
  if (!src || pokemonImageCache.has(src)) {
    return
  }

  const image = new Image()
  image.src = src
  pokemonImageCache.set(src, image)
}

export function setPokemonCacheLevel(level) {
  cacheLevel = level

  if (cacheLevel === 0) {
    pokemonListCache.clear()
    pokemonDetailsCache.clear()
    pokemonImageCache.clear()
  }
}

export function getPokemonList(limit = 20, offset = 0) {
  if (cacheLevel === 0) {
    return fetchPokemonList(limit, offset)
  }

  const cacheKey = `${limit}-${offset}`

  if (!pokemonListCache.has(cacheKey)) {
    pokemonListCache.set(cacheKey, fetchPokemonList(limit, offset))
  }

  return pokemonListCache.get(cacheKey)
}

export function getPokemonDetails(name) {
  if (cacheLevel === 0) {
    return fetchPokemonDetails(name)
  }

  const cacheKey = name.toLowerCase()

  if (!pokemonDetailsCache.has(cacheKey)) {
    pokemonDetailsCache.set(cacheKey, fetchPokemonDetails(name))
  }

  return pokemonDetailsCache.get(cacheKey)
}

export function preloadPokemonList(limit = 20, offset = 0) {
  if (cacheLevel === 0) {
    return Promise.resolve()
  }

  return getPokemonList(limit, offset)
}

export function preloadPokemonDetails(name) {
  if (cacheLevel === 0) {
    return Promise.resolve()
  }

  return getPokemonDetails(name)
}

export function preloadPokemonDetailsForList(pokemon) {
  if (cacheLevel === 0) {
    return Promise.resolve()
  }

  return Promise.all(pokemon.map((item) => preloadPokemonDetails(item.name)))
}
