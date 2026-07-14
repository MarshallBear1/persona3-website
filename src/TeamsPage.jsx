import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import roleEngineer from "./assets/role-engineer.png";
import roleArtist from "./assets/role-artist.png";
import roleCreator from "./assets/role-creator.png";
import roleClinician from "./assets/role-clinician.png";
import VideoBackground from "./VideoBackground";
import TutorialCoach from "./TutorialCoach";

const PLAYER_ROLES = [
  { id: "engineer", name: "ENGINEER", subtitle: "CODE BUILDER", image: roleEngineer, ability: "SHIP MODE", stats: { BUILD: 95, DESIGN: 55, HEALTH: 45 } },
  { id: "artist", name: "ARTIST", subtitle: "VISUAL MAKER", image: roleArtist, ability: "PIXEL PERFECT", stats: { BUILD: 45, DESIGN: 98, HEALTH: 55 } },
  { id: "creator", name: "CREATOR", subtitle: "IDEA ARCHITECT", image: roleCreator, ability: "BIG PICTURE", stats: { BUILD: 70, DESIGN: 80, HEALTH: 60 } },
  { id: "clinician", name: "CLINICIAN", subtitle: "HEALTH EXPERT", image: roleClinician, ability: "REAL-WORLD CHECK", stats: { BUILD: 45, DESIGN: 60, HEALTH: 99 } },
];

const PLAYER_ACCESS_CODE = "HEALTH25";

const TABS = [
  { id: "player", label: "CREATE A PLAYER", number: "01" },
  { id: "register", label: "CREATE A TEAM", number: "02" },
  { id: "find", label: "FIND A TEAM", number: "03" },
  { id: "mine", label: "MY TEAM", number: "05" },
];

function ActionMessage({ children }) {
  return <div className="teams-action-message" role="status">{children}</div>;
}

export default function TeamsPage({ tutorialActive = false, onTutorialComplete }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [teamAccess, setTeamAccess] = useState("public");
  const [message, setMessage] = useState("");
  const [myTeam, setMyTeam] = useState(null);
  const [playerProfile, setPlayerProfile] = useState(null);
  const [selectedRole, setSelectedRole] = useState(PLAYER_ROLES[0].id);
  const [tutorialCompleteNotice, setTutorialCompleteNotice] = useState(false);
  const roleCarouselRef = useRef(null);
  const selectedRoleIndex = Math.max(0, PLAYER_ROLES.findIndex((role) => role.id === selectedRole));
  const selectedRoleData = PLAYER_ROLES[selectedRoleIndex];

  const stepRole = useCallback((direction) => {
    const nextIndex = (selectedRoleIndex + direction + PLAYER_ROLES.length) % PLAYER_ROLES.length;
    setSelectedRole(PLAYER_ROLES[nextIndex].id);
  }, [selectedRoleIndex]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!tutorialCompleteNotice) return undefined;
    const timer = window.setTimeout(() => setTutorialCompleteNotice(false), 2400);
    return () => window.clearTimeout(timer);
  }, [tutorialCompleteNotice]);

  useEffect(() => {
    const onKey = (event) => {
      const isFormControl = ["INPUT", "TEXTAREA", "SELECT"].includes(event.target?.tagName);
      if (isFormControl) return;

      if (event.key === "ArrowUp") {
        setMessage("");
        setActive((index) => Math.max(0, index - 1));
      }
      if (event.key === "ArrowDown") {
        setMessage("");
        setActive((index) => Math.min(TABS.length - 1, index + 1));
      }
      if (active === 0 && !playerProfile && event.key === "ArrowLeft") stepRole(-1);
      if (active === 0 && !playerProfile && event.key === "ArrowRight") stepRole(1);
      if (event.key === "Escape" || event.key === "Backspace" || (event.key === "ArrowLeft" && active !== 0)) navigate(-1);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, navigate, playerProfile, stepRole]);

  useEffect(() => {
    const selectedCard = roleCarouselRef.current?.querySelector(`[data-role="${selectedRole}"]`);
    selectedCard?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [selectedRole]);

  const selectTab = (index) => {
    setActive(index);
    setMessage("");
  };

  const handleRegister = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setMyTeam({
      name: String(data.get("teamName") || "MY TEAM").toUpperCase(),
      email: String(data.get("email") || "TEAM LEAD"),
      size: String(data.get("size") || "1"),
      focus: String(data.get("focus") || "CONSUMER HEALTH").toUpperCase(),
      teammates: String(data.get("teammates") || "")
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean),
    });
    setMessage("TEAM CREATED — VIEW IT IN MY TEAM");
  };

  const handleCreatePlayer = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const accessCode = String(data.get("accessCode") || "").trim().toUpperCase();

    if (accessCode !== PLAYER_ACCESS_CODE) {
      setMessage("ACCESS DENIED — ENTER THE ACCESS CODE FROM YOUR HACKATHON INVITE");
      return;
    }

    const role = PLAYER_ROLES.find((item) => item.id === selectedRole) || PLAYER_ROLES[0];
    setPlayerProfile({
      name: String(data.get("playerName") || "PLAYER").toUpperCase(),
      email: String(data.get("playerEmail") || ""),
      role: role.name,
      roleSubtitle: role.subtitle,
      image: role.image,
      skills: String(data.get("skills") || "READY TO BUILD").toUpperCase(),
      lookingFor: String(data.get("lookingFor") || "A GREAT TEAM").toUpperCase(),
    });
    setMessage("ACCOUNT UNLOCKED — PLAYER 1 CAN NOW CREATE OR JOIN A TEAM");
  };

  const handleFind = (event) => {
    event.preventDefault();
    setMessage(teamAccess === "private" ? "PRIVATE TEAM CODE SUBMITTED" : "PUBLIC TEAM MATCH REQUESTED");
  };

  const handleSubmission = (event) => {
    event.preventDefault();
    setMessage("SUBMISSION SENT — YOU CAN UPDATE IT UNTIL THE DEADLINE");
  };

  const roster = myTeam
    ? Array.from({ length: 4 }, (_, index) => {
        if (index === 0) return { role: "TEAM LEAD", name: myTeam.email };
        const teammate = myTeam.teammates[index - 1];
        return teammate
          ? { role: `TEAMMATE ${String(index + 1).padStart(2, "0")}`, name: teammate }
          : { role: `TEAMMATE ${String(index + 1).padStart(2, "0")}`, name: "OPEN SLOT", open: true };
      })
    : [];
  const memberCount = myTeam ? Math.min(4, 1 + myTeam.teammates.length) : 0;

  return (
    <div id="menu-screen">
      <VideoBackground />

      <style>{`
        .teams-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          color: #ffffff;
          font-family: 'Anton', sans-serif;
        }

        .teams-nav {
          position: absolute;
          top: 15vh;
          left: 3.5vw;
          width: min(36vw, 560px);
          display: flex;
          flex-direction: column;
          gap: 13px;
        }

        .teams-title {
          margin: 0 0 10px;
          font-size: clamp(54px, 7vw, 104px);
          font-style: italic;
          line-height: 0.82;
          letter-spacing: 1px;
          text-shadow: 8px 8px 0 rgba(0, 0, 0, 0.72);
        }

        .teams-tab {
          min-height: 92px;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          padding: 12px 28px 12px 24px;
          border: 0;
          color: #a7a7a7;
          background: rgba(13, 24, 86, 0.96);
          clip-path: polygon(0 0, 100% 0, calc(100% - 20px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(142, 245, 255, 0.16);
          cursor: pointer;
          opacity: 0;
          transform: translateX(-70px);
          transition: opacity 0.42s ease, transform 0.42s cubic-bezier(0.22, 1, 0.36, 1), color 0.18s ease, background 0.18s ease;
        }

        .teams-tab.mounted {
          opacity: 1;
          transform: translateX(0);
        }

        .teams-tab.active {
          color: #07143f;
          background: linear-gradient(90deg, #8ef5ff 0%, #ffffff 100%);
          box-shadow: 12px 10px 0 rgba(255, 42, 42, 0.82);
        }

        .teams-tab-label {
          font-size: clamp(30px, 3.4vw, 52px);
          font-style: italic;
          line-height: 0.9;
          text-align: left;
        }

        .teams-tab-number {
          color: rgba(255, 255, 255, 0.4);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px;
        }

        .teams-tab.active .teams-tab-number {
          color: #07143f;
        }

        .teams-panel {
          position: absolute;
          top: 7vh;
          right: 3.8vw;
          width: min(53vw, 780px);
          height: 86vh;
          padding: 24px 28px 28px;
          background: linear-gradient(180deg, rgba(15, 28, 105, 0.97), rgba(5, 13, 57, 0.98));
          clip-path: polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%);
          box-shadow: 16px 16px 0 rgba(0, 6, 30, 0.58);
          overflow-y: auto;
          box-sizing: border-box;
          scrollbar-width: none;
        }

        .teams-panel::-webkit-scrollbar { display: none; }

        .teams-panel.my-team-panel {
          top: 4vh;
          height: 92vh;
          padding: 18px 28px 20px;
        }

        .teams-panel.my-team-panel .teams-panel-header {
          min-height: 74px;
        }

        .teams-panel.my-team-panel .teams-panel-subtitle {
          margin: 10px 0 8px;
        }

        .teams-panel.my-team-panel .teams-my-summary {
          padding: 12px 18px;
        }

        .teams-panel.my-team-panel .teams-my-name {
          font-size: clamp(32px, 3.6vw, 52px);
        }

        .teams-panel.my-team-panel .teams-workspace-title {
          margin: 10px 0 6px;
        }

        .teams-panel.my-team-panel .teams-member {
          min-height: 58px;
          padding: 7px 11px;
        }

        .teams-panel.player-panel {
          top: 3.5vh;
          height: 93vh;
          padding: 18px 28px 20px;
        }

        .teams-panel.player-panel .teams-panel-header {
          min-height: 74px;
        }

        .teams-panel.player-panel .teams-panel-subtitle {
          margin: 10px 0 8px;
        }

        .teams-panel-header {
          min-height: 88px;
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 12px 20px;
          color: #07143f;
          background: linear-gradient(90deg, #8ef5ff, #ffffff);
          clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
          box-shadow: 10px 0 0 rgba(255, 42, 42, 0.88);
        }

        .teams-panel-index {
          color: #ff2a2a;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 44px;
        }

        .teams-panel-heading {
          margin: 0;
          font-size: clamp(34px, 4vw, 58px);
          font-style: italic;
          line-height: 0.9;
        }

        .teams-panel-subtitle {
          margin: 18px 0 14px;
          color: #8ef5ff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 2px;
        }

        .teams-form {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .teams-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .teams-field.wide {
          grid-column: 1 / -1;
        }

        .teams-field span,
        .teams-section-label {
          color: rgba(255, 255, 255, 0.68);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px;
          letter-spacing: 2px;
        }

        .teams-input,
        .teams-select {
          width: 100%;
          min-height: 54px;
          padding: 0 16px;
          border: 1px solid rgba(142, 245, 255, 0.28);
          border-radius: 0;
          outline: none;
          color: #ffffff;
          background: rgba(4, 12, 53, 0.9);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 21px;
          letter-spacing: 1px;
        }

        .teams-input:focus,
        .teams-select:focus {
          border-color: #8ef5ff;
          box-shadow: 5px 5px 0 rgba(255, 42, 42, 0.66);
        }

        .teams-access-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 18px;
        }

        .teams-access {
          min-height: 92px;
          padding: 12px 16px;
          border: 1px solid rgba(142, 245, 255, 0.2);
          color: #a7a7a7;
          background: rgba(4, 12, 53, 0.9);
          cursor: pointer;
          text-align: left;
        }

        .teams-access.active {
          border-color: #8ef5ff;
          color: #07143f;
          background: #8ef5ff;
          box-shadow: 7px 7px 0 rgba(255, 42, 42, 0.78);
        }

        .teams-access-title {
          display: block;
          font-family: 'Anton', sans-serif;
          font-size: 25px;
          font-style: italic;
        }

        .teams-access-copy {
          display: block;
          margin-top: 4px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px;
          letter-spacing: 1px;
        }

        .teams-cta {
          grid-column: 1 / -1;
          min-height: 58px;
          padding: 10px 20px;
          border: 0;
          color: #07143f;
          background: #ffffff;
          clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
          box-shadow: 8px 8px 0 #ff2a2a;
          cursor: pointer;
          font-family: 'Anton', sans-serif;
          font-size: 26px;
          font-style: italic;
          text-align: left;
        }

        .teams-cta:hover,
        .teams-cta:focus-visible {
          color: #07143f;
          background: #8ef5ff;
        }

        .teams-action-message {
          margin-top: 18px;
          padding: 12px 14px;
          border-left: 5px solid #3ce2ff;
          color: #ffffff;
          background: rgba(0, 0, 0, 0.34);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 2px;
        }

        .teams-player-card {
          min-height: 310px;
          display: grid;
          place-items: center;
          padding: 28px;
          border: 1px solid rgba(142, 245, 255, 0.24);
          background: rgba(4, 12, 53, 0.9);
          text-align: center;
          overflow: hidden;
        }

        .teams-player-card-content {
          display: grid;
          grid-template-columns: 220px 1fr;
          align-items: center;
          gap: 24px;
          text-align: left;
        }

        .teams-player-avatar {
          width: 220px;
          height: 340px;
          object-fit: contain;
          filter: none;
          transform: scale(1.45);
        }

        .teams-player-ready {
          color: #8ef5ff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 17px;
          letter-spacing: 3px;
        }

        .teams-player-name {
          display: block;
          margin-top: 10px;
          font-size: clamp(42px, 5vw, 72px);
          font-style: italic;
          line-height: 0.9;
        }

        .teams-player-role {
          display: inline-block;
          margin: 14px 0 10px;
          padding: 8px 14px;
          color: #07143f;
          background: #8ef5ff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 2px;
        }

        .teams-player-details {
          color: rgba(255, 255, 255, 0.72);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 17px;
          letter-spacing: 1px;
          line-height: 1.5;
        }

        .teams-character-scene {
          position: relative;
          height: 316px;
          display: grid;
          grid-template-columns: 1fr 260px 1fr;
          align-items: center;
          overflow: hidden;
          border: 1px solid rgba(142, 245, 255, 0.28);
          background:
            radial-gradient(circle at 50% 70%, rgba(0, 210, 255, 0.28), transparent 32%),
            linear-gradient(90deg, rgba(4, 12, 53, 0.98), rgba(20, 43, 116, 0.72) 50%, rgba(4, 12, 53, 0.98)),
            repeating-linear-gradient(0deg, transparent 0 27px, rgba(142, 245, 255, 0.07) 28px 29px);
          clip-path: polygon(0 0, 100% 0, calc(100% - 18px) 100%, 0 100%);
        }

        .teams-character-scene::before {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -82px;
          width: 330px;
          height: 170px;
          border: 2px solid rgba(142, 245, 255, 0.42);
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(142, 245, 255, 0.28), transparent 68%);
          transform: translateX(-50%);
        }

        .teams-character-scene::after {
          content: "PLAYER 01 // CLASS SELECT";
          position: absolute;
          top: 12px;
          left: 16px;
          color: rgba(142, 245, 255, 0.56);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 12px;
          letter-spacing: 2.6px;
        }

        .teams-character-copy {
          position: relative;
          z-index: 2;
          align-self: center;
          padding: 38px 0 0 22px;
        }

        .teams-character-kicker {
          display: block;
          color: #ff2a2a;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px;
          letter-spacing: 3px;
        }

        .teams-character-name {
          display: block;
          margin-top: 3px;
          font-size: clamp(30px, 3.5vw, 50px);
          font-style: italic;
          line-height: 0.9;
          text-shadow: 5px 5px 0 rgba(0, 0, 0, 0.56);
        }

        .teams-character-subtitle {
          display: block;
          margin-top: 7px;
          color: #8ef5ff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          letter-spacing: 2px;
        }

        .teams-character-ability {
          display: inline-block;
          margin-top: 15px;
          padding: 7px 10px;
          color: #07143f;
          background: #ffffff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 13px;
          letter-spacing: 1.6px;
          box-shadow: 5px 5px 0 #ff2a2a;
        }

        @keyframes teams-character-enter {
          from { opacity: 0; transform: translateY(24px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .teams-character-slot {
          position: relative;
          z-index: 2;
          width: 260px;
          height: 316px;
          align-self: end;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .teams-character-hero {
          width: 252px;
          height: 312px;
          object-fit: contain;
          filter: none;
          transform-origin: center bottom;
          animation: teams-character-enter 340ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .teams-character-p1 {
          position: absolute;
          right: 4px;
          top: 42px;
          z-index: 4;
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          color: #07143f;
          background: #8ef5ff;
          border-radius: 50%;
          box-shadow: 4px 4px 0 #ff2a2a;
          font-family: 'Anton', sans-serif;
          font-size: 16px;
        }

        .teams-character-hud {
          position: relative;
          z-index: 3;
          align-self: center;
          padding: 42px 24px 0 8px;
        }

        .teams-character-controls {
          display: flex;
          justify-content: flex-start;
          gap: 9px;
          margin-bottom: 20px;
        }

        .teams-character-arrow {
          width: 52px;
          height: 52px;
          border: 1px solid rgba(142, 245, 255, 0.55);
          color: #07143f;
          background: #8ef5ff;
          cursor: pointer;
          font-family: 'Anton', sans-serif;
          font-size: 26px;
          transition: transform 160ms ease, background 160ms ease;
        }

        .teams-character-arrow:hover,
        .teams-character-arrow:focus-visible {
          background: #ffffff;
          transform: translateY(-3px);
        }

        .teams-character-stats {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .teams-character-stat {
          display: grid;
          grid-template-columns: 48px 1fr;
          align-items: center;
          gap: 8px;
        }

        .teams-character-stat-label {
          color: rgba(255, 255, 255, 0.68);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 11px;
          letter-spacing: 1.2px;
        }

        .teams-character-stat-track {
          height: 7px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.12);
          transform: skewX(-12deg);
        }

        .teams-character-stat-fill {
          display: block;
          height: 100%;
          background: linear-gradient(90deg, #8ef5ff, #ffffff);
          box-shadow: 0 0 12px rgba(142, 245, 255, 0.75);
          transition: width 280ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .teams-role-carousel-wrap {
          position: relative;
          margin: 9px 0 12px;
        }

        .teams-role-carousel-wrap::after {
          content: "SWIPE / USE ARROWS";
          position: absolute;
          right: 8px;
          top: -20px;
          color: rgba(255, 255, 255, 0.44);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 11px;
          letter-spacing: 1.8px;
        }

        .teams-role-carousel {
          display: flex;
          gap: 9px;
          overflow-x: auto;
          padding: 0 8px 9px 0;
          scroll-behavior: smooth;
          scroll-snap-type: x mandatory;
          scrollbar-color: #8ef5ff rgba(4, 12, 53, 0.72);
          scrollbar-width: thin;
        }

        .teams-role-card {
          position: relative;
          flex: 0 0 174px;
          height: 92px;
          display: grid;
          grid-template-columns: 66px 1fr;
          align-items: center;
          overflow: hidden;
          padding: 0 8px 0 0;
          border: 1px solid rgba(142, 245, 255, 0.2);
          color: #ffffff;
          background: rgba(4, 12, 53, 0.92);
          cursor: pointer;
          clip-path: polygon(0 0, 100% 0, calc(100% - 9px) 100%, 0 100%);
          scroll-snap-align: center;
          transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
        }

        .teams-role-card:hover {
          border-color: #8ef5ff;
          transform: translateY(-3px);
        }

        .teams-role-card.active {
          border-color: #8ef5ff;
          color: #07143f;
          background: #8ef5ff;
          box-shadow: inset 5px 0 0 #ff2a2a;
        }

        .teams-role-number {
          position: absolute;
          top: 5px;
          right: 11px;
          color: rgba(255, 255, 255, 0.32);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 12px;
        }

        .teams-role-card.active .teams-role-number {
          color: #ff2a2a;
        }

        .teams-role-image {
          width: 66px;
          height: 92px;
          object-fit: contain;
          filter: none;
          transform: scale(1.2);
          transform-origin: center bottom;
        }

        .teams-role-label {
          min-width: 0;
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .teams-role-label strong {
          font-family: 'Anton', sans-serif;
          font-size: 17px;
          font-style: italic;
          line-height: 1;
        }

        .teams-role-label small {
          margin-top: 4px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 10px;
          letter-spacing: 1px;
        }

        .teams-player-form {
          row-gap: 9px;
        }

        .teams-player-form .teams-input,
        .teams-player-form .teams-select {
          min-height: 46px;
          font-size: 18px;
        }

        .teams-player-form .teams-cta {
          min-height: 50px;
          font-size: 22px;
        }

        .teams-access-code {
          position: relative;
        }

        .teams-access-code::after {
          content: "INVITE ONLY";
          position: absolute;
          right: 12px;
          top: 0;
          color: #ff6d6d;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 11px;
          letter-spacing: 1.6px;
        }

        .teams-my-empty {
          min-height: 320px;
          display: grid;
          place-items: center;
          padding: 34px;
          border: 1px solid rgba(142, 245, 255, 0.22);
          background: rgba(4, 12, 53, 0.88);
          text-align: center;
        }

        .teams-my-empty h3 {
          margin: 0;
          font-size: clamp(32px, 4vw, 56px);
          font-style: italic;
        }

        .teams-my-empty p {
          max-width: 480px;
          margin: 8px auto 22px;
          color: rgba(255, 255, 255, 0.65);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 19px;
          letter-spacing: 1px;
        }

        .teams-my-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .teams-my-action {
          min-height: 46px;
          padding: 8px 18px;
          border: 0;
          color: #07143f;
          background: #8ef5ff;
          cursor: pointer;
          font-family: 'Anton', sans-serif;
          font-size: 18px;
          font-style: italic;
        }

        .teams-my-action.secondary {
          color: #ffffff;
          background: #ff2a2a;
        }

        .teams-my-summary {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 18px;
          padding: 20px;
          border-left: 6px solid #8ef5ff;
          background: rgba(4, 12, 53, 0.9);
        }

        .teams-my-name {
          display: block;
          font-size: clamp(34px, 4.2vw, 62px);
          font-style: italic;
          line-height: 0.92;
        }

        .teams-my-focus {
          display: block;
          margin-top: 8px;
          color: #8ef5ff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 17px;
          letter-spacing: 2px;
        }

        .teams-tutorial-complete {
          position: fixed;
          top: 28px;
          left: 50%;
          z-index: 100010;
          padding: 14px 22px;
          border: 4px solid #8ef5ff;
          color: #ffffff;
          background: #07143f;
          box-shadow: 8px 8px 0 #ff2a2a;
          font-family: 'Press Start 2P', monospace;
          font-size: 10px;
          letter-spacing: 1px;
          transform: translateX(-50%);
          animation: teams-complete-enter 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes teams-complete-enter {
          from { opacity: 0; transform: translate(-50%, -18px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        .teams-my-code {
          align-self: center;
          padding: 10px 14px;
          color: #07143f;
          background: #ffffff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 2px;
        }

        .teams-my-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 14px;
        }

        .teams-my-stat {
          min-height: 90px;
          padding: 14px 16px;
          border: 1px solid rgba(142, 245, 255, 0.18);
          background: rgba(4, 12, 53, 0.76);
        }

        .teams-my-stat-label {
          display: block;
          color: rgba(255, 255, 255, 0.55);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 14px;
          letter-spacing: 2px;
        }

        .teams-my-stat-value {
          display: block;
          margin-top: 5px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 23px;
          letter-spacing: 1px;
        }

        .teams-workspace-title {
          margin: 16px 0 8px;
          color: #8ef5ff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 17px;
          letter-spacing: 2px;
        }

        .teams-roster-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .teams-member {
          min-height: 66px;
          display: grid;
          grid-template-columns: 42px 1fr;
          align-items: center;
          gap: 11px;
          padding: 9px 12px;
          border: 1px solid rgba(142, 245, 255, 0.18);
          background: rgba(4, 12, 53, 0.82);
        }

        .teams-member.open {
          opacity: 0.58;
          border-style: dashed;
        }

        .teams-member-index {
          color: #ff2a2a;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
        }

        .teams-member-role {
          display: block;
          color: rgba(255, 255, 255, 0.54);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 12px;
          letter-spacing: 1.5px;
        }

        .teams-member-name {
          display: block;
          margin-top: 2px;
          overflow: hidden;
          color: #ffffff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 17px;
          letter-spacing: 1px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .teams-submission-form {
          grid-template-columns: 1fr 1fr;
        }

        .teams-submission-form .teams-input {
          min-height: 48px;
          font-size: 18px;
        }

        .teams-submission-form .teams-cta {
          min-height: 50px;
          font-size: 22px;
        }

        .teams-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .teams-card {
          display: grid;
          grid-template-columns: 1fr auto auto;
          align-items: center;
          gap: 18px;
          min-height: 94px;
          padding: 13px 16px;
          border: 1px solid rgba(142, 245, 255, 0.18);
          background: rgba(4, 12, 53, 0.9);
          clip-path: polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
        }

        .teams-card-name {
          display: block;
          font-size: 27px;
          font-style: italic;
        }

        .teams-card-focus {
          display: block;
          margin-top: 3px;
          color: #8ef5ff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px;
          letter-spacing: 1px;
        }

        .teams-card-spots {
          color: rgba(255, 255, 255, 0.7);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 1px;
          white-space: nowrap;
        }

        .teams-card-button {
          min-height: 42px;
          padding: 8px 15px;
          border: 0;
          color: #07143f;
          background: #8ef5ff;
          cursor: pointer;
          font-family: 'Anton', sans-serif;
          font-size: 16px;
          font-style: italic;
        }

        .teams-back-hint {
          position: absolute;
          right: 28px;
          bottom: 20px;
          color: rgba(255, 255, 255, 0.52);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px;
          letter-spacing: 2px;
        }

        @media (max-width: 900px) {
          .teams-nav { left: 2vw; width: 38vw; }
          .teams-panel { right: 2vw; width: 56vw; padding: 18px; }
          .teams-tab { min-height: 76px; }
          .teams-form { grid-template-columns: 1fr; }
          .teams-field.wide, .teams-cta { grid-column: 1; }
        }

        @media (max-width: 700px) {
          .teams-overlay {
            overflow-x: hidden;
            overflow-y: auto;
            padding: max(16px, env(safe-area-inset-top)) 0 max(72px, env(safe-area-inset-bottom));
            -webkit-overflow-scrolling: touch;
          }

          .teams-nav {
            position: relative;
            top: auto;
            left: auto;
            width: auto;
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
            margin: 0 12px;
          }

          .teams-title {
            grid-column: 1 / -1;
            margin: 0 0 2px 3px;
            font-size: 56px;
          }

          .teams-tab {
            min-height: 66px;
            gap: 6px;
            padding: 8px 12px;
            clip-path: polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
          }

          .teams-tab.active { box-shadow: 5px 5px 0 rgba(255, 42, 42, 0.82); }
          .teams-tab-label { font-size: clamp(18px, 5.7vw, 24px); line-height: 0.98; }
          .teams-tab-number { font-size: 21px; }

          .teams-panel,
          .teams-panel.player-panel,
          .teams-panel.my-team-panel {
            position: relative;
            top: auto;
            right: auto;
            width: auto;
            height: auto;
            min-height: 0;
            margin: 16px 12px 0;
            padding: 14px 14px 22px;
            overflow: visible;
            box-shadow: 7px 7px 0 rgba(0, 6, 30, 0.58);
          }

          .teams-panel-header,
          .teams-panel.player-panel .teams-panel-header,
          .teams-panel.my-team-panel .teams-panel-header {
            min-height: 66px;
            gap: 10px;
            padding: 9px 12px;
            box-shadow: 6px 0 0 rgba(255, 42, 42, 0.88);
          }

          .teams-panel-index { font-size: 31px; }
          .teams-panel-heading { font-size: clamp(28px, 8.5vw, 38px); }
          .teams-panel-subtitle,
          .teams-panel.player-panel .teams-panel-subtitle,
          .teams-panel.my-team-panel .teams-panel-subtitle {
            margin: 13px 0 10px;
            font-size: 14px;
            letter-spacing: 1.3px;
          }

          .teams-form,
          .teams-submission-form {
            grid-template-columns: 1fr;
            gap: 11px;
          }

          .teams-field.wide,
          .teams-cta,
          .teams-submission-form .teams-cta {
            grid-column: 1;
          }

          .teams-input,
          .teams-select,
          .teams-player-form .teams-input,
          .teams-player-form .teams-select,
          .teams-submission-form .teams-input {
            min-height: 50px;
            font-size: 18px;
          }

          .teams-cta,
          .teams-player-form .teams-cta,
          .teams-submission-form .teams-cta {
            min-height: 52px;
            font-size: 22px;
          }

          .teams-character-scene {
            height: 270px;
            grid-template-columns: minmax(0, 1fr) 155px;
          }

          .teams-character-copy {
            align-self: start;
            padding: 48px 4px 0 14px;
          }

          .teams-character-kicker { font-size: 11px; letter-spacing: 1.5px; }
          .teams-character-name { font-size: 29px; }
          .teams-character-subtitle { font-size: 13px; letter-spacing: 1px; }
          .teams-character-ability { margin-top: 9px; padding: 5px 7px; font-size: 10px; }

          .teams-character-slot {
            width: 155px;
            height: 266px;
          }

          .teams-character-hero {
            width: 155px;
            height: 248px;
          }

          .teams-character-p1 {
            top: 34px;
            right: 5px;
            width: 34px;
            height: 34px;
            font-size: 13px;
          }

          .teams-character-hud {
            position: absolute;
            left: 14px;
            bottom: 13px;
            z-index: 6;
            padding: 0;
          }

          .teams-character-controls { gap: 7px; margin: 0; }
          .teams-character-arrow { width: 46px; height: 46px; }
          .teams-character-stats { display: none; }

          .teams-role-carousel-wrap { margin-top: 26px; }
          .teams-role-card { flex-basis: 156px; }
          .teams-role-carousel { padding-bottom: 13px; }

          .teams-access-grid,
          .teams-my-grid,
          .teams-roster-grid {
            grid-template-columns: 1fr;
          }

          .teams-access { min-height: 82px; }
          .teams-my-empty { min-height: 260px; padding: 24px 15px; }
          .teams-my-actions { flex-direction: column; }
          .teams-my-action { width: 100%; min-height: 48px; }
          .teams-my-summary { grid-template-columns: 1fr; gap: 10px; padding: 14px; }
          .teams-my-code { justify-self: start; }
          .teams-card { grid-template-columns: 1fr; gap: 9px; padding: 13px; }
          .teams-card-button { min-height: 48px; }
          .teams-back-hint { display: none; }

          .teams-player-card { min-height: 0; padding: 18px; }
          .teams-player-card-content { grid-template-columns: 110px 1fr; gap: 12px; }
          .teams-player-avatar { width: 110px; height: 180px; transform: scale(1.2); }
          .teams-player-name { font-size: 34px; }
        }
      `}</style>

      <div className="teams-overlay">
        <nav className="teams-nav" aria-label="Team actions">
          <h1 className="teams-title">TEAMS</h1>
          {TABS.map((tab, index) => (
            <button
              className={`teams-tab${active === index ? " active" : ""}${mounted ? " mounted" : ""}${tutorialActive && index === 0 ? " tutorial-player-target tutorial-hand-target" : ""}`}
              key={tab.id}
              type="button"
              onClick={() => {
                selectTab(index);
                if (tutorialActive && index === 0) {
                  setTutorialCompleteNotice(true);
                  onTutorialComplete?.();
                }
              }}
              style={{ transitionDelay: `${index * 70}ms` }}
              aria-pressed={active === index}
            >
              <span className="teams-tab-label">{tab.label}</span>
              <span className="teams-tab-number">{tab.number}</span>
            </button>
          ))}
        </nav>

        <main className={`teams-panel${active === 3 ? " my-team-panel" : active === 0 ? " player-panel" : ""}`}>
          <header className="teams-panel-header">
            <span className="teams-panel-index">{TABS[active].number}</span>
            <h2 className="teams-panel-heading">{TABS[active].label}</h2>
          </header>

          {active === 0 && (
            <section aria-label="Create a player">
              <p className="teams-panel-subtitle">CHOOSE YOUR CLASS · CREATE YOUR HACKATHON ACCOUNT</p>
              {!playerProfile ? (
                <>
                  <div className="teams-character-scene" aria-live="polite">
                    <div className="teams-character-copy">
                      <span className="teams-character-kicker">SELECT CHARACTER · {String(selectedRoleIndex + 1).padStart(2, "0")}</span>
                      <strong className="teams-character-name">{selectedRoleData.name}</strong>
                      <span className="teams-character-subtitle">{selectedRoleData.subtitle}</span>
                      <span className="teams-character-ability">SPECIAL · {selectedRoleData.ability}</span>
                    </div>
                    <div className="teams-character-slot">
                      <img
                        className="teams-character-hero"
                        key={selectedRoleData.id}
                        src={selectedRoleData.image}
                        alt={`${selectedRoleData.name} player character`}
                      />
                      <span className="teams-character-p1">P1</span>
                    </div>
                    <div className="teams-character-hud">
                      <div className="teams-character-controls">
                        <button className="teams-character-arrow" type="button" onClick={() => stepRole(-1)} aria-label="Previous character">←</button>
                        <button className="teams-character-arrow" type="button" onClick={() => stepRole(1)} aria-label="Next character">→</button>
                      </div>
                      <div className="teams-character-stats" aria-label={`${selectedRoleData.name} stats`}>
                        {Object.entries(selectedRoleData.stats).map(([label, value]) => (
                          <div className="teams-character-stat" key={label}>
                            <span className="teams-character-stat-label">{label}</span>
                            <span className="teams-character-stat-track">
                              <span className="teams-character-stat-fill" style={{ width: `${value}%` }} />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="teams-role-carousel-wrap">
                    <div className="teams-role-carousel" ref={roleCarouselRef} aria-label="Choose your player role">
                      {PLAYER_ROLES.map((role, roleIndex) => (
                        <button
                          className={`teams-role-card${selectedRole === role.id ? " active" : ""}`}
                          data-role={role.id}
                          key={role.id}
                          type="button"
                          onClick={() => setSelectedRole(role.id)}
                          aria-pressed={selectedRole === role.id}
                        >
                          <span className="teams-role-number">{String(roleIndex + 1).padStart(2, "0")}</span>
                          <img className="teams-role-image" src={role.image} alt="" />
                          <span className="teams-role-label">
                            <strong>{role.name}</strong>
                            <small>{role.subtitle}</small>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <form className="teams-form teams-player-form" onSubmit={handleCreatePlayer}>
                  <label className="teams-field">
                    <span>PLAYER NAME</span>
                    <input className="teams-input" name="playerName" placeholder="YOUR DISPLAY NAME" required />
                  </label>
                  <label className="teams-field">
                    <span>EMAIL</span>
                    <input className="teams-input" name="playerEmail" type="email" placeholder="YOU@EMAIL.COM" required />
                  </label>
                  <label className="teams-field">
                    <span>EXPERIENCE</span>
                    <select className="teams-select" name="experience" defaultValue="any">
                      <option value="beginner">BEGINNER</option>
                      <option value="intermediate">INTERMEDIATE</option>
                      <option value="experienced">EXPERIENCED</option>
                    </select>
                  </label>
                  <label className="teams-field">
                    <span>YOUR SUPERPOWER</span>
                    <input className="teams-input" name="skills" placeholder="REACT, HEALTHCARE, STORYTELLING..." required />
                  </label>
                  <label className="teams-field wide">
                    <span>LOOKING FOR</span>
                    <input className="teams-input" name="lookingFor" placeholder="THE KIND OF TEAM YOU WANT" />
                  </label>
                  <label className="teams-field wide teams-access-code">
                    <span>ACCESS CODE</span>
                    <input className="teams-input" name="accessCode" placeholder="ENTER THE CODE FROM YOUR INVITE" autoComplete="one-time-code" required />
                  </label>
                  <button className="teams-cta" type="submit">CONFIRM PLAYER 1 →</button>
                  </form>
                </>
              ) : (
                <div className="teams-player-card">
                  <div className="teams-player-card-content">
                    <img className="teams-player-avatar" src={playerProfile.image} alt={`${playerProfile.role} player mascot`} />
                    <div>
                      <span className="teams-player-ready">PLAYER READY</span>
                      <span className="teams-player-name">{playerProfile.name}</span>
                      <span className="teams-player-role">{playerProfile.role} · {playerProfile.roleSubtitle}</span>
                      <div className="teams-player-details">
                        {playerProfile.skills}<br />LOOKING FOR · {playerProfile.lookingFor}
                      </div>
                      <button className="teams-my-action" type="button" onClick={() => { setPlayerProfile(null); setMessage(""); }}>EDIT PLAYER</button>
                    </div>
                  </div>
                </div>
              )}
              {message && <ActionMessage>{message}</ActionMessage>}
            </section>
          )}

          {active === 1 && (
            <section aria-label="Register a team">
              <p className="teams-panel-subtitle">CREATE YOUR HACKATHON TEAM</p>
              <form className="teams-form" onSubmit={handleRegister}>
                <label className="teams-field">
                  <span>TEAM NAME</span>
                  <input className="teams-input" name="teamName" placeholder="E.G. CARE CREW" required />
                </label>
                <label className="teams-field">
                  <span>TEAM LEAD EMAIL</span>
                  <input className="teams-input" name="email" type="email" placeholder="YOU@EMAIL.COM" required />
                </label>
                <label className="teams-field wide">
                  <span>TEAMMATE EMAILS</span>
                  <input className="teams-input" name="teammates" placeholder="EMAILS SEPARATED BY COMMAS" />
                </label>
                <label className="teams-field">
                  <span>TARGET TEAM SIZE</span>
                  <select className="teams-select" name="size" defaultValue="2">
                    <option value="1">1 MEMBER</option>
                    <option value="2">2 MEMBERS</option>
                    <option value="3">3 MEMBERS</option>
                    <option value="4">4 MEMBERS</option>
                  </select>
                </label>
                <label className="teams-field">
                  <span>PRIMARY FOCUS</span>
                  <input className="teams-input" name="focus" placeholder="CONSUMER HEALTH" />
                </label>
                <label className="teams-field wide">
                  <span>LOOKING FOR</span>
                  <input className="teams-input" name="lookingFor" placeholder="DESIGNER, ENGINEER, CLINICIAN..." />
                </label>
                <button className="teams-cta" type="submit">CREATE TEAM →</button>
              </form>
              {message && <ActionMessage>{message}</ActionMessage>}
            </section>
          )}

          {active === 2 && (
            <section aria-label="Find a team">
              <p className="teams-panel-subtitle">CHOOSE HOW YOU WANT TO JOIN</p>
              <div className="teams-access-grid">
                <button className={`teams-access${teamAccess === "public" ? " active" : ""}`} type="button" onClick={() => { setTeamAccess("public"); setMessage(""); }} aria-pressed={teamAccess === "public"}>
                  <span className="teams-access-title">PUBLIC</span>
                  <span className="teams-access-copy">MATCH WITH AN OPEN TEAM</span>
                </button>
                <button className={`teams-access${teamAccess === "private" ? " active" : ""}`} type="button" onClick={() => { setTeamAccess("private"); setMessage(""); }} aria-pressed={teamAccess === "private"}>
                  <span className="teams-access-title">PRIVATE</span>
                  <span className="teams-access-copy">JOIN USING A TEAM CODE</span>
                </button>
              </div>
              <form className="teams-form" onSubmit={handleFind}>
                {teamAccess === "public" ? (
                  <>
                    <label className="teams-field">
                      <span>YOUR ROLE</span>
                      <select className="teams-select" defaultValue="engineering">
                        <option value="engineering">ENGINEERING</option>
                        <option value="design">DESIGN</option>
                        <option value="clinical">CLINICAL</option>
                        <option value="product">PRODUCT</option>
                      </select>
                    </label>
                    <label className="teams-field">
                      <span>EXPERIENCE</span>
                      <select className="teams-select" defaultValue="any">
                        <option value="any">ANY LEVEL</option>
                        <option value="beginner">BEGINNER</option>
                        <option value="experienced">EXPERIENCED</option>
                      </select>
                    </label>
                  </>
                ) : (
                  <label className="teams-field wide">
                    <span>PRIVATE TEAM CODE</span>
                    <input className="teams-input" name="teamCode" placeholder="ENTER 6-DIGIT CODE" required />
                  </label>
                )}
                <button className="teams-cta" type="submit">{teamAccess === "public" ? "FIND MY TEAM →" : "JOIN PRIVATE TEAM →"}</button>
              </form>
              {message && <ActionMessage>{message}</ActionMessage>}
            </section>
          )}

          {active === 3 && (
            <section aria-label="My team">
              <p className="teams-panel-subtitle">YOUR TEAM DASHBOARD</p>
              {myTeam ? (
                <>
                  <div className="teams-my-summary">
                    <div>
                      <span className="teams-my-name">{myTeam.name}</span>
                      <span className="teams-my-focus">{myTeam.focus}</span>
                    </div>
                    <span className="teams-my-code">CODE · TEAM25</span>
                  </div>

                  <h3 className="teams-workspace-title">TEAMMATES · {memberCount}/4</h3>
                  <div className="teams-roster-grid">
                    {roster.map((member, index) => (
                      <div className={`teams-member${member.open ? " open" : ""}`} key={member.role}>
                        <span className="teams-member-index">{String(index + 1).padStart(2, "0")}</span>
                        <span>
                          <span className="teams-member-role">{member.role}</span>
                          <span className="teams-member-name">{member.name}</span>
                        </span>
                      </div>
                    ))}
                  </div>

                  <h3 className="teams-workspace-title">UPLOAD SUBMISSION</h3>
                  <form className="teams-form teams-submission-form" onSubmit={handleSubmission}>
                    <label className="teams-field">
                      <span>GITHUB REPOSITORY</span>
                      <input className="teams-input" name="github" type="url" placeholder="HTTPS://GITHUB.COM/..." required />
                    </label>
                    <label className="teams-field">
                      <span>DEMO VIDEO LINK</span>
                      <input className="teams-input" name="demo" type="url" placeholder="YOUTUBE, LOOM OR DRIVE" required />
                    </label>
                    <button className="teams-cta" type="submit">SEND SUBMISSION →</button>
                  </form>
                  {message && <ActionMessage>{message}</ActionMessage>}
                </>
              ) : (
                <div className="teams-my-empty">
                  <div>
                    <h3>NO TEAM YET</h3>
                    <p>CREATE A NEW TEAM OR JOIN AN EXISTING ONE TO UNLOCK YOUR TEAM DASHBOARD.</p>
                    <div className="teams-my-actions">
                      <button className="teams-my-action" type="button" onClick={() => setActive(1)}>CREATE A TEAM</button>
                      <button className="teams-my-action secondary" type="button" onClick={() => setActive(2)}>FIND A TEAM</button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </main>

        <div className="teams-back-hint">↑↓ SELECT · ESC BACK</div>
      </div>
      {tutorialCompleteNotice && <div className="teams-tutorial-complete" role="status">✓ TUTORIAL COMPLETE · PLAYER CREATION UNLOCKED</div>}
      {tutorialActive && <TutorialCoach stage="player" target=".tutorial-player-target" />}
    </div>
  );
}
