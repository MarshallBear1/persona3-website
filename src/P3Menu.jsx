import { useState, useEffect } from "react";
import TutorialCoach from "./TutorialCoach";

const ITEMS = [
  { id: "brief",        label: "BRIEF",              page: "brief",        fontSize: 72, offsetX: 0,  offsetY: 0, skew: -6,  skewY: 10  },
  { id: "teams",        label: "TEAMS",              page: "teams",        fontSize: 66, offsetX: 18, offsetY: 5, skew: -11, skewY: -10 },
  { id: "mark-scheme",  label: "MARK SCHEME",        page: "mark-scheme",  fontSize: 54, offsetX: 8,  offsetY: 4, skew: 0,   skewY: -4  },
  { id: "prizes",       label: "PRIZES",             page: "prizes",       fontSize: 66, offsetX: 14, offsetY: 4, skew: -3,  skewY: 5   },
  { id: "schedule",     label: "SCHEDULE",           page: "schedule",     fontSize: 56, offsetX: 8,  offsetY: 4, skew: -4,  skewY: 7   },
  { id: "credits",      label: "CLAIM FREE CREDITS", page: "credits",      fontSize: 42, offsetX: 16, offsetY: 4, skew: -7,  skewY: -5  },
  { id: "help",         label: "HELP",               page: "help",         fontSize: 62, offsetX: 2,  offsetY: 4, skew: -2,  skewY: 6   },
];

const CLIP_SHAPES = [
  (w, h) => `polygon(0px 0px, ${w}px ${h * 0.5}px, 0px ${h}px)`,
  (w, h) => `polygon(0px 0px, ${w}px ${h * 0.5}px, 0px ${h}px)`,
  (w, h) => `polygon(0px 0px, ${w}px ${h * 0.5}px, 0px ${h}px)`,
  (w, h) => `polygon(0px 0px, ${w}px ${h * 0.5}px, 0px ${h}px)`,
  (w, h) => `polygon(0px 0px, ${w}px ${h * 0.5}px, 0px ${h}px)`,
  (w, h) => `polygon(0px 0px, ${w}px ${h * 0.5}px, 0px ${h}px)`,
  (w, h) => `polygon(0px 0px, ${w}px ${h * 0.5}px, 0px ${h}px)`,
];

const HACKATHON_START = Date.parse("2026-07-25T10:00:00Z");

function getCountdown(now) {
  const milliseconds = Math.max(0, HACKATHON_START - now);
  const totalSeconds = Math.floor(milliseconds / 1000);

  return {
    complete: milliseconds === 0,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const padCountdown = (value) => String(value).padStart(2, "0");

export default function P3Menu({ onNavigate, tutorialActive = false }) {
  const [active, setActive] = useState(() => tutorialActive ? 1 : 0);
  const [mounted, setMounted] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const countdown = getCountdown(now);

  const activate = (idx) => {
    setActive(idx);
    setAnimKey(k => k + 1);
  };

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const updateCountdown = () => setNow(Date.now());
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (tutorialActive) {
        if (e.key === "Enter") onNavigate?.("teams");
        return;
      }
      if (e.key === "ArrowUp")   activate(Math.max(0, active - 1));
      if (e.key === "ArrowDown") activate(Math.min(ITEMS.length - 1, active + 1));
      if (e.key === "Enter")     onNavigate?.(ITEMS[active].page);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onNavigate, tutorialActive]);

  return (
    <>
      <style>{`
        .p3-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .p3-stripe  { position:absolute; right:0; top:0; bottom:0; width:5px; background:#c4001a; z-index:10; pointer-events:none; }
        .p3-stripe2 { position:absolute; right:9px; top:0; bottom:0; width:2px; background:rgba(245,122,139,0.22); z-index:10; pointer-events:none; }

        .p3-menu {
          position: relative;
          z-index: 20;
          padding: 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: all;
          transform: translateX(-25vw);
        }

        @media (max-width: 760px) {
          .p3-overlay {
            display: block;
            overflow: hidden;
            padding: 112px 14px max(58px, env(safe-area-inset-bottom));
          }

          .p3-menu {
            width: 100%;
            height: 100%;
            padding: 0 6px;
            align-items: stretch;
            justify-content: center;
            gap: 5px;
            transform: none;
          }

          .p3-row {
            width: 100%;
            min-height: 52px;
            margin: 0 !important;
            justify-content: flex-start;
          }

          .p3-skew-wrap {
            width: 100%;
            min-height: 52px;
            padding: 8px 18px;
            transform: none !important;
          }

          .p3-selection-shape {
            width: 100% !important;
            height: 100% !important;
          }

          .p3-label-base {
            font-size: clamp(27px, 8.4vw, 38px) !important;
            line-height: 1;
          }

          .p3-hint { display: none; }
        }
        }

        .p3-row {
          position: relative;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          text-decoration: none;
          opacity: 0;
          transform: translateX(36px);
          transition: opacity 0.38s ease, transform 0.38s cubic-bezier(0.22,1,0.36,1);
        }
        .p3-row.mounted {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }

        .p3-glow {
          position: absolute;
          inset: 0;
          background: rgba(255, 42, 106, 0.5);
          filter: blur(12px);
          z-index: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .p3-row.active .p3-glow { opacity: 1; }

        .p3-skew-wrap {
          position: relative;
          display: flex;
          align-items: center;
          isolation: isolate;
        }

        .p3-selection-shape {
          position: absolute;
          top: 50%;
          left: 0;
          z-index: 0;
          transform: translateY(-50%);
          transform-origin: left center;
          pointer-events: none;
        }

        @keyframes p3-shadow-pop {
          0%   { transform: translate(-12px, 7%) scaleX(0) scaleY(1); }
          55%  { transform: translate(-15px, 4%) scaleX(1.22) scaleY(1.18); }
          75%  { transform: translate(-11px, 8%) scaleX(0.96) scaleY(0.97); }
          100% { transform: translate(-12px, 7%) scaleX(1) scaleY(1); }
        }

        .p3-shadow-tri {
          position: absolute;
          inset: 0;
          transform-origin: left center;
          background: rgba(235, 80, 120, 0.85);
          z-index: 1;
          pointer-events: none;
          transform: translate(-12px, 7%) scaleX(0);
          transition: transform 0.18s ease;
        }
        .p3-shadow-tri.pop {
          animation: p3-shadow-pop 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .p3-highlight {
          position: absolute;
          inset: 0;
          transform-origin: left center;
          background: #ffffff;
          z-index: 2;
          transform: scaleX(0);
          transition: transform 0.22s cubic-bezier(0.22,1,0.36,1);
          pointer-events: none;
        }
        .p3-row.active .p3-highlight { transform: scaleX(1); }

        .p3-label-wrap {
          position: relative;
          z-index: 3;
        }

        .p3-label-base {
          font-family: 'Anton', sans-serif;
          font-style: italic;
          letter-spacing: 2px;
          line-height: 0.85;
          display: block;
          white-space: nowrap;
          user-select: none;
        }

        .p3-label-dark {
          color: #3ce2ff;
          transition: color 0.12s ease;
        }
        .p3-row.active .p3-label-dark { color: #6b0010; }
        .p3-row:hover:not(.active) .p3-label-dark { color: #3ce2ff; }

        .p3-label-bright {
          color: #ff2a2a;
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0;
          transition: opacity 0.12s ease;
        }
        .p3-row.active .p3-label-bright { opacity: 1; }

        .p3-hint {
          position: absolute;
          bottom: 24px; right: 28px;
          z-index: 20;
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 5px;
          font-family: 'Anton', sans-serif;
          opacity: 0;
          transition: opacity 0.5s ease 0.9s;
        }
        .p3-hint.mounted { opacity: 1; }
        .p3-hint-row {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; letter-spacing: 2px;
          color: rgba(255,255,255,0.28);
        }
        .p3-hint-key {
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 3px;
          padding: 1px 6px; font-size: 11px;
        }

        .p3-event-tag {
          position: absolute;
          top: 28px;
          right: 34px;
          z-index: 20;
          padding: 10px 16px 8px;
          border-left: 5px solid #ffffff;
          background: rgba(0, 0, 0, 0.72);
          color: #ffffff;
          font-family: 'Anton', sans-serif;
          font-size: clamp(18px, 2vw, 30px);
          font-style: italic;
          line-height: 1;
          letter-spacing: 2px;
          text-transform: uppercase;
          white-space: nowrap;
          user-select: none;
          pointer-events: none;
        }

        .p3-countdown {
          position: absolute;
          top: 28px;
          left: 30px;
          z-index: 24;
          min-width: min(480px, calc(100vw - 60px));
          padding: 10px 18px 11px;
          border: 1px solid rgba(60, 226, 255, 0.48);
          border-left: 6px solid #3ce2ff;
          background: rgba(0, 0, 0, 0.84);
          box-shadow: 8px 8px 0 rgba(255, 42, 42, 0.72);
          transform: skewX(-6deg);
          font-family: 'Anton', sans-serif;
          pointer-events: none;
          user-select: none;
        }

        .p3-countdown-inner {
          transform: skewX(6deg);
        }

        .p3-countdown-kicker {
          display: block;
          margin-bottom: 5px;
          color: #ffffff;
          font-size: 11px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
        }

        .p3-countdown-clock {
          display: grid;
          grid-template-columns: repeat(4, minmax(52px, 1fr));
          gap: 12px;
        }

        .p3-countdown-unit {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .p3-countdown-unit strong {
          color: #ff2a2a;
          font-size: clamp(25px, 2.25vw, 38px);
          font-style: italic;
          line-height: 0.9;
          letter-spacing: 1px;
        }

        .p3-countdown-unit:last-child strong {
          color: #3ce2ff;
        }

        .p3-countdown-unit span {
          color: rgba(255, 255, 255, 0.62);
          font-size: 9px;
          letter-spacing: 1px;
        }

        .p3-countdown-live {
          color: #ff2a2a;
          font-size: clamp(24px, 3vw, 44px);
          font-style: italic;
          letter-spacing: 2px;
        }

        @media (max-width: 860px) {
          .p3-event-tag {
            top: auto;
            bottom: max(18px, env(safe-area-inset-bottom));
            right: 14px;
            max-width: calc(100vw - 28px);
            padding: 7px 10px 6px;
            border-left-width: 3px;
            font-size: 14px;
            letter-spacing: 1.3px;
          }

          .p3-countdown {
            top: max(12px, env(safe-area-inset-top));
            left: 14px;
            min-width: 0;
            width: calc(100vw - 28px);
            padding: 8px 12px 9px;
            box-shadow: 5px 5px 0 rgba(255, 42, 42, 0.72);
            transform: none;
          }

          .p3-countdown-inner { transform: none; }
          .p3-countdown-kicker { font-size: 9px; letter-spacing: 1.3px; }
          .p3-countdown-clock { gap: 5px; grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .p3-countdown-unit { gap: 2px; }
          .p3-countdown-unit strong { font-size: 23px; }
          .p3-countdown-unit span { font-size: 7px; }

          .p3-stripe { width: 3px; }
          .p3-stripe2 { right: 6px; }
        }

        @media (max-width: 380px) and (max-height: 700px) {
          .p3-overlay { padding-top: 96px; padding-bottom: 48px; }
          .p3-menu { gap: 2px; }
          .p3-row, .p3-skew-wrap { min-height: 44px; }
          .p3-label-base { font-size: 25px !important; }
          .p3-event-tag { display: none; }
          .p3-countdown-unit strong { font-size: 19px; }
        }

        @media (min-width: 761px) and (max-width: 1100px) {
          .p3-menu {
            transform: translateX(-18vw) scale(0.9);
          }
        }
      `}</style>

      <div className="p3-overlay">
        <div className="p3-countdown" role="timer" aria-label="Countdown to the Consumer Health Hackathon">
          <div className="p3-countdown-inner">
            <span className="p3-countdown-kicker">Starts Saturday 25 July · 10:00 GMT</span>
            {countdown.complete ? (
              <div className="p3-countdown-live">Hackathon is live</div>
            ) : (
              <div className="p3-countdown-clock">
                <div className="p3-countdown-unit"><strong>{padCountdown(countdown.days)}</strong><span>DAYS</span></div>
                <div className="p3-countdown-unit"><strong>{padCountdown(countdown.hours)}</strong><span>HRS</span></div>
                <div className="p3-countdown-unit"><strong>{padCountdown(countdown.minutes)}</strong><span>MIN</span></div>
                <div className="p3-countdown-unit"><strong>{padCountdown(countdown.seconds)}</strong><span>SEC</span></div>
              </div>
            )}
          </div>
        </div>
        <div className="p3-event-tag">Consumer Health Hackathon</div>
        <div className="p3-stripe" />
        <div className="p3-stripe2" />

        <nav className="p3-menu">
          {ITEMS.map((item, i) => {
            const isActive = active === i;
            const dist = Math.abs(i - active);
            const opacity = isActive ? 1 : Math.max(0.88, 1 - dist * 0.04);
            const estW = item.label.length * item.fontSize * 0.6 + 80;
            const estH = item.fontSize * 0.94;
            const clipFn = CLIP_SHAPES[i] ?? CLIP_SHAPES[0];

            return (
              <a
                key={item.id}
                href="#"
                className={`p3-row ${isActive ? "active" : ""} ${mounted ? "mounted" : ""}${tutorialActive && item.id === "teams" ? " tutorial-teams-target tutorial-hand-target" : ""}`}
                style={{
                  marginRight: item.offsetX,
                  marginTop: item.offsetY,
                  transitionDelay: mounted ? `${i * 80}ms` : "0ms",
                }}
                onClick={(e) => { e.preventDefault(); onNavigate?.(item.page); }}
                onMouseEnter={() => activate(i)}
                aria-current={isActive ? "page" : undefined}
              >
                <div
                  className="p3-skew-wrap"
                  style={{ transform: `skewX(${item.skew}deg) skewY(${item.skewY}deg)` }}
                >
                  <div
                    className="p3-selection-shape"
                    style={{
                      width: estW,
                      height: estH,
                    }}
                  >
                    <div className="p3-glow" style={{ clipPath: clipFn(estW, estH) }} />
                    <div
                      key={isActive ? `pop-${i}-${animKey}` : `idle-${i}`}
                      className={`p3-shadow-tri${isActive ? ' pop' : ''}`}
                      style={{ clipPath: clipFn(estW, estH) }}
                    />
                    <div className="p3-highlight" style={{ clipPath: clipFn(estW, estH) }} />
                  </div>
                  <div className="p3-label-wrap" style={{ opacity }}>
                    <span className="p3-label-base p3-label-dark" style={{ fontSize: item.fontSize }}>
                      {item.label}
                    </span>
                    <span
                      className="p3-label-base p3-label-bright"
                      style={{
                        fontSize: item.fontSize,
                        clipPath: clipFn(estW, estH),
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </nav>

        <div className={`p3-hint ${mounted ? "mounted" : ""}`}>
          <div className="p3-hint-row"><span className="p3-hint-key">↑↓</span><span>NAVIGATE</span></div>
          <div className="p3-hint-row"><span className="p3-hint-key">↵</span><span>CONFIRM</span></div>
        </div>
      </div>
      {tutorialActive && <TutorialCoach stage="teams" target=".tutorial-teams-target" />}
    </>
  );
}
