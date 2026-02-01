// src/pages/Landing.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Landing.css'

export default function Landing() {

    const navigate = useNavigate()

    const handleOpenDiary = () => {
        navigate('/login')
    }


    return (
        <div className="landing-root">
            <header className="landing-header">
                <div className="landing-logo">Night diary</div>
            </header>

            <main className="landing-main">
                {/* HERO */}
                <section className="hero section fade-in-slow">
                    <div className="hero-inner">
                        <p className="hero-kicker">a quiet place to think, plan, and feel</p>
                        <h1 className="hero-title">
                            A private space for thoughts, tasks, and moments you don’t want to lose.
                        </h1>
                        <p className="hero-subtitle">
                            Write freely. Plan gently. Track your days without pressure.{' '}
                            Nothing is shared. Nothing is judged. Just you, your words, and a calm space that stays.
                        </p>
                        <button
                            type="button"
                            className="hero-cta"
                            onClick={handleOpenDiary}
                        >

                            Open my diary
                        </button>
                    </div>
                </section>

                {/* HOW IT WORKS */}
                <section className="section how section-stagger">
                    <h2 className="section-title">How it works, quietly</h2>
                    <div className="how-steps">
                        <div className="how-step">
                            <h3>1. Start with today</h3>
                            <p>Each day opens gently — a place to see what matters right now.</p>
                        </div>
                        <div className="how-step">
                            <h3>2. Write, note, or plan</h3>
                            <p>Write diary entries, add notes, or list small daily tasks without pressure.</p>
                        </div>
                        <div className="how-step">
                            <h3>3. Track your progress</h3>
                            <p>See what you completed today and how your days slowly move forward.</p>
                        </div>
                        <div className="how-step">
                            <h3>4. Return when you need clarity</h3>
                            <p>Your diary remembers your words, tasks, and thoughts — quietly waiting.</p>
                        </div>
                    </div>
                </section>

                {/* WHY THIS DIARY EXISTS */}
                <section className="section why fade-in-soft">
                    <h2 className="section-title">Why this diary exists</h2>
                    <div className="why-text">
                        <p>Because life isn’t just about finishing tasks — it’s about understanding yourself.</p>
                        <p>Because some days need reflection, not productivity advice.</p>
                        <p>Because notes, thoughts, and plans belong in the same place.</p>
                        <p>Because being honest with yourself is more important than being impressive.</p>
                    </div>
                </section>

                {/* PRIVACY & TRUST */}
                <section className="section privacy section-stagger">
                    <h2 className="section-title">A quiet promise</h2>
                    <div className="privacy-grid">
                        <div className="privacy-item">
                            <h3>Your diary is private</h3>
                            <p>Your entries, tasks, and notes are not public. This space belongs only to you.</p>
                        </div>
                        <div className="privacy-item">
                            <h3>No feeds, no audience</h3>
                            <p>No timelines, no likes, no comparisons. Just your own pace.</p>
                        </div>
                        <div className="privacy-item">
                            <h3>No ads inside your focus</h3>
                            <p>Your thoughts and progress are never interrupted or monetized.</p>
                        </div>
                        <div className="privacy-item">
                            <h3>One place, many layers</h3>
                            <p>Diary, daily tasks, notes, and profile — all connected quietly.</p>
                        </div>
                    </div>
                </section>

                {/* WHO THIS IS FOR */}
                <section className="section who fade-in-soft">
                    <h2 className="section-title">Who this is for</h2>
                    <div className="who-list">
                        <p>For people who like planning softly, not aggressively.</p>
                        <p>For those who want to track progress without pressure.</p>
                        <p>For anyone who writes, plans, and reflects in the same breath.</p>
                        <p>For you — on calm days, heavy days, and everything in between.</p>
                    </div>
                </section>

                {/* FINAL CTA */}
                <section className="section final fade-in-slow">
                    <p className="final-line">
                        Your thoughts, your tasks, your pace — all in one quiet place.
                    </p>
                    <button
  type="button"
  className="hero-cta"
  onClick={handleOpenDiary}
>

                        Open diary
                    </button>
                </section>
            </main>
        </div>
    )
}
