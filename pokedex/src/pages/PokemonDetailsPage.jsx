import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  Dumbbell,
  Gauge,
  HeartPulse,
  Ruler,
  Shield,
  Sparkles,
  Swords,
  Weight,
  Wind,
  Zap,
} from "lucide-react";
import { getPokemonDetails } from "../api/pokemonApi.js";
import LoadingMessage from "../components/LoadingMessage.jsx";
import {
  formatPokemonName,
  getPokemonArtwork,
  getPokemonColor,
} from "../pokemonVisuals.js";

const STAT_ICONS = {
  hp: HeartPulse,
  attack: Swords,
  defense: Shield,
  "special-attack": Sparkles,
  "special-defense": Activity,
  speed: Wind,
};

function formatStatName(name) {
  return name.replaceAll("-", " ");
}

function PokemonDetailsPage() {
  const { pokemonName } = useParams();
  const location = useLocation();
  const backLink = `/${location.search}`;
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    getPokemonDetails(pokemonName).then((data) => setPokemon(data));
  }, [pokemonName]);

  if (!pokemon || pokemon.name !== pokemonName) {
    return <LoadingMessage />;
  }

  const color = getPokemonColor(pokemon);
  const artwork = getPokemonArtwork(pokemon);
  const displayName = formatPokemonName(pokemon.name);
  const profile = [
    [Ruler, "Height", `${pokemon.height / 10} m`],
    [Weight, "Weight", `${pokemon.weight / 10} kg`],
    [Gauge, "Base XP", pokemon.base_experience],
  ];

  return (
    <main className="details-page" style={{ "--pokemon-color": color }}>
      <Link className="back-link" to={backLink}>
        <ArrowLeft size={18} aria-hidden="true" />
        Back
      </Link>

      <section className="pokemon-hero" aria-label={displayName}>
        <aside className="details-panel">
          <h2>Profile</h2>
          <div className="fact-list">
            {profile.map(([Icon, label, value]) => (
              <div className="fact-row" key={label}>
                <Icon size={21} aria-hidden="true" />
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          <h2>Types</h2>
          <div className="type-pills">
            {pokemon.types.map((item) => (
              <span key={item.type.name}>{item.type.name}</span>
            ))}
          </div>

          <h2>Abilities</h2>
          <div className="ability-list">
            {pokemon.abilities.map((item) => (
              <span key={item.ability.name}>
                <Zap size={16} aria-hidden="true" />
                {formatStatName(item.ability.name)}
              </span>
            ))}
          </div>
        </aside>

        <div className="pokemon-showcase">
          <img className="details-image" src={artwork} alt={displayName} />
          <h1 className="pokemon-name details-name">{displayName}</h1>
        </div>

        <aside className="details-panel">
          <h2>Stats</h2>
          <div className="stat-list">
            {pokemon.stats.map((item) => {
              const Icon = STAT_ICONS[item.stat.name] || Dumbbell;
              const meterWidth = `${(Math.min(item.base_stat, 160) / 160) * 100}%`;

              return (
                <div className="stat-row" key={item.stat.name}>
                  <Icon size={21} aria-hidden="true" />
                  <span>{formatStatName(item.stat.name)}</span>
                  <strong>{item.base_stat}</strong>
                  <div className="stat-meter" aria-hidden="true">
                    <span style={{ width: meterWidth }} />
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </section>
    </main>
  );
}

export default PokemonDetailsPage;
