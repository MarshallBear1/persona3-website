import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { siAnthropic, siElevenlabs, siVercel, siYcombinator } from "simple-icons";
import VideoBackground from "./VideoBackground";

const ITEMS = [
  { id: "i", badge: "I", title: "EDUCATION", subtitle: "University / Coursework", rank: 3 },
  { id: "ii", badge: "II", title: "SKILLS", subtitle: "Frontend / Design / UI", rank: 4 },
  { id: "iii", badge: "III", title: "PROJECTS", subtitle: "Featured Work", rank: 5 },
  { id: "iv", badge: "IV", title: "EXPERIENCE", subtitle: "Internships / Roles", rank: 2 },
];

const PRIZE_ITEMS = [
  { id: "rank-1", badge: "I", title: "FIRST PLACE", subtitle: "Rank 1", rank: 1 },
  { id: "rank-2", badge: "II", title: "SECOND PLACE", subtitle: "Rank 2", rank: 2 },
  { id: "rank-3", badge: "III", title: "THIRD PLACE", subtitle: "Rank 3", rank: 3 },
];

const MARK_ITEMS = [
  { id: "code", badge: "I", title: "CODE", subtitle: "Functionality / Quality", rank: 1 },
  { id: "design", badge: "II", title: "DESIGN", subtitle: "Experience / Craft", rank: 2 },
  { id: "idea", badge: "III", title: "IDEA", subtitle: "Originality / Impact", rank: 3 },
  { id: "demo", badge: "IV", title: "DEMO", subtitle: "Story / Delivery", rank: 4 },
  { id: "extra", badge: "V", title: "EXTRA POINTS", subtitle: "Ambition / Delight", rank: 5 },
];

const SCHEDULE_ITEMS = [
  { id: "saturday", badge: "SAT", title: "SATURDAY", subtitle: "25 JULY · BUILD DAY", rank: 1 },
  { id: "sunday", badge: "SUN", title: "SUNDAY", subtitle: "26 JULY · DEMO DAY", rank: 2 },
];

const SCHEDULE_DETAILS = [
  {
    date: "SATURDAY 25 JULY",
    label: "BUILD DAY",
    events: [
      { time: "10:00", title: "DOORS OPEN + CHECK-IN", note: "REGISTRATION DESK" },
      { time: "10:30", title: "OPENING BRIEF", note: "RULES, TRACKS + PRIZES" },
      { time: "11:00", title: "TEAM LOCK", note: "FINALISE YOUR SQUAD" },
      { time: "11:15", title: "BUILD STARTS", note: "HACKATHON CLOCK LIVE" },
      { time: "13:00", title: "LUNCH", note: "FOOD + SPONSOR TABLES" },
      { time: "15:00", title: "MENTOR OFFICE HOURS", note: "TECH, DESIGN + CLINICAL" },
      { time: "19:00", title: "DINNER + CHECKPOINT", note: "SHOW WHAT YOU HAVE" },
    ],
  },
  {
    date: "SUNDAY 26 JULY",
    label: "DEMO DAY",
    events: [
      { time: "08:00", title: "BREAKFAST", note: "BUILDERS RECHARGE" },
      { time: "09:00", title: "FINAL MENTOR SPRINT", note: "LAST TECH CHECKS" },
      { time: "12:00", title: "SUBMISSIONS CLOSE", note: "GITHUB + DEMO VIDEO" },
      { time: "12:15", title: "LUNCH + REHEARSAL", note: "PREP YOUR PITCH" },
      { time: "14:00", title: "LIVE DEMOS", note: "JUDGING BEGINS" },
      { time: "16:30", title: "JUDGES DELIBERATE", note: "FINAL SCORING" },
      { time: "17:00", title: "PRIZES + CLOSING", note: "WINNERS ANNOUNCED" },
    ],
  },
];

const MARK_DETAILS = [
  {
    intro: "JUDGES WILL LOOK FOR",
    criteria: ["A WORKING, RELIABLE PRODUCT", "TECHNICAL AMBITION", "CLEAR AND MAINTAINABLE IMPLEMENTATION"],
  },
  {
    intro: "JUDGES WILL LOOK FOR",
    criteria: ["A CLEAR, INTUITIVE EXPERIENCE", "COHESIVE VISUAL CRAFT", "ACCESSIBLE AND THOUGHTFUL INTERACTIONS"],
  },
  {
    intro: "JUDGES WILL LOOK FOR",
    criteria: ["A REAL CONSUMER HEALTH NEED", "ORIGINALITY OF THE APPROACH", "POTENTIAL USER IMPACT"],
  },
  {
    intro: "JUDGES WILL LOOK FOR",
    criteria: ["A SIMPLE, COMPELLING STORY", "A POLISHED LIVE WALKTHROUGH", "A CLEAR EXPLANATION OF THE OUTCOME"],
  },
  {
    intro: "BONUS CREDIT FOR",
    criteria: ["CREATIVE USE OF SPONSOR TOOLS", "SURPRISE AND DELIGHT", "THOUGHTFUL STRETCH FEATURES"],
  },
];

const PRIZE_ICONS = [
  [
    { id: "anthropic", label: "Anthropic", icon: siAnthropic },
    { id: "vercel", label: "Vercel", icon: siVercel },
    { id: "elevenlabs", label: "ElevenLabs", icon: siElevenlabs },
    { id: "yc", label: "Y Combinator", icon: siYcombinator },
  ],
  [
    { id: "anthropic", label: "Anthropic", icon: siAnthropic },
    { id: "monitor", label: "Monitor", monitor: true },
  ],
  [
    { id: "anthropic", label: "Anthropic", icon: siAnthropic },
  ],
];

const EDUCATION_ROWS = [
  { index: "01", title: "General Education", status: "Complete" },
  { index: "02", title: "Computer Science Core", status: "In Progress" },
  { index: "03", title: "Elective Track", status: "Queued" },
  { index: "04", title: "Capstone Prep", status: "Pending" },
];

function PrizeLogo({ prize }) {
  if (prize.monitor) {
    return (
      <svg className="prize-logo-icon" viewBox="0 0 24 24" role="img" aria-label={prize.label}>
        <title>{prize.label}</title>
        <path d="M2.75 3.5h18.5A1.75 1.75 0 0 1 23 5.25v11.5a1.75 1.75 0 0 1-1.75 1.75h-7.5v1.5h3.5v1.5H6.75V20h3.5v-1.5h-7.5A1.75 1.75 0 0 1 1 16.75V5.25A1.75 1.75 0 0 1 2.75 3.5Zm0 1.5a.25.25 0 0 0-.25.25v10.5c0 .14.11.25.25.25h18.5c.14 0 .25-.11.25-.25V5.25a.25.25 0 0 0-.25-.25H2.75Z" />
      </svg>
    );
  }

  return (
    <svg className="prize-logo-icon" viewBox="0 0 24 24" role="img" aria-label={prize.label}>
      <title>{prize.label}</title>
      <path d={prize.icon.path} />
    </svg>
  );
}

export default function ResumePage({ mode = "resume" }) {
  const navigate = useNavigate();
  const isPrizes = mode === "prizes";
  const isMarkScheme = mode === "mark-scheme";
  const isSchedule = mode === "schedule";
  const items = isPrizes ? PRIZE_ITEMS : isMarkScheme ? MARK_ITEMS : isSchedule ? SCHEDULE_ITEMS : ITEMS;
  const maxIndex = items.length - 1;
  const [active, setActive] = useState(() => isPrizes || isMarkScheme || isSchedule ? 0 : 1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp") setActive((i) => Math.max(0, i - 1));
      if (e.key === "ArrowDown") setActive((i) => Math.min(maxIndex, i + 1));
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "Escape" || e.key === "Backspace") navigate(-1);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [maxIndex, navigate]);

  return (
    <div id="menu-screen">
      <VideoBackground />
      <div className="resume-entry-mask" aria-hidden="true" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&display=swap');

        .resume-entry-mask {
          position: absolute;
          inset: 0;
          z-index: 9;
          overflow: hidden;
          background: #0047FF;
          clip-path: circle(0 at 50% 50%);
          animation: resume-entry-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          pointer-events: none;
        }

        @keyframes resume-entry-reveal {
          from { clip-path: circle(0 at 50% 50%); }
          85% { opacity: 1; }
          to { clip-path: circle(150vmax at 50% 50%); opacity: 0; }
        }

        .resume-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
        }

        .resume-stack {
          position: absolute;
          top: 9vh;
          left: 2.8vw;
          width: min(47vw, 720px);
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: none;
          transform: scale(0.9);
          transform-origin: top left;
        }

        .resume-list-tag {
          font-family: 'Anton', sans-serif;
          font-size: 92px;
          line-height: 0.9;
          color: #f6fbff;
          letter-spacing: 2px;
          margin: 0 0 6px 12px;
          text-shadow: 0 2px 0 rgba(0,0,0,0.18);
          opacity: 0;
          transform: translateX(-24px);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .resume-list-tag.mounted {
          opacity: 1;
          transform: translateX(0);
        }

        .resume-list-tag.mark-scheme {
          font-size: clamp(58px, 6.4vw, 92px);
          white-space: nowrap;
        }

        .resume-card-wrap {
          position: relative;
          opacity: 0;
          transform: translateX(-48px);
          transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: all;
          cursor: pointer;
        }
        .resume-card-wrap.mounted {
          opacity: 1;
          transform: translateX(0);
        }

        .resume-card {
          position: relative;
          height: 112px;
          background: #10185f;
          clip-path: polygon(0 0, 97% 0, 100% 100%, 3% 100%);
          box-shadow: 0 8px 0 rgba(5, 13, 59, 0.85);
          transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
          overflow: visible;
        }
        .resume-card-wrap.active .resume-card {
          background: #ffffff;
          box-shadow: 10px 8px 0 #d63232;
          transform: translateX(6px);
        }

        .resume-card-inner {
          position: absolute;
          inset: 0;
          padding: 14px 22px 14px 62px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .resume-badge {
          position: absolute;
          top: 10px;
          left: -10px;
          width: 56px;
          height: 70px;
          background: #0b113d;
          border: 3px solid #9cf7ff;
          clip-path: polygon(14% 0, 100% 0, 84% 100%, 0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(-8deg);
          box-shadow: 0 4px 0 rgba(0,0,0,0.28);
          transition: background 0.22s ease, border-color 0.22s ease;
        }
        .resume-badge-text {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px;
          color: #d2fdff;
          letter-spacing: 1px;
          transform: rotate(8deg);
        }
        .resume-card-wrap.active .resume-badge {
          background: #000;
          border-color: #000;
        }
        .resume-card-wrap.active .resume-badge-text {
          color: #fff;
        }

        .resume-title {
          font-family: 'Anton', sans-serif;
          font-size: 56px;
          line-height: 0.9;
          letter-spacing: 1px;
          color: #a5f6ff;
          transition: color 0.22s ease;
        }
        .resume-card-wrap.active .resume-title {
          color: #000;
        }

        .resume-rank {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .resume-rank-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 2px;
          color: #9ffbff;
          transition: color 0.22s ease;
        }
        .resume-rank-number {
          font-family: 'Anton', sans-serif;
          font-size: 70px;
          line-height: 0.82;
          color: #9ffbff;
          transition: color 0.22s ease;
        }
        .resume-card-wrap.active .resume-rank-label,
        .resume-card-wrap.active .resume-rank-number {
          color: #000;
        }

        .resume-subtitle-bar {
          position: absolute;
          left: 64px;
          right: 14px;
          bottom: 12px;
          height: 34px;
          background: #85f4ff;
          clip-path: polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
          display: flex;
          align-items: center;
          padding: 0 18px;
          transition: background 0.22s ease;
        }
        .resume-card-wrap.active .resume-subtitle-bar {
          background: #000;
        }

        .resume-subtitle {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          line-height: 1;
          letter-spacing: 1px;
          color: #041238;
          transition: color 0.22s ease;
        }
        .resume-card-wrap.active .resume-subtitle {
          color: #fff;
        }

        .resume-detail-panel {
          position: absolute;
          top: 9.5vh;
          right: 4.5vw;
          width: min(39vw, 620px);
          min-height: 74vh;
          z-index: 12;
          padding: 22px 24px 24px 24px;
          background: linear-gradient(180deg, rgba(15, 28, 105, 0.96) 0%, rgba(8, 16, 68, 0.97) 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 18px) 100%, 0 100%);
          box-shadow:
            inset 0 0 0 1px rgba(133, 244, 255, 0.16),
            16px 16px 0 rgba(0, 6, 30, 0.55);
          overflow: hidden;
        }
        .resume-detail-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(135deg, rgba(133, 244, 255, 0.08) 0 15%, transparent 15% 100%),
            linear-gradient(180deg, rgba(255,255,255,0.05), transparent 24%);
          pointer-events: none;
        }
        .resume-detail-top {
          position: relative;
          display: grid;
          grid-template-columns: 70px 1fr auto;
          align-items: center;
          gap: 14px;
          min-height: 92px;
          padding: 0 18px;
          background: linear-gradient(90deg, #8ef5ff 0%, #d3fdff 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
          color: #08153f;
          box-shadow: 10px 0 0 rgba(255, 94, 136, 0.88);
        }
        .resume-detail-top-index {
          font-family: 'Anton', sans-serif;
          font-size: 46px;
          line-height: 1;
        }
        .resume-detail-top-title {
          font-family: 'Anton', sans-serif;
          font-size: 42px;
          line-height: 0.92;
          letter-spacing: 1px;
        }
        .resume-detail-top-progress {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 42px;
          letter-spacing: 2px;
          line-height: 1;
        }
        .resume-detail-list {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 18px;
        }
        .resume-detail-row {
          display: grid;
          grid-template-columns: 50px 1fr auto;
          align-items: center;
          gap: 14px;
          min-height: 56px;
          padding: 0 14px;
          background: rgba(8, 18, 72, 0.96);
          clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(140, 239, 255, 0.12);
          transition: transform 0.16s ease, background 0.16s ease;
        }
        .resume-detail-row:hover {
          transform: translateX(4px);
          background: rgba(12, 26, 94, 1);
        }
        .resume-detail-row-index {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          letter-spacing: 1px;
          color: #94f4ff;
        }
        .resume-detail-row-title {
          font-family: 'Anton', sans-serif;
          font-size: 28px;
          line-height: 1;
          color: #f2fcff;
        }
        .resume-detail-status {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          line-height: 1;
          letter-spacing: 1.1px;
          color: #06133b;
          background: #8df6ff;
          padding: 7px 12px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
        }
        .resume-detail-bottom {
          position: relative;
          margin-top: 22px;
          padding: 18px;
          background: rgba(5, 13, 57, 0.97);
          clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(145, 239, 255, 0.12);
        }
        .resume-detail-bottom-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 30px;
          letter-spacing: 2px;
          color: #91f5ff;
          margin-bottom: 14px;
        }
        .resume-detail-bullets {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .resume-detail-bullet {
          font-family: 'Anton', sans-serif;
          font-size: 21px;
          line-height: 1.15;
          color: #edfaff;
        }

        .prize-logo-grid {
          position: relative;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin-top: 22px;
        }

        .prize-logo-grid.single {
          grid-template-columns: 1fr;
        }

        .prize-logo-card {
          min-height: 154px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          background: rgba(5, 13, 57, 0.97);
          clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(145, 239, 255, 0.22);
          transition: transform 0.18s ease, color 0.18s ease, background 0.18s ease;
        }

        .prize-logo-grid.single .prize-logo-card {
          min-height: 330px;
        }

        .prize-logo-card:hover {
          color: #8ef5ff;
          background: rgba(12, 26, 94, 1);
          transform: translateY(-4px);
        }

        .prize-logo-icon {
          width: min(84px, 55%);
          height: min(84px, 55%);
          fill: currentColor;
        }

        .mark-detail-intro {
          position: relative;
          margin: 22px 0 14px;
          color: #8ef5ff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 3px;
        }

        .mark-criteria {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 14px;
          counter-reset: mark-criterion;
        }

        .mark-criterion {
          counter-increment: mark-criterion;
          min-height: 104px;
          display: grid;
          grid-template-columns: 62px 1fr;
          align-items: center;
          gap: 18px;
          padding: 14px 20px;
          color: #ffffff;
          background: rgba(5, 13, 57, 0.97);
          clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(145, 239, 255, 0.2);
          font-family: 'Anton', sans-serif;
          font-size: clamp(20px, 2vw, 29px);
          line-height: 1.05;
        }

        .mark-criterion::before {
          content: counter(mark-criterion, decimal-leading-zero);
          color: #ff2a2a;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 40px;
        }

        .resume-stack.schedule {
          top: 15vh;
          width: min(45vw, 690px);
          gap: 18px;
        }

        .resume-list-tag.schedule {
          font-size: clamp(62px, 7vw, 100px);
          white-space: nowrap;
        }

        .resume-card-wrap.schedule .resume-card {
          height: 142px;
        }

        .resume-card-wrap.schedule .resume-card-inner {
          padding-top: 20px;
        }

        .resume-card-wrap.schedule .resume-badge {
          width: 72px;
          height: 82px;
          left: -14px;
        }

        .resume-card-wrap.schedule .resume-badge-text {
          font-size: 28px;
        }

        .resume-card-wrap.schedule .resume-title {
          font-size: clamp(48px, 5vw, 68px);
        }

        .schedule-detail-panel {
          top: 5vh;
          min-height: 90vh;
          padding: 18px 22px 20px;
        }

        .schedule-detail-panel .resume-detail-top {
          min-height: 82px;
        }

        .schedule-detail-panel .resume-detail-top-title {
          font-size: clamp(30px, 3vw, 42px);
        }

        .schedule-timezone {
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 14px 2px 9px;
          color: #8ef5ff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          letter-spacing: 2.4px;
        }

        .schedule-timezone strong {
          color: #ffffff;
          font-weight: 400;
        }

        .schedule-agenda {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .schedule-event {
          min-height: 54px;
          display: grid;
          grid-template-columns: 76px 1fr;
          align-items: center;
          gap: 14px;
          padding: 7px 14px;
          background: rgba(5, 13, 57, 0.96);
          clip-path: polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(145, 239, 255, 0.16);
          transition: transform 160ms ease, background 160ms ease;
        }

        .schedule-event:hover {
          background: rgba(12, 26, 94, 1);
          transform: translateX(4px);
        }

        .schedule-event-time {
          color: #07143f;
          background: #8ef5ff;
          padding: 7px 8px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 1px;
          text-align: center;
          clip-path: polygon(0 0, 100% 0, calc(100% - 7px) 100%, 0 100%);
        }

        .schedule-event-title {
          display: block;
          color: #ffffff;
          font-family: 'Anton', sans-serif;
          font-size: 21px;
          line-height: 1;
        }

        .schedule-event-note {
          display: block;
          margin-top: 4px;
          color: rgba(255, 255, 255, 0.54);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 12px;
          letter-spacing: 1.6px;
        }

        @media (max-width: 700px) {
          .resume-overlay {
            overflow-x: hidden;
            overflow-y: auto;
            padding: max(18px, env(safe-area-inset-top)) 12px max(72px, env(safe-area-inset-bottom));
            pointer-events: auto;
            -webkit-overflow-scrolling: touch;
          }

          .resume-stack,
          .resume-stack.schedule {
            position: relative;
            top: auto;
            left: auto;
            width: 100%;
            gap: 8px;
            transform: none;
            pointer-events: auto;
          }

          .resume-list-tag,
          .resume-list-tag.mark-scheme,
          .resume-list-tag.schedule {
            margin: 0 0 8px 5px;
            font-size: clamp(43px, 14vw, 60px);
            line-height: 0.9;
            white-space: normal;
          }

          .resume-card-wrap {
            width: 100%;
            min-height: 78px;
          }

          .resume-card,
          .resume-card-wrap.schedule .resume-card {
            height: 88px;
            clip-path: polygon(0 0, 98% 0, 100% 100%, 2% 100%);
          }

          .resume-card-wrap.active .resume-card {
            box-shadow: 6px 6px 0 #d63232;
            transform: translateX(2px);
          }

          .resume-card-inner,
          .resume-card-wrap.schedule .resume-card-inner {
            padding: 11px 12px 11px 52px;
          }

          .resume-badge,
          .resume-card-wrap.schedule .resume-badge {
            top: 8px;
            left: -4px;
            width: 48px;
            height: 56px;
          }

          .resume-badge-text,
          .resume-card-wrap.schedule .resume-badge-text {
            font-size: 25px;
          }

          .resume-title,
          .resume-card-wrap.schedule .resume-title {
            max-width: 72%;
            overflow: hidden;
            font-size: clamp(29px, 8.5vw, 39px);
            line-height: 0.94;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .resume-rank { gap: 5px; }
          .resume-rank-label { font-size: 14px; letter-spacing: 1px; }
          .resume-rank-number { font-size: 42px; }

          .resume-subtitle-bar {
            left: 52px;
            right: 8px;
            bottom: 8px;
            height: 25px;
            padding: 0 10px;
          }

          .resume-subtitle {
            max-width: 100%;
            overflow: hidden;
            font-size: 17px;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .resume-detail-panel,
          .schedule-detail-panel {
            position: relative;
            top: auto;
            right: auto;
            width: 100%;
            min-height: 0;
            margin: 20px 0 0;
            padding: 14px 14px 20px;
            overflow: visible;
            box-shadow: 7px 7px 0 rgba(0, 6, 30, 0.55);
          }

          .resume-detail-top,
          .schedule-detail-panel .resume-detail-top {
            min-height: 66px;
            grid-template-columns: 42px minmax(0, 1fr) auto;
            gap: 8px;
            padding: 8px 11px;
            box-shadow: 6px 0 0 rgba(255, 94, 136, 0.88);
          }

          .resume-detail-top-index { font-size: 30px; }
          .resume-detail-top-title,
          .schedule-detail-panel .resume-detail-top-title {
            overflow-wrap: anywhere;
            font-size: clamp(22px, 7vw, 31px);
          }
          .resume-detail-top-progress { font-size: 24px; }

          .prize-logo-grid { gap: 9px; margin-top: 14px; }
          .prize-logo-card { min-height: 112px; }
          .prize-logo-grid.single .prize-logo-card { min-height: 180px; }
          .prize-logo-icon { width: 58px; height: 58px; }

          .mark-detail-intro { margin: 16px 0 10px; font-size: 16px; }
          .mark-criteria { gap: 9px; }
          .mark-criterion {
            min-height: 74px;
            grid-template-columns: 42px 1fr;
            gap: 8px;
            padding: 10px 12px;
            font-size: 19px;
          }
          .mark-criterion::before { font-size: 28px; }

          .schedule-timezone {
            gap: 8px;
            margin-top: 12px;
            font-size: 13px;
            letter-spacing: 1.3px;
          }

          .schedule-agenda { gap: 8px; }
          .schedule-event {
            min-height: 68px;
            grid-template-columns: 64px 1fr;
            gap: 10px;
            padding: 8px 10px;
          }
          .schedule-event-time { padding: 7px 5px; font-size: 19px; }
          .schedule-event-title { font-size: 18px; }
          .schedule-event-note { font-size: 10px; letter-spacing: 1px; }

          .resume-detail-row {
            grid-template-columns: 38px 1fr;
            min-height: 64px;
            gap: 8px;
            padding: 8px 10px;
          }
          .resume-detail-row-title { font-size: 21px; }
          .resume-detail-status { grid-column: 2; width: fit-content; font-size: 16px; }
        }

      `}</style>

      <div className="resume-overlay">
        <div className={`resume-stack${isSchedule ? " schedule" : ""}`}>
          <div className={`resume-list-tag${isMarkScheme ? " mark-scheme" : ""}${isSchedule ? " schedule" : ""}${mounted ? " mounted" : ""}`}>
            {isMarkScheme ? "MARK SCHEME" : isSchedule ? "SCHEDULE" : "LIST"}
          </div>
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`resume-card-wrap${isSchedule ? " schedule" : ""}${active === index ? " active" : ""}${mounted ? " mounted" : ""}`}
              style={{ transitionDelay: `${index * 55}ms` }}
              onMouseEnter={() => {
                setActive(index);
              }}
              onClick={() => {
                setActive(index);
              }}
            >
              <div className="resume-card">
                <div className="resume-badge">
                  <div className="resume-badge-text">{item.badge}</div>
                </div>
                <div className="resume-card-inner">
                  <div className="resume-title">{item.title}</div>
                  <div className="resume-rank">
                    <div className="resume-rank-label">{isSchedule ? "DAY" : "RANK"}</div>
                    <div className="resume-rank-number">{item.rank}</div>
                  </div>
                </div>
                <div className="resume-subtitle-bar">
                  <div className="resume-subtitle">{item.subtitle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isPrizes && (
          <div className="resume-detail-panel">
            <div className="resume-detail-top">
              <div className="resume-detail-top-index">{String(active + 1).padStart(2, "0")}</div>
              <div className="resume-detail-top-title">RANK {active + 1}</div>
              <div className="resume-detail-top-progress">{active + 1}/3</div>
            </div>

            <div className={`prize-logo-grid${PRIZE_ICONS[active].length === 1 ? " single" : ""}`}>
              {PRIZE_ICONS[active].map((prize) => (
                <div className="prize-logo-card" key={prize.id}>
                  <PrizeLogo prize={prize} />
                </div>
              ))}
            </div>
          </div>
        )}

        {isMarkScheme && (
          <div className="resume-detail-panel">
            <div className="resume-detail-top">
              <div className="resume-detail-top-index">{String(active + 1).padStart(2, "0")}</div>
              <div className="resume-detail-top-title">{MARK_ITEMS[active].title}</div>
              <div className="resume-detail-top-progress">{active + 1}/5</div>
            </div>

            <div className="mark-detail-intro">{MARK_DETAILS[active].intro}</div>
            <div className="mark-criteria">
              {MARK_DETAILS[active].criteria.map((criterion) => (
                <div className="mark-criterion" key={criterion}>{criterion}</div>
              ))}
            </div>
          </div>
        )}

        {isSchedule && (
          <div className="resume-detail-panel schedule-detail-panel">
            <div className="resume-detail-top">
              <div className="resume-detail-top-index">{String(active + 1).padStart(2, "0")}</div>
              <div className="resume-detail-top-title">{SCHEDULE_DETAILS[active].date}</div>
              <div className="resume-detail-top-progress">{active + 1}/2</div>
            </div>

            <div className="schedule-timezone">
              <span>{SCHEDULE_DETAILS[active].label}</span>
              <strong>ALL TIMES GMT</strong>
            </div>

            <div className="schedule-agenda">
              {SCHEDULE_DETAILS[active].events.map((event) => (
                <div className="schedule-event" key={`${event.time}-${event.title}`}>
                  <time className="schedule-event-time">{event.time}</time>
                  <div>
                    <span className="schedule-event-title">{event.title}</span>
                    <span className="schedule-event-note">{event.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isPrizes && !isMarkScheme && !isSchedule && active === 0 && (
          <div className="resume-detail-panel">
            <div className="resume-detail-top">
              <div className="resume-detail-top-index">01</div>
              <div className="resume-detail-top-title">EDUCATION LOG</div>
              <div className="resume-detail-top-progress">7/5</div>
            </div>

            <div className="resume-detail-list">
              {EDUCATION_ROWS.map((row) => (
                <div className="resume-detail-row" key={row.index}>
                  <div className="resume-detail-row-index">{row.index}</div>
                  <div className="resume-detail-row-title">{row.title}</div>
                  <div className="resume-detail-status">{row.status}</div>
                </div>
              ))}
            </div>

            <div className="resume-detail-bottom">
              <div className="resume-detail-bottom-title">DETAILS</div>
              <div className="resume-detail-bullets">
                <div className="resume-detail-bullet">- Maintain progress across required classes and supporting work.</div>
                <div className="resume-detail-bullet">- Track portfolio-ready projects tied to coursework and labs.</div>
                <div className="resume-detail-bullet">- Keep materials prepared for internships, research, and review.</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
