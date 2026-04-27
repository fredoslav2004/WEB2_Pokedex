import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getPokemonList,
  preloadPokemonDetailsForList,
  preloadPokemonList,
  setPokemonCacheLevel,
} from "../api/pokemonApi.js";
import PokemonCard from "../components/PokemonCard.jsx";

const PAGE_SIZE = 20;
const PREFETCH_DISTANCE = 2;
const MIN_CACHE_LEVEL = 0;
const DEFAULT_CACHE_LEVEL = 1;
const MIN_PREFETCH_CACHE_LEVEL = 1;
const CURRENT_PAGE_CACHE_LEVEL = 2;
const FULL_CACHE_LEVEL = 3;
const MIN_BACKGROUND_CACHE_LEVEL = 1;
const FAST_LIST_LOAD_MS = 700;
const SLOW_LIST_LOAD_MS = 2000;
const FAST_DETAILS_PRELOAD_MS = 1200;
const SLOW_DETAILS_PRELOAD_MS = 3000;
setPokemonCacheLevel(DEFAULT_CACHE_LEVEL);

function increaseCacheLevel(level) {
  return Math.min(level + 1, FULL_CACHE_LEVEL);
}

function decreaseCacheLevel(level, minimumLevel = MIN_CACHE_LEVEL) {
  return Math.max(level - 1, minimumLevel);
}

function updateCacheLevel(setCacheLevel, getNextLevel, reason) {
  setCacheLevel((currentLevel) => {
    const nextLevel = getNextLevel(currentLevel);

    if (nextLevel !== currentLevel) {
      console.log(`[cache] Level ${currentLevel} -> ${nextLevel}: ${reason}`);
    }

    return nextLevel;
  });
}

function PokemonListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedPage = Number(searchParams.get("page") || 0);
  const pageFromUrl =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 0;
  const [pokemon, setPokemon] = useState([]);
  const [total, setTotal] = useState(0);
  const [cacheLevel, setCacheLevel] = useState(DEFAULT_CACHE_LEVEL);

  useEffect(() => {
    const startTime = performance.now();

    getPokemonList(PAGE_SIZE, pageFromUrl * PAGE_SIZE)
      .then((data) => {
        const loadTime = performance.now() - startTime;

        setPokemon(data.results);
        setTotal(data.count);
        console.log(
          `[perf] List page ${pageFromUrl + 1} loaded in ${Math.round(loadTime)}ms`,
        );

        if (loadTime < FAST_LIST_LOAD_MS) {
          updateCacheLevel(
            setCacheLevel,
            increaseCacheLevel,
            `list page loaded quickly (${Math.round(loadTime)}ms)`,
          );
        }

        if (loadTime > SLOW_LIST_LOAD_MS) {
          updateCacheLevel(
            setCacheLevel,
            decreaseCacheLevel,
            `list page loaded slowly (${Math.round(loadTime)}ms)`,
          );
        }
      })
      .catch(() => {
        updateCacheLevel(
          setCacheLevel,
          decreaseCacheLevel,
          "list page failed to load",
        );
      });
  }, [pageFromUrl]);

  useEffect(() => {
    setPokemonCacheLevel(cacheLevel);
  }, [cacheLevel]);

  useEffect(() => {
    if (cacheLevel < MIN_PREFETCH_CACHE_LEVEL) {
      return;
    }

    for (let distance = 1; distance <= PREFETCH_DISTANCE; distance += 1) {
      const previousPage = pageFromUrl - distance;
      const nextPage = pageFromUrl + distance;

      if (previousPage >= 0) {
        preloadPokemonList(PAGE_SIZE, previousPage * PAGE_SIZE);
      }

      if (total === 0 || nextPage * PAGE_SIZE < total) {
        preloadPokemonList(PAGE_SIZE, nextPage * PAGE_SIZE);
      }
    }
  }, [cacheLevel, pageFromUrl, total]);

  useEffect(() => {
    if (cacheLevel < CURRENT_PAGE_CACHE_LEVEL || pokemon.length === 0) {
      return;
    }

    const startTime = performance.now();

    preloadPokemonDetailsForList(pokemon)
      .then(() => {
        const loadTime = performance.now() - startTime;
        console.log(
          `[perf] Current page details/images preloaded in ${Math.round(loadTime)}ms`,
        );

        if (loadTime < FAST_DETAILS_PRELOAD_MS) {
          updateCacheLevel(
            setCacheLevel,
            increaseCacheLevel,
            `current page details/images preloaded quickly (${Math.round(loadTime)}ms)`,
          );
        }

        if (loadTime > SLOW_DETAILS_PRELOAD_MS) {
          updateCacheLevel(
            setCacheLevel,
            (level) => decreaseCacheLevel(level, MIN_BACKGROUND_CACHE_LEVEL),
            `current page details/images preloaded slowly (${Math.round(loadTime)}ms)`,
          );
        }
      })
      .catch(() => {
        updateCacheLevel(
          setCacheLevel,
          (level) => decreaseCacheLevel(level, MIN_BACKGROUND_CACHE_LEVEL),
          "current page details/images failed to preload",
        );
      });
  }, [cacheLevel, pokemon]);

  useEffect(() => {
    if (cacheLevel < FULL_CACHE_LEVEL || total === 0) {
      return;
    }

    let isCancelled = false;
    const pageCount = Math.ceil(total / PAGE_SIZE);

    async function preloadAllPages() {
      try {
        await preloadPokemonDetailsForList(pokemon);

        for (let distance = 1; distance < pageCount; distance += 1) {
          const pages = [pageFromUrl + distance, pageFromUrl - distance].filter(
            (page) => page >= 0 && page < pageCount,
          );

          for (const page of pages) {
            if (isCancelled) {
              return;
            }

            const data = await preloadPokemonList(PAGE_SIZE, page * PAGE_SIZE);
            await preloadPokemonDetailsForList(data.results);
          }
        }
      } catch {
        updateCacheLevel(
          setCacheLevel,
          (level) => decreaseCacheLevel(level, MIN_BACKGROUND_CACHE_LEVEL),
          "full precaching hit a network problem",
        );
      }
    }

    preloadAllPages();

    return () => {
      isCancelled = true;
    };
  }, [cacheLevel, pageFromUrl, pokemon, total]);

  const isFirstPage = pageFromUrl === 0;
  const isLastPage = (pageFromUrl + 1) * PAGE_SIZE >= total;
  const isLoading = pokemon.length === 0;

  function goToPage(nextPage) {
    setSearchParams(nextPage === 0 ? {} : { page: nextPage.toString() });
  }

  return (
    <main className="list-page">
      <div className="page-title">
        <h1>Pokemon List</h1>
        <div>
          <p>
            Page {pageFromUrl + 1} of {Math.ceil(total / PAGE_SIZE) || 1}
          </p>
          <div className="pagination">
            <button
              disabled={isFirstPage}
              onClick={() => goToPage(pageFromUrl - 1)}
            >
              Previous
            </button>
            <button
              disabled={isLastPage}
              onClick={() => goToPage(pageFromUrl + 1)}
            >
              Next
            </button>
          </div>
        </div>
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
    </main>
  );
}

export default PokemonListPage;
