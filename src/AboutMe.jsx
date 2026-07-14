import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VideoBackground from "./VideoBackground";

export default function AboutMe() {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.key === "Enter" || event.key === "ArrowRight") && !opened) {
        event.preventDefault();
        setOpened(true);
      }

      if (event.key === "Escape" || event.key === "Backspace" || event.key === "ArrowLeft") {
        event.preventDefault();
        if (opened) setOpened(false);
        else navigate(-1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate, opened]);

  return (
    <div id="menu-screen" className={`brief-letter-page${opened ? " is-open" : ""}`}>
      <VideoBackground />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Special+Elite&display=swap');

        .brief-letter-page {
          color: #07143f;
          font-family: 'Bebas Neue', sans-serif;
        }

        .brief-letter-page::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 2;
          background: rgba(2, 5, 22, 0.58);
          transition: background 420ms ease;
          pointer-events: none;
        }

        .brief-letter-page.is-open::after { background: rgba(2, 5, 22, 0.78); }

        .brief-envelope-stage {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: grid;
          place-items: center;
          padding: 24px;
          transition: opacity 280ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .brief-letter-page.is-open .brief-envelope-stage {
          opacity: 0;
          transform: translateY(90px) scale(0.88);
          pointer-events: none;
        }

        .brief-envelope-button {
          position: relative;
          width: min(720px, 86vw);
          aspect-ratio: 1.72 / 1;
          border: 0;
          color: #07143f;
          background: #e8edf3;
          box-shadow: 22px 22px 0 #ff2a2a, 0 28px 70px rgba(0, 0, 0, 0.48);
          overflow: hidden;
          transform: rotate(-2deg);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .brief-envelope-button:hover,
        .brief-envelope-button:focus-visible {
          outline: 5px solid #8ef5ff;
          box-shadow: 30px 30px 0 #ff2a2a, 0 34px 80px rgba(0, 0, 0, 0.56);
          transform: rotate(0deg) translateY(-8px);
        }

        .brief-envelope-button::before,
        .brief-envelope-button::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .brief-envelope-button::before {
          z-index: 1;
          background: linear-gradient(145deg, transparent 49.5%, #cdd7e2 50%) left / 50% 100% no-repeat,
            linear-gradient(215deg, transparent 49.5%, #dce4ec 50%) right / 50% 100% no-repeat;
        }

        .brief-envelope-button::after {
          z-index: 2;
          clip-path: polygon(0 0, 100% 0, 50% 58%);
          background: #f7fafc;
          border-bottom: 4px solid #b9c8d7;
        }

        .brief-envelope-address {
          position: absolute;
          left: 42px;
          bottom: 38px;
          z-index: 4;
          text-align: left;
          transform: rotate(-1deg);
        }

        .brief-envelope-address small {
          display: block;
          color: #ff2a2a;
          font-family: 'Special Elite', monospace;
          font-size: 14px;
          letter-spacing: 2px;
        }

        .brief-envelope-address strong {
          display: block;
          margin-top: 8px;
          font-family: 'Anton', sans-serif;
          font-size: clamp(36px, 6vw, 74px);
          font-style: italic;
          line-height: 0.88;
        }

        .brief-wax-seal {
          position: absolute;
          top: 48%;
          left: 50%;
          z-index: 6;
          display: grid;
          width: 92px;
          height: 92px;
          place-items: center;
          border: 6px double rgba(255, 255, 255, 0.42);
          border-radius: 50%;
          color: #ffffff;
          background: #d31837;
          box-shadow: 0 8px 0 #8a0a1f, 0 12px 24px rgba(0, 0, 0, 0.32);
          font-family: Arial, sans-serif;
          font-size: 56px;
          font-weight: 900;
          transform: translate(-50%, -50%) rotate(5deg);
        }

        .brief-open-command {
          position: absolute;
          right: 34px;
          bottom: 32px;
          z-index: 5;
          padding: 9px 12px;
          color: #ffffff;
          background: #07143f;
          font-size: 13px;
          letter-spacing: 2px;
        }

        .brief-letter-shell {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 12;
          width: min(940px, 90vw);
          height: min(82vh, 790px);
          opacity: 0;
          transform: translate(-50%, -42%) scale(0.78) rotate(2deg);
          transition: opacity 300ms ease 100ms, transform 620ms cubic-bezier(0.22, 1, 0.36, 1) 80ms;
          pointer-events: none;
        }

        .brief-letter-page.is-open .brief-letter-shell {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1) rotate(-0.5deg);
          pointer-events: auto;
        }

        .brief-letter {
          position: relative;
          width: 100%;
          height: 100%;
          overflow-y: auto;
          padding: clamp(30px, 5vw, 64px);
          border: 1px solid #c1cbd7;
          background:
            repeating-linear-gradient(0deg, transparent 0, transparent 31px, rgba(7, 20, 63, 0.06) 32px),
            #f8f5eb;
          box-shadow: 20px 20px 0 #ff2a2a, 0 30px 90px rgba(0, 0, 0, 0.48);
          scrollbar-color: #ff2a2a #e3e7eb;
        }

        .brief-letter::before {
          content: "CONFIDENTIAL // CHH-2026";
          position: absolute;
          top: 25px;
          right: 34px;
          padding: 8px 10px;
          border: 3px solid rgba(211, 24, 55, 0.5);
          color: rgba(211, 24, 55, 0.72);
          font-family: 'Special Elite', monospace;
          font-size: 11px;
          letter-spacing: 1px;
          transform: rotate(3deg);
        }

        .brief-letter-kicker {
          color: #ff2a2a;
          font-family: 'Special Elite', monospace;
          font-size: 13px;
          letter-spacing: 2px;
        }

        .brief-letter h1 {
          max-width: 720px;
          margin: 12px 0 18px;
          font-family: 'Anton', sans-serif;
          font-size: clamp(50px, 8vw, 92px);
          font-style: italic;
          line-height: 0.88;
          letter-spacing: -1px;
        }

        .brief-letter-intro {
          max-width: 760px;
          margin-bottom: 28px;
          font-family: 'Special Elite', monospace;
          font-size: clamp(15px, 1.6vw, 20px);
          line-height: 1.55;
        }

        .brief-letter-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .brief-letter-card {
          padding: 20px;
          border: 3px solid #07143f;
          background: rgba(255, 255, 255, 0.66);
          box-shadow: 6px 6px 0 rgba(7, 20, 63, 0.18);
        }

        .brief-letter-card.team-card {
          color: #ffffff;
          background: #07143f;
          box-shadow: 7px 7px 0 #ff2a2a;
        }

        .brief-letter-card span {
          display: block;
          margin-bottom: 7px;
          color: #ff2a2a;
          font-size: 13px;
          letter-spacing: 2px;
        }

        .brief-letter-card strong {
          display: block;
          font-family: 'Anton', sans-serif;
          font-size: clamp(28px, 3vw, 42px);
          font-style: italic;
          line-height: 1;
        }

        .brief-letter-card p {
          margin-top: 10px;
          font-family: 'Special Elite', monospace;
          font-size: 13px;
          line-height: 1.45;
        }

        .brief-letter-footer {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-top: 30px;
          padding-top: 22px;
          border-top: 3px solid #07143f;
        }

        .brief-letter-signature {
          font-family: 'Special Elite', monospace;
          font-size: 16px;
          line-height: 1.5;
        }

        .brief-letter-close {
          flex: 0 0 auto;
          min-height: 48px;
          padding: 0 18px;
          border: 0;
          color: #ffffff;
          background: #07143f;
          box-shadow: 6px 6px 0 #ff2a2a;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 2px;
        }

        .brief-page-hint {
          position: fixed;
          right: 28px;
          bottom: 20px;
          z-index: 14;
          color: rgba(255, 255, 255, 0.72);
          font-size: 12px;
          letter-spacing: 2px;
        }

        @media (max-width: 700px) {
          .brief-envelope-stage {
            padding: 16px;
          }

          .brief-envelope-button {
            width: 100%;
            min-height: min(440px, 58vh);
            aspect-ratio: auto;
            box-shadow: 10px 10px 0 #ff2a2a, 0 20px 50px rgba(0, 0, 0, 0.48);
          }

          .brief-envelope-address {
            left: 22px;
            right: 22px;
            bottom: 82px;
          }

          .brief-envelope-address small {
            font-size: 11px;
            letter-spacing: 1.4px;
          }

          .brief-envelope-address strong {
            margin-top: 5px;
            font-size: clamp(36px, 12vw, 52px);
          }

          .brief-wax-seal {
            top: 39%;
            width: 68px;
            height: 68px;
            border-width: 4px;
            font-size: 42px;
          }

          .brief-open-command {
            right: 20px;
            bottom: 20px;
            left: 20px;
            min-height: 44px;
            display: grid;
            place-items: center;
            padding: 8px;
            font-size: 14px;
            text-align: center;
          }

          .brief-letter-shell {
            top: max(12px, env(safe-area-inset-top));
            left: 12px;
            width: calc(100vw - 24px);
            height: calc(100dvh - max(24px, env(safe-area-inset-top)) - max(34px, env(safe-area-inset-bottom)));
            transform: translateY(40px) scale(0.84) rotate(1deg);
          }

          .brief-letter-page.is-open .brief-letter-shell {
            transform: none;
          }

          .brief-letter {
            padding: 24px 18px 32px;
            box-shadow: 7px 7px 0 #ff2a2a;
          }

          .brief-letter h1 {
            margin: 10px 0 14px;
            font-size: clamp(42px, 13vw, 60px);
          }

          .brief-letter-intro { margin-bottom: 20px; font-size: 14px; }
          .brief-letter-grid { grid-template-columns: 1fr; }
          .brief-letter::before { display: none; }
          .brief-letter-card { padding: 16px; }
          .brief-letter-footer { align-items: stretch; flex-direction: column; }
          .brief-letter-close { width: 100%; }
          .brief-page-hint { display: none; }
        }
      `}</style>

      <div className="brief-envelope-stage">
        <button
          className="brief-envelope-button"
          type="button"
          onClick={() => setOpened(true)}
          aria-label="Open the Consumer Health Hackathon brief"
        >
          <span className="brief-wax-seal">+</span>
          <span className="brief-envelope-address">
            <small>DELIVER TO: ALL HACKERS</small>
            <strong>THE OFFICIAL BRIEF</strong>
          </span>
          <span className="brief-open-command">CLICK TO OPEN →</span>
        </button>
      </div>

      <section className="brief-letter-shell" aria-hidden={!opened} aria-label="Consumer Health Hackathon brief">
        <article className="brief-letter">
          <span className="brief-letter-kicker">25–26 JULY 2026 · CONSUMER HEALTH HACKATHON</span>
          <h1>BUILD HEALTHCARE PEOPLE WANT TO USE.</h1>
          <p className="brief-letter-intro">
            Your mission is to build a consumer health product that helps real people understand, manage, or improve their everyday health. Start with a clear problem, make something usable, and show it working.
          </p>

          <div className="brief-letter-grid">
            <div className="brief-letter-card team-card">
              <span>TEAM RULE</span>
              <strong>MAXIMUM 4 PEOPLE</strong>
              <p>Compete solo or form a team. No team may have more than four members.</p>
            </div>
            <div className="brief-letter-card">
              <span>THE BUILD</span>
              <strong>A WORKING PRODUCT</strong>
              <p>Create a credible prototype with code, thoughtful design, and a clear consumer-health use case.</p>
            </div>
            <div className="brief-letter-card">
              <span>SUBMISSION</span>
              <strong>GITHUB + DEMO VIDEO</strong>
              <p>Submit your repository and a concise video that explains the problem, product, and working demo.</p>
            </div>
            <div className="brief-letter-card">
              <span>JUDGING</span>
              <strong>CODE · DESIGN · IDEA · DEMO</strong>
              <p>Judges will also award extra points for ambitious, polished, and genuinely useful work.</p>
            </div>
          </div>

          <footer className="brief-letter-footer">
            <p className="brief-letter-signature">Good luck.<br />Build boldly—and make health feel human.</p>
            <button className="brief-letter-close" type="button" onClick={() => setOpened(false)}>CLOSE LETTER</button>
          </footer>
        </article>
      </section>

      <div className="brief-page-hint">{opened ? "ESC · CLOSE LETTER" : "ENTER · OPEN LETTER   ESC · BACK"}</div>
    </div>
  );
}
