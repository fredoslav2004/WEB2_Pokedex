import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getPokemonList } from '../api/pokemonApi.js'
import PokemonCard from '../components/PokemonCard.jsx'

const PAGE_SIZE = 20

function PokemonListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const pageFromUrl = Number(searchParams.get('page') || 0)
  const [pokemon, setPokemon] = useState([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    getPokemonList(PAGE_SIZE, pageFromUrl * PAGE_SIZE).then((data) => {
      setPokemon(data.results)
      setTotal(data.count)
    })
  }, [pageFromUrl])

  const isFirstPage = pageFromUrl === 0
  const isLastPage = (pageFromUrl + 1) * PAGE_SIZE >= total
  const isLoading = pokemon.length === 0

  function goToPage(nextPage) {
    setSearchParams(nextPage === 0 ? {} : { page: nextPage.toString() })
  }

  return (
    <main>
      <div className="page-title">
        <h1>All Pokemon</h1>
        <p>
          Page {pageFromUrl + 1} of {Math.ceil(total / PAGE_SIZE) || 1}
        </p>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="pokemon-list">
          {pokemon.map((item) => (
            <li key={item.name}>
              <PokemonCard name={item.name} />
            </li>
          ))}
        </ul>
      )}

      <div className="pagination">
        <button disabled={isFirstPage} onClick={() => goToPage(pageFromUrl - 1)}>
          Previous
        </button>
        <button disabled={isLastPage} onClick={() => goToPage(pageFromUrl + 1)}>
          Next
        </button>
      </div>
    </main>
  )
}

export default PokemonListPage
