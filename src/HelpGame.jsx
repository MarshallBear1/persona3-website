import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import VideoBackground from "./VideoBackground";

const HELP_CENTRE = {
  eyebrow: "MEDICAL SUPPORT CENTRE",
  mission: "WALK TO THE CLINIC DESK AND BUMP INTO THE MEDICAL GUIDE",
  ticket: "MEDICAL HELP DESK // NEW TICKET",
  copy: "THE CLINIC TEAM IS READY TO ROUTE YOUR SUPPORT REQUEST",
  returnLabel: "RETURN TO THE MEDICAL CENTRE",
};

export default function HelpGame() {
  const navigate = useNavigate();
  const gameFrameRef = useRef(null);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  useEffect(() => {
    const onMessage = (event) => {
      if (event.source !== gameFrameRef.current?.contentWindow) return;
      if (event.data?.type === "open-support-ticket") setTicketOpen(true);
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      if (ticketOpen) {
        event.preventDefault();
        setTicketOpen(false);
        setSubmitted(false);
        gameFrameRef.current?.contentWindow?.postMessage({ type: "resume-support-game" }, "*");
      } else {
        navigate(-1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate, ticketOpen]);

  const closeTerminal = () => {
    setTicketOpen(false);
    setSubmitted(false);
    gameFrameRef.current?.contentWindow?.postMessage({ type: "resume-support-game" }, "*");
    gameFrameRef.current?.contentWindow?.focus();
  };

  const submitTicket = (event) => {
    event.preventDefault();
    setTicketId(`HELP-${String(Date.now()).slice(-6)}`);
    setSubmitted(true);
  };

  const sendGameKey = (key, eventType) => {
    gameFrameRef.current?.contentWindow?.postMessage(
      { type: "medical-game-key", key, eventType },
      "*",
    );
  };

  const movementHandlers = (key) => ({
    onPointerDown: (event) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture?.(event.pointerId);
      sendGameKey(key, "keydown");
    },
    onPointerUp: (event) => {
      event.preventDefault();
      sendGameKey(key, "keyup");
    },
    onPointerCancel: () => sendGameKey(key, "keyup"),
    onPointerLeave: (event) => {
      if (event.buttons) sendGameKey(key, "keyup");
    },
  });

  return (
    <div id="menu-screen" className="help-upstream-page">
      <VideoBackground />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Bebas+Neue&display=swap');

        .help-upstream-page {
          background: #02040f;
          font-family: 'Press Start 2P', monospace;
        }

        .help-upstream-bg { opacity: 0.2; }

        .help-upstream-board {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 10;
          width: min(84vw, 900px);
          aspect-ratio: 4 / 3;
          border: 7px solid #8ef5ff;
          outline: 7px solid #07143f;
          background: #02040f;
          box-shadow: 17px 17px 0 rgba(255, 42, 42, 0.82), 0 0 42px rgba(60, 226, 255, 0.22);
          transform: translate(-50%, -50%);
        }

        .help-upstream-frame {
          width: 100%;
          height: 100%;
          display: block;
          border: 0;
          background: #02040f;
        }

        .help-upstream-mission,
        .help-upstream-controls {
          position: absolute;
          top: 14px;
          z-index: 2;
          padding: 10px 12px;
          font-size: 9px;
          line-height: 1.6;
          pointer-events: none;
        }

        .help-upstream-mission {
          left: 14px;
          max-width: 300px;
          color: #07143f;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 6px 6px 0 #ff2a2a;
        }

        .help-upstream-mission strong {
          display: block;
          margin-bottom: 3px;
          color: #ff2a2a;
        }

        .help-upstream-controls {
          right: 14px;
          color: #ffffff;
          border: 2px solid #8ef5ff;
          background: rgba(5, 13, 57, 0.92);
          text-align: right;
        }

        .help-upstream-hint {
          position: absolute;
          right: 16px;
          bottom: 12px;
          z-index: 2;
          padding: 7px 9px;
          color: rgba(255, 255, 255, 0.78);
          background: rgba(5, 13, 57, 0.8);
          font-size: 7px;
          pointer-events: none;
        }

        .help-upstream-credit {
          position: absolute;
          left: 14px;
          bottom: 12px;
          z-index: 3;
          color: #8ef5ff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 13px;
          letter-spacing: 1px;
          text-decoration: none;
        }

        .help-upstream-credit:hover { color: #ffffff; }

        .help-mobile-dpad {
          display: none;
        }

        .help-ticket-backdrop {
          position: absolute;
          inset: 0;
          z-index: 30;
          display: grid;
          place-items: center;
          padding: 24px;
          background: rgba(1, 4, 18, 0.84);
        }

        .help-ticket-terminal {
          width: min(760px, 90vw);
          max-height: 90vh;
          overflow-y: auto;
          padding: 22px;
          color: #ffffff;
          background: #07143f;
          border: 7px solid #8ef5ff;
          outline: 7px solid #0d1b68;
          box-shadow: 16px 16px 0 #ff2a2a;
        }

        .help-ticket-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 15px 18px;
          color: #07143f;
          background: #ffffff;
          font-size: 13px;
          line-height: 1.4;
        }

        .help-ticket-header span { color: #ff2a2a; font-size: 10px; }

        .help-ticket-copy {
          margin: 18px 0 14px;
          color: #8ef5ff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 21px;
          letter-spacing: 2px;
        }

        .help-ticket-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .help-ticket-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 9px;
          line-height: 1.4;
        }

        .help-ticket-field.wide { grid-column: 1 / -1; }

        .help-ticket-input,
        .help-ticket-select,
        .help-ticket-textarea {
          width: 100%;
          box-sizing: border-box;
          border: 3px solid #26377f;
          border-radius: 0;
          outline: none;
          color: #07143f;
          background: #ffffff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 1px;
        }

        .help-ticket-input,
        .help-ticket-select { min-height: 50px; padding: 0 12px; }
        .help-ticket-textarea { min-height: 104px; padding: 12px; resize: vertical; }

        .help-ticket-input:focus,
        .help-ticket-select:focus,
        .help-ticket-textarea:focus {
          border-color: #8ef5ff;
          box-shadow: 5px 5px 0 #ff2a2a;
        }

        .help-ticket-submit,
        .help-ticket-close {
          min-height: 54px;
          border: 0;
          color: #07143f;
          background: #8ef5ff;
          cursor: pointer;
          font-family: 'Press Start 2P', monospace;
          font-size: 11px;
        }

        .help-ticket-submit { grid-column: 1 / -1; box-shadow: 7px 7px 0 #ff2a2a; }

        .help-ticket-success {
          padding: 34px 20px;
          border: 3px solid #8ef5ff;
          background: rgba(3, 8, 39, 0.92);
          text-align: center;
        }

        .help-ticket-success h2 {
          margin: 0 0 16px;
          color: #8ef5ff;
          font-size: 20px;
          line-height: 1.5;
        }

        .help-ticket-success p {
          margin: 8px 0 20px;
          color: rgba(255, 255, 255, 0.74);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 2px;
        }

        .help-ticket-close { min-width: 220px; padding: 0 18px; }

        @media (max-width: 800px) {
          .help-upstream-board {
            top: max(14px, env(safe-area-inset-top));
            left: 8px;
            width: calc(100vw - 16px);
            border-width: 3px;
            outline-width: 3px;
            box-shadow: 7px 7px 0 rgba(255, 42, 42, 0.82), 0 0 24px rgba(60, 226, 255, 0.22);
            transform: none;
          }

          .help-upstream-mission,
          .help-upstream-controls {
            top: 7px;
            padding: 6px 7px;
            font-size: 6px;
            line-height: 1.55;
          }

          .help-upstream-mission { left: 7px; max-width: 58%; box-shadow: 3px 3px 0 #ff2a2a; }
          .help-upstream-controls { right: 7px; border-width: 1px; }
          .help-upstream-hint { right: 7px; bottom: 6px; padding: 5px; font-size: 5px; }
          .help-upstream-credit {
            left: 8px;
            bottom: -42px;
            max-width: calc(100vw - 16px);
            font-size: 10px;
            line-height: 1.25;
          }

          .help-mobile-dpad {
            position: absolute;
            top: calc(max(14px, env(safe-area-inset-top)) + ((100vw - 16px) * 0.75) + 54px);
            left: 50%;
            z-index: 12;
            display: grid;
            grid-template-columns: repeat(3, 54px);
            grid-template-rows: repeat(2, 54px);
            gap: 7px;
            transform: translateX(-50%);
          }

          .help-mobile-key {
            display: grid;
            place-items: center;
            border: 2px solid #8ef5ff;
            color: #07143f;
            background: #ffffff;
            box-shadow: 4px 4px 0 #ff2a2a;
            font-family: 'Press Start 2P', monospace;
            font-size: 16px;
            touch-action: none;
            user-select: none;
          }

          .help-mobile-key:active {
            color: #ffffff;
            background: #ff2a2a;
            box-shadow: 1px 1px 0 #8ef5ff;
            transform: translate(3px, 3px);
          }

          .help-mobile-key.up { grid-column: 2; }
          .help-mobile-key.left { grid-column: 1; grid-row: 2; }
          .help-mobile-key.down { grid-column: 2; grid-row: 2; }
          .help-mobile-key.right { grid-column: 3; grid-row: 2; }

          .help-ticket-backdrop {
            align-items: start;
            overflow-y: auto;
            padding: max(16px, env(safe-area-inset-top)) 10px max(28px, env(safe-area-inset-bottom));
          }

          .help-ticket-terminal {
            width: 100%;
            max-height: none;
            padding: 12px;
            border-width: 4px;
            outline-width: 3px;
            box-shadow: 7px 7px 0 #ff2a2a;
          }

          .help-ticket-header { padding: 12px; font-size: 9px; }
          .help-ticket-header span { font-size: 7px; }
          .help-ticket-copy { margin: 14px 0 10px; font-size: 17px; }
          .help-ticket-form { grid-template-columns: 1fr; }
          .help-ticket-field.wide, .help-ticket-submit { grid-column: 1; }
          .help-ticket-input,
          .help-ticket-select,
          .help-ticket-textarea { font-size: 18px; }
          .help-ticket-submit,
          .help-ticket-close { min-height: 52px; font-size: 9px; }
          .help-ticket-close { min-width: 0; width: 100%; }
          .help-ticket-success { padding: 24px 12px; }
          .help-ticket-success h2 { font-size: 16px; }
        }

        @media (max-width: 800px) and (orientation: landscape) {
          .help-upstream-board {
            top: 50%;
            left: 50%;
            width: min(88vw, calc((100dvh - 24px) * 4 / 3));
            transform: translate(-50%, -50%);
          }

          .help-mobile-dpad { display: none; }
        }
      `}</style>

      <section className="help-upstream-board" aria-label="Open-source 2D medical support game">
        <iframe
          ref={gameFrameRef}
          className="help-upstream-frame"
          src="/help-game/index.html"
          title="JSLegendDev Pokémon p5.js game adapted as a friendly medical support center"
          onLoad={() => gameFrameRef.current?.contentWindow?.focus()}
        />
        <div className="help-upstream-mission">
          <strong>{HELP_CENTRE.eyebrow}</strong>
          {HELP_CENTRE.mission}
        </div>
        <div className="help-upstream-controls">WASD · MOVE<br />ESC · BACK</div>
        <div className="help-upstream-hint">CLICK THE GAME IF WASD IS NOT ACTIVE</div>
        <a className="help-upstream-credit" href="https://github.com/JSLegendDev/Pokemon-p5js" target="_blank" rel="noreferrer">GITHUB ENGINE · JSLEGENDDEV/POKEMON-P5JS · MIT</a>
      </section>

      <div className="help-mobile-dpad" aria-label="Mobile movement controls">
        <button className="help-mobile-key up" type="button" aria-label="Move up" {...movementHandlers("w")}>↑</button>
        <button className="help-mobile-key left" type="button" aria-label="Move left" {...movementHandlers("a")}>←</button>
        <button className="help-mobile-key down" type="button" aria-label="Move down" {...movementHandlers("s")}>↓</button>
        <button className="help-mobile-key right" type="button" aria-label="Move right" {...movementHandlers("d")}>→</button>
      </div>

      {ticketOpen && (
        <div className="help-ticket-backdrop" role="dialog" aria-modal="true" aria-label="Support ticket terminal">
          <div className="help-ticket-terminal">
            <div className="help-ticket-header">
              {HELP_CENTRE.ticket}
              <span>ONLINE</span>
            </div>
            {!submitted ? (
              <>
                <p className="help-ticket-copy">{HELP_CENTRE.copy}</p>
                <form className="help-ticket-form" onSubmit={submitTicket}>
                  <label className="help-ticket-field">
                    YOUR EMAIL
                    <input className="help-ticket-input" type="email" name="email" placeholder="YOU@EMAIL.COM" required autoFocus />
                  </label>
                  <label className="help-ticket-field">
                    CATEGORY
                    <select className="help-ticket-select" name="category" defaultValue="team">
                      <option value="team">TEAM HELP</option>
                      <option value="credits">CREDITS</option>
                      <option value="submission">SUBMISSION</option>
                      <option value="technical">TECHNICAL ISSUE</option>
                      <option value="other">OTHER</option>
                    </select>
                  </label>
                  <label className="help-ticket-field wide">
                    SUBJECT
                    <input className="help-ticket-input" name="subject" placeholder="WHAT IS THE PROBLEM?" required />
                  </label>
                  <label className="help-ticket-field wide">
                    MESSAGE
                    <textarea className="help-ticket-textarea" name="message" placeholder="DESCRIBE WHAT HAPPENED AND WHAT YOU HAVE TRIED..." required />
                  </label>
                  <button className="help-ticket-submit" type="submit">SEND TO SUPPORT →</button>
                </form>
              </>
            ) : (
              <div className="help-ticket-success" role="status">
                <h2>TICKET TRANSMITTED!</h2>
                <p>REFERENCE: {ticketId}<br />THE SUPPORT TEAM WILL GET BACK TO YOU.</p>
                <button className="help-ticket-close" type="button" onClick={closeTerminal}>{HELP_CENTRE.returnLabel}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
