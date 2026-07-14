import { Joyride } from "react-joyride";

const COPY = {
  teams: {
    step: "STEP 01",
    title: "OPEN TEAMS",
    body: "Every player starts by choosing a class. Click TEAMS to begin.",
  },
  player: {
    step: "STEP 02",
    title: "CREATE YOUR PLAYER",
    body: "This is your first quest. Click CREATE A PLAYER to choose your role.",
  },
};

function CoachTooltip({ step, tooltipProps }) {
  const copy = step.data;

  return (
    <div {...tooltipProps} className="tutorial-coach-tooltip">
      <span className="tutorial-coach-step">{copy.step}</span>
      <strong>{copy.title}</strong>
      <p>{copy.body}</p>
      <span className="tutorial-coach-command">CLICK THE HIGHLIGHTED BUTTON</span>
    </div>
  );
}

export default function TutorialCoach({ stage, target }) {
  const copy = COPY[stage];
  if (!copy) return null;

  return (
    <>
      <style>{`
        @keyframes tutorial-hand-bob {
          0%, 100% { transform: translate(0, -50%) rotate(-8deg) scale(1); }
          50% { transform: translate(-8px, -50%) rotate(-8deg) scale(1.08); }
        }

        @keyframes tutorial-target-pulse {
          0%, 100% { filter: drop-shadow(0 0 0 rgba(142, 245, 255, 0)); }
          50% { filter: drop-shadow(0 0 16px rgba(142, 245, 255, 0.95)); }
        }

        .tutorial-hand-target {
          position: relative !important;
          animation: tutorial-target-pulse 1.15s ease-in-out infinite !important;
        }

        .tutorial-hand-target::after {
          content: "👈";
          position: absolute;
          right: 12px;
          left: auto;
          top: 50%;
          z-index: 100005;
          display: block;
          font-size: clamp(38px, 4vw, 58px);
          line-height: 1;
          filter: drop-shadow(6px 7px 0 rgba(5, 13, 57, 0.92));
          transform-origin: center;
          animation: tutorial-hand-bob 0.72s ease-in-out infinite;
          pointer-events: none;
        }

        .tutorial-coach-tooltip {
          position: relative;
          width: min(360px, calc(100vw - 32px));
          padding: 20px 22px 18px;
          border: 4px solid #8ef5ff;
          color: #ffffff;
          background: #07143f;
          box-shadow: 10px 10px 0 #ff2a2a;
          clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
          font-family: 'Bebas Neue', sans-serif;
        }

        .tutorial-coach-tooltip::before {
          content: "";
          position: absolute;
          top: 50%;
          left: -18px;
          border-top: 15px solid transparent;
          border-bottom: 15px solid transparent;
          border-right: 18px solid #8ef5ff;
          transform: translateY(-50%);
        }

        .tutorial-coach-step {
          display: inline-block;
          margin-bottom: 9px;
          padding: 5px 8px;
          color: #07143f;
          background: #8ef5ff;
          font-size: 14px;
          letter-spacing: 2px;
        }

        .tutorial-coach-tooltip strong {
          display: block;
          font-family: 'Anton', sans-serif;
          font-size: 31px;
          font-style: italic;
          line-height: 1;
        }

        .tutorial-coach-tooltip p {
          margin: 9px 0 13px;
          color: rgba(255, 255, 255, 0.78);
          font-size: 18px;
          letter-spacing: 0.8px;
          line-height: 1.2;
        }

        .tutorial-coach-command {
          color: #ff7788;
          font-size: 12px;
          letter-spacing: 2px;
        }
      `}</style>

      <Joyride
        run
        steps={[
          {
            id: stage,
            target,
            content: copy.body,
            data: copy,
            placement: "right",
            skipBeacon: true,
          },
        ]}
        options={{
          blockTargetInteraction: false,
          dismissKeyAction: false,
          overlayClickAction: false,
          overlayColor: "rgba(0, 3, 18, 0.76)",
          spotlightPadding: 8,
          spotlightRadius: 8,
          zIndex: 100000,
        }}
        tooltipComponent={CoachTooltip}
      />
    </>
  );
}
