"use client";

import { useState } from "react";
import {
  GAME_ART,
  GAME_IMAGE_BASE,
  GAME_IMAGE_QUERY,
  GAMES,
  type Platform,
} from "../lib/peak-gaming/games-catalog";

function GameTile({ game }: { game: (typeof GAMES)["ps5"][number] }) {
  return (
    <figure
      className={`g ${game.tileClass}`}
      style={
        {
          "--c1": game.colorA,
          "--c2": game.colorB,
          "--gl": game.glow,
        } as React.CSSProperties
      }
    >
      <div className="art">
        <svg viewBox="0 0 100 100" aria-hidden="true" dangerouslySetInnerHTML={{ __html: GAME_ART[game.art] }} />
      </div>
      {game.image && (
        <img
          className="ph"
          src={`${GAME_IMAGE_BASE}${encodeURIComponent(game.image)}${GAME_IMAGE_QUERY}`}
          alt=""
          loading="lazy"
          onError={(e) => e.currentTarget.remove()}
        />
      )}
      <figcaption>{game.name}<i>{game.genre}</i></figcaption>
    </figure>
  );
}

export function GamesSection() {
  const [platform, setPlatform] = useState<Platform>("ps5");

  return (
    <section id="jocuri">
      <div className="wrap">
        <div className="head">
          <h2>Ce se <em>joacă</em> aici</h2>
          <p className="lede">Instalate și gata de pornit. Dacă vrei altceva pe PC, îl punem împreună la fața locului.</p>
        </div>
        <div className="tabs" role="tablist">
          <button
            className="tab"
            role="tab"
            aria-selected={platform === "ps5"}
            onClick={() => setPlatform("ps5")}
          >
            PlayStation 5
          </button>
          <button
            className="tab"
            role="tab"
            aria-selected={platform === "pc"}
            onClick={() => setPlatform("pc")}
          >
            PC
          </button>
        </div>
        <div className="mosaic">
          {GAMES[platform].map((game) => (
            <GameTile key={game.name + game.image} game={game} />
          ))}
        </div>
      </div>
    </section>
  );
}
