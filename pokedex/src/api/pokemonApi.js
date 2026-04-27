export function getPokemonList(limit = 20, offset = 0) {
  return fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
  ).then((response) => response.json())
}

export function getPokemonDetails(name) {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then((response) =>
    response.json(),
  )
}
