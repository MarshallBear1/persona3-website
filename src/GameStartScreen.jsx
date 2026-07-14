import { useCallback, useEffect, useState } from "react";
import VideoBackground from "./VideoBackground";
import engineerLoop from "./assets/player-engineer-loop.webm";
import engineerPoster from "./assets/player-engineer-poster.webp";

const OPTIONS = [
  { id: "new", label: "NEW GAME", subtitle: "START THE GUIDED PLAYER SETUP" },
  { id: "load", label: "LOAD GAME", subtitle: "OPEN THE EVENT MENU" },
];

export default function GameStartScreen({ onNewGame, onLoadGame }) {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);

  const choose = useCallback((id) => {
    if (id === "new") onNewGame?.();
    if (id === "load") onLoadGame?.();
  }, [onLoadGame, onNewGame]);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 120);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        setActive((index) => (index === 0 ? 1 : 0));
      }
      if (event.key === "Enter") choose(OPTIONS[active].id);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, choose]);

  return (
    <div id="menu-screen" className="game-start-screen">
      <VideoBackground />
      <style>{`
        .game-start-screen::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(90deg, rgba(0, 4, 28, 0.2), rgba(0, 4, 28, 0.72) 72%, rgba(0, 4, 28, 0.94));
          pointer-events: none;
        }

        .game-start-shell {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: grid;
          grid-template-columns: 1fr minmax(440px, 39vw);
          align-items: center;
          pointer-events: none;
        }

        .game-start-brand {
          position: relative;
          z-index: 3;
          align-self: end;
          padding: 0 0 7vh 5vw;
          opacity: 0;
          transform: translateX(-50px);
          transition: opacity 500ms ease, transform 650ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .game-start-shell.mounted .game-start-brand {
          opacity: 1;
          transform: translateX(0);
        }

        .game-start-kicker {
          display: block;
          color: #8ef5ff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          letter-spacing: 5px;
        }

        .game-start-brand h1 {
          max-width: 760px;
          margin: 7px 0 0;
          color: #ffffff;
          font-family: 'Anton', sans-serif;
          font-size: clamp(58px, 7.2vw, 112px);
          font-style: italic;
          line-height: 0.84;
          letter-spacing: -2px;
          text-shadow: 11px 11px 0 rgba(5, 13, 57, 0.85);
        }

        .game-start-title-line {
          display: block;
          white-space: nowrap;
        }

        .game-start-title-line.hackathon {
          color: #ff2a2a;
        }

        .game-start-engineer {
          position: absolute;
          left: 35vw;
          bottom: -2vh;
          z-index: 2;
          height: min(82vh, 760px);
          pointer-events: none;
          opacity: 0;
          transform: translateX(-50%) translateY(32px) scale(0.96);
          transition: opacity 650ms ease 180ms, transform 800ms cubic-bezier(0.22, 1, 0.36, 1) 180ms;
        }

        .game-start-shell.mounted .game-start-engineer {
          opacity: 0.96;
          transform: translateX(-50%) translateY(0) scale(1);
        }

        #menu-screen .game-start-engineer-video {
          position: relative;
          inset: auto;
          width: auto;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(16px 12px 0 rgba(7, 20, 63, 0.82)) drop-shadow(0 0 20px rgba(142, 245, 255, 0.2));
        }

        .game-start-panel {
          position: relative;
          align-self: stretch;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 18px;
          padding: 9vh 4vw;
          background: linear-gradient(180deg, rgba(7, 20, 63, 0.88), rgba(5, 13, 57, 0.97));
          border-left: 2px solid rgba(142, 245, 255, 0.4);
          pointer-events: all;
          opacity: 0;
          transform: translateX(70px);
          transition: opacity 480ms ease 120ms, transform 620ms cubic-bezier(0.22, 1, 0.36, 1) 120ms;
        }

        .game-start-shell.mounted .game-start-panel {
          opacity: 1;
          transform: translateX(0);
        }

        .game-start-panel-label {
          margin-bottom: 10px;
          color: rgba(255, 255, 255, 0.56);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          letter-spacing: 4px;
        }

        .game-start-option {
          position: relative;
          min-height: 126px;
          padding: 20px 26px;
          border: 1px solid rgba(142, 245, 255, 0.24);
          color: #a7a7a7;
          background: rgba(8, 18, 72, 0.94);
          text-align: left;
          clip-path: polygon(0 0, 100% 0, calc(100% - 20px) 100%, 0 100%);
          transition: transform 180ms ease, color 180ms ease, background 180ms ease;
        }

        .game-start-option.active {
          color: #07143f;
          background: linear-gradient(90deg, #8ef5ff, #ffffff);
          box-shadow: 12px 12px 0 #ff2a2a;
          transform: translateX(-12px);
        }

        .game-start-option strong {
          display: block;
          font-family: 'Anton', sans-serif;
          font-size: clamp(42px, 4.5vw, 70px);
          font-style: italic;
          line-height: 0.9;
        }

        .game-start-option span {
          display: block;
          margin-top: 11px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 14px;
          letter-spacing: 2px;
        }

        .game-start-version {
          position: absolute;
          right: 24px;
          bottom: 20px;
          color: rgba(255, 255, 255, 0.34);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 12px;
          letter-spacing: 2px;
        }

        @media (max-width: 820px) {
          .game-start-screen::after {
            background: linear-gradient(180deg, rgba(0, 4, 28, 0.28), rgba(0, 4, 28, 0.76) 52%, rgba(0, 4, 28, 0.95));
          }

          .game-start-shell {
            grid-template-columns: 1fr;
            align-items: end;
            padding: max(18px, env(safe-area-inset-top)) 14px max(22px, env(safe-area-inset-bottom));
          }

          .game-start-brand { display: none; }

          .game-start-engineer {
            left: 73vw;
            bottom: 31vh;
            z-index: 1;
            height: 58vh;
          }

          .game-start-shell.mounted .game-start-engineer {
            opacity: 0.22;
          }

          .game-start-panel {
            z-index: 4;
            align-self: end;
            width: 100%;
            gap: 12px;
            padding: 20px 16px 38px;
            border: 1px solid rgba(142, 245, 255, 0.38);
            border-left-width: 5px;
            background: linear-gradient(180deg, rgba(7, 20, 63, 0.91), rgba(5, 13, 57, 0.98));
            box-shadow: 10px 10px 0 rgba(255, 42, 42, 0.78);
          }

          .game-start-panel-label {
            margin-bottom: 2px;
            font-size: 13px;
          }

          .game-start-option {
            min-height: 104px;
            padding: 16px 18px;
          }

          .game-start-option.active {
            box-shadow: 7px 7px 0 #ff2a2a;
            transform: translateX(-4px);
          }

          .game-start-option strong {
            font-size: clamp(38px, 12vw, 54px);
          }

          .game-start-option span {
            margin-top: 8px;
            font-size: 12px;
            letter-spacing: 1.4px;
          }

          .game-start-version {
            right: 14px;
            bottom: 12px;
            font-size: 10px;
          }
        }

        @media (max-width: 420px) and (max-height: 700px) {
          .game-start-panel { padding-top: 14px; }
          .game-start-option { min-height: 88px; }
          .game-start-engineer { bottom: 37vh; height: 52vh; }
        }
      `}</style>

      <div className={`game-start-shell${mounted ? " mounted" : ""}`}>
        <div className="game-start-engineer" aria-hidden="true">
          <video
            className="game-start-engineer-video"
            src={engineerLoop}
            poster={engineerPoster}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            tabIndex={-1}
          />
        </div>

        <div className="game-start-brand">
          <span className="game-start-kicker">25–26 JULY 2026 // LONDON</span>
          <h1>
            <span className="game-start-title-line">CONSUMER HEALTH</span>
            <span className="game-start-title-line hackathon">HACKATHON</span>
          </h1>
        </div>

        <div className="game-start-panel">
          <span className="game-start-panel-label">SELECT SAVE DATA</span>
          {OPTIONS.map((option, index) => (
            <button
              className={`game-start-option${active === index ? " active" : ""}`}
              key={option.id}
              type="button"
              onClick={() => choose(option.id)}
              onMouseEnter={() => setActive(index)}
            >
              <strong>{option.label}</strong>
              <span>{option.subtitle}</span>
            </button>
          ))}
          <span className="game-start-version">↑↓ SELECT · ENTER CONFIRM</span>
        </div>
      </div>
    </div>
  );
}
