export function getPokemonList() {
  return fetch('https://pokeapi.co/api/v2/pokemon?limit=151').then((response) =>
    response.json(),
  )
}

export function getPokemonDetails(name) {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then((response) =>
    response.json(),
  )
}
