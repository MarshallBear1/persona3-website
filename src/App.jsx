import { useEffect, useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import P3Menu from './P3Menu'
import ResumePage from './ResumePage'
import PageTransition from './PageTransition'
import Socials from './Socials'
import AboutMe from './AboutMe'
import CreditsPage from './CreditsPage'
import TeamsPage from './TeamsPage'
import HelpGame from './HelpGame'
import VideoBackground from './VideoBackground'
import GameStartScreen from './GameStartScreen'
import './App.css'

const DESKTOP_REQUIRED_QUERY = '(max-width: 1023px), ((hover: none) and (pointer: coarse))'

function DesktopRequiredScreen() {
  return (
    <main className="desktop-gate" role="alert" aria-labelledby="desktop-gate-title">
      <div className="desktop-gate-grid" aria-hidden="true" />
      <section className="desktop-gate-card">
        <div className="desktop-gate-cross" aria-hidden="true">+</div>
        <span className="desktop-gate-kicker">ACCESS RESTRICTED // CHH-2026</span>
        <h1 id="desktop-gate-title">
          DESKTOP
          <strong>REQUIRED</strong>
        </h1>
        <p>This hackathon portal is available on desktop and laptop computers only.</p>
        <div className="desktop-gate-instruction">
          <span>01</span>
          <strong>OPEN THIS PAGE ON A COMPUTER</strong>
        </div>
        <small>MOBILE AND TABLET ACCESS IS DISABLED</small>
      </section>
    </main>
  )
}

function MenuScreen({ tutorialActive, onTutorialAdvance }) {
  const navigate = useNavigate()

  const handleNavigate = (page) => {
    if (tutorialActive && page !== 'teams') return
    if (tutorialActive && page === 'teams') onTutorialAdvance?.()
    navigate(`/${page}`)
  }

  return (
    <div id="menu-screen">
      <VideoBackground />
      <P3Menu tutorialActive={tutorialActive} onNavigate={handleNavigate} />
    </div>
  )
}

function AnimatedRoutes({ gameStarted, tutorialStage, onNewGame, onLoadGame, onTutorialAdvance, onTutorialComplete }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            {gameStarted ? (
              <MenuScreen tutorialActive={tutorialStage === 'teams'} onTutorialAdvance={onTutorialAdvance} />
            ) : (
              <GameStartScreen onNewGame={onNewGame} onLoadGame={onLoadGame} />
            )}
          </PageTransition>
        } />
        <Route path="/about" element={
          <PageTransition variant="about"><AboutMe /></PageTransition>
        } />
        <Route path="/resume" element={
          <PageTransition><ResumePage /></PageTransition>
        } />
        <Route path="/socials" element={
          <PageTransition variant="socials"><Socials /></PageTransition>
        } />

        <Route path="/brief" element={
          <PageTransition variant="about"><AboutMe /></PageTransition>
        } />
        <Route path="/teams" element={
          <PageTransition variant="about">
            <TeamsPage tutorialActive={tutorialStage === 'player'} onTutorialComplete={onTutorialComplete} />
          </PageTransition>
        } />
        <Route path="/mark-scheme" element={
          <PageTransition><ResumePage mode="mark-scheme" /></PageTransition>
        } />
        <Route path="/prizes" element={
          <PageTransition><ResumePage mode="prizes" /></PageTransition>
        } />
        <Route path="/schedule" element={
          <PageTransition><ResumePage mode="schedule" /></PageTransition>
        } />
        <Route path="/credits" element={
          <PageTransition variant="socials"><CreditsPage /></PageTransition>
        } />
        <Route path="/help" element={
          <PageTransition variant="socials"><HelpGame /></PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  )
}

function BackgroundCredit() {
  return (
    <span className="background-credit">
      BACKGROUND · CYBERPUNK MEDICAL AMBIENCE
    </span>
  )
}

export default function App() {
  const [desktopRequired, setDesktopRequired] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia(DESKTOP_REQUIRED_QUERY).matches
  ))
  const [gameStarted, setGameStarted] = useState(false)
  const [tutorialStage, setTutorialStage] = useState(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_REQUIRED_QUERY)
    const updateAccess = () => setDesktopRequired(mediaQuery.matches)

    updateAccess()
    mediaQuery.addEventListener?.('change', updateAccess)
    mediaQuery.addListener?.(updateAccess)

    return () => {
      mediaQuery.removeEventListener?.('change', updateAccess)
      mediaQuery.removeListener?.(updateAccess)
    }
  }, [])

  const startNewGame = () => {
    setTutorialStage('teams')
    setGameStarted(true)
  }

  const loadGame = () => {
    setTutorialStage(null)
    setGameStarted(true)
  }

  if (desktopRequired) return <DesktopRequiredScreen />

  return (
    <>
      <AnimatedRoutes
        gameStarted={gameStarted}
        tutorialStage={tutorialStage}
        onNewGame={startNewGame}
        onLoadGame={loadGame}
        onTutorialAdvance={() => setTutorialStage('player')}
        onTutorialComplete={() => setTutorialStage(null)}
      />
      <BackgroundCredit />
    </>
  )
}
