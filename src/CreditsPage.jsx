import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { siAnthropic, siSupabase, siVercel } from "simple-icons";
import VideoBackground from "./VideoBackground";

const PROVIDERS = [
  { id: "anthropic", name: "ANTHROPIC", icon: siAnthropic },
  { id: "vercel", name: "VERCEL", icon: siVercel },
  { id: "supabase", name: "SUPABASE", icon: siSupabase },
];

function ProviderLogo({ provider, className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      role="img"
      aria-label={provider.name}
    >
      <title>{provider.name}</title>
      <path d={provider.icon.path} />
    </svg>
  );
}

export default function CreditsPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const provider = PROVIDERS[active];

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "ArrowUp") setActive((index) => Math.max(0, index - 1));
      if (event.key === "ArrowDown") setActive((index) => Math.min(PROVIDERS.length - 1, index + 1));
      if (event.key === "ArrowLeft" || event.key === "Escape" || event.key === "Backspace") navigate(-1);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <div id="menu-screen">
      <VideoBackground />

      <style>{`
        .credits-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          font-family: 'Anton', sans-serif;
        }

        .credits-list {
          position: absolute;
          top: 16vh;
          left: 3.5vw;
          width: min(45vw, 720px);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .credits-list-title {
          margin-bottom: 8px;
          color: #ffffff;
          font-size: clamp(46px, 6vw, 92px);
          font-style: italic;
          line-height: 0.82;
          letter-spacing: 1px;
          text-shadow: 8px 8px 0 rgba(0, 0, 0, 0.72);
        }

        .credits-provider {
          position: relative;
          min-height: 108px;
          display: grid;
          grid-template-columns: 86px 1fr auto;
          align-items: center;
          gap: 18px;
          padding: 10px 30px 10px 16px;
          border: 0;
          background: rgba(13, 24, 86, 0.96);
          color: #a7a7a7;
          clip-path: polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(142, 245, 255, 0.16);
          cursor: pointer;
          text-align: left;
          opacity: 0;
          transform: translateX(-70px);
          transition:
            opacity 0.42s ease,
            transform 0.42s cubic-bezier(0.22, 1, 0.36, 1),
            background 0.18s ease,
            color 0.18s ease;
        }

        .credits-provider.mounted {
          opacity: 1;
          transform: translateX(0);
        }

        .credits-provider.active {
          color: #07143f;
          background: linear-gradient(90deg, #8ef5ff 0%, #ffffff 100%);
          box-shadow: 12px 10px 0 rgba(255, 42, 42, 0.8);
        }

        .credits-provider-logo-wrap {
          width: 72px;
          height: 72px;
          display: grid;
          place-items: center;
          color: #ffffff;
          background: rgba(0, 0, 0, 0.34);
          transform: skewX(-7deg);
        }

        .credits-provider.active .credits-provider-logo-wrap {
          color: #ff2a2a;
          background: #07143f;
        }

        .credits-provider-logo {
          width: 42px;
          height: 42px;
          fill: currentColor;
        }

        .credits-provider-name {
          font-size: clamp(34px, 4vw, 62px);
          font-style: italic;
          line-height: 0.9;
          letter-spacing: 1px;
        }

        .credits-provider-index {
          color: rgba(255, 255, 255, 0.42);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 34px;
        }

        .credits-provider.active .credits-provider-index {
          color: #07143f;
        }

        .credits-claim-panel {
          position: absolute;
          top: 8vh;
          right: 4vw;
          width: min(39vw, 620px);
          min-height: 72vh;
          padding: 22px 24px 26px;
          color: #ffffff;
          background: linear-gradient(180deg, rgba(15, 28, 105, 0.97), rgba(5, 13, 57, 0.98));
          clip-path: polygon(0 0, 100% 0, calc(100% - 20px) 100%, 0 100%);
          box-shadow: 16px 16px 0 rgba(0, 6, 30, 0.58);
        }

        .credits-claim-header {
          min-height: 96px;
          display: grid;
          grid-template-columns: 70px 1fr;
          align-items: center;
          gap: 18px;
          padding: 12px 20px;
          color: #07143f;
          background: linear-gradient(90deg, #8ef5ff, #ffffff);
          clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
          box-shadow: 10px 0 0 rgba(255, 42, 42, 0.88);
        }

        .credits-active-logo {
          width: 54px;
          height: 54px;
          fill: #ff2a2a;
        }

        .credits-claim-heading {
          font-size: clamp(34px, 3.3vw, 52px);
          font-style: italic;
          line-height: 0.9;
        }

        .credits-claim-provider {
          margin-top: 18px;
          color: #8ef5ff;
          font-size: 18px;
          letter-spacing: 2px;
        }

        .credits-steps {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 12px;
          list-style: none;
          counter-reset: claim-step;
        }

        .credits-step {
          counter-increment: claim-step;
          display: grid;
          grid-template-columns: 50px 1fr;
          align-items: center;
          gap: 14px;
          min-height: 68px;
          padding: 10px 16px;
          background: rgba(8, 18, 72, 0.96);
          clip-path: polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(142, 245, 255, 0.13);
        }

        .credits-step::before {
          content: counter(claim-step, decimal-leading-zero);
          color: #ff2a2a;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 30px;
        }

        .credits-step span {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(18px, 1.7vw, 26px);
          line-height: 1;
          letter-spacing: 1px;
        }

        .credits-note {
          margin-top: 18px;
          padding: 14px 16px;
          border-left: 5px solid #3ce2ff;
          color: rgba(255, 255, 255, 0.8);
          background: rgba(0, 0, 0, 0.34);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 1px;
        }

        .credits-back-hint {
          position: absolute;
          right: 28px;
          bottom: 22px;
          color: rgba(255, 255, 255, 0.54);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px;
          letter-spacing: 2px;
        }

        @media (max-width: 900px) {
          .credits-list {
            top: 13vh;
            width: 50vw;
          }

          .credits-claim-panel {
            right: 2vw;
            width: 45vw;
          }
        }

        @media (max-width: 700px) {
          .credits-overlay {
            overflow-x: hidden;
            overflow-y: auto;
            padding: max(18px, env(safe-area-inset-top)) 12px max(72px, env(safe-area-inset-bottom));
            -webkit-overflow-scrolling: touch;
          }

          .credits-list {
            position: relative;
            top: auto;
            left: auto;
            width: 100%;
            gap: 8px;
          }

          .credits-list-title {
            margin: 0 0 8px 4px;
            font-size: clamp(48px, 15vw, 64px);
          }

          .credits-provider {
            min-height: 72px;
            grid-template-columns: 54px minmax(0, 1fr) auto;
            gap: 11px;
            padding: 8px 18px 8px 10px;
          }

          .credits-provider.active { box-shadow: 6px 6px 0 rgba(255, 42, 42, 0.8); }
          .credits-provider-logo-wrap { width: 48px; height: 48px; }
          .credits-provider-logo { width: 29px; height: 29px; }
          .credits-provider-name { font-size: clamp(27px, 9vw, 38px); }
          .credits-provider-index { font-size: 24px; }

          .credits-claim-panel {
            position: relative;
            top: auto;
            right: auto;
            width: 100%;
            min-height: 0;
            margin-top: 20px;
            padding: 14px 14px 20px;
            box-shadow: 7px 7px 0 rgba(0, 6, 30, 0.58);
          }

          .credits-claim-header {
            min-height: 68px;
            grid-template-columns: 44px 1fr;
            gap: 11px;
            padding: 9px 13px;
            box-shadow: 6px 0 0 rgba(255, 42, 42, 0.88);
          }

          .credits-active-logo { width: 38px; height: 38px; }
          .credits-claim-heading { font-size: 31px; }
          .credits-claim-provider { margin-top: 14px; font-size: 15px; }
          .credits-steps { gap: 8px; margin-top: 9px; }
          .credits-step {
            min-height: 64px;
            grid-template-columns: 38px 1fr;
            gap: 8px;
            padding: 8px 11px;
          }
          .credits-step::before { font-size: 25px; }
          .credits-step span { font-size: 17px; }
          .credits-note { margin-top: 12px; font-size: 15px; }
          .credits-back-hint { display: none; }
        }
      `}</style>

      <div className="credits-overlay">
        <section className="credits-list" aria-label="Credit providers">
          <h1 className="credits-list-title">FREE CREDITS</h1>
          {PROVIDERS.map((item, index) => (
            <button
              className={`credits-provider${active === index ? " active" : ""}${mounted ? " mounted" : ""}`}
              key={item.id}
              type="button"
              onClick={() => setActive(index)}
              onMouseEnter={() => setActive(index)}
              style={{ transitionDelay: `${index * 70}ms` }}
              aria-pressed={active === index}
            >
              <span className="credits-provider-logo-wrap">
                <ProviderLogo provider={item} className="credits-provider-logo" />
              </span>
              <span className="credits-provider-name">{item.name}</span>
              <span className="credits-provider-index">0{index + 1}</span>
            </button>
          ))}
        </section>

        <aside className="credits-claim-panel">
          <div className="credits-claim-header">
            <ProviderLogo provider={provider} className="credits-active-logo" />
            <div className="credits-claim-heading">HOW TO CLAIM</div>
          </div>

          <div className="credits-claim-provider">{provider.name} CREDITS</div>
          <ol className="credits-steps">
            <li className="credits-step"><span>Select the provider from the list</span></li>
            <li className="credits-step"><span>Open the claim link shared by the organisers</span></li>
            <li className="credits-step"><span>Sign in with your registered hackathon email</span></li>
            <li className="credits-step"><span>Complete redemption before the stated deadline</span></li>
          </ol>

          <div className="credits-note">Official claim links and redemption terms will be supplied by the organisers.</div>
        </aside>

        <div className="credits-back-hint">↑↓ SELECT · ESC BACK</div>
      </div>
    </div>
  );
}
