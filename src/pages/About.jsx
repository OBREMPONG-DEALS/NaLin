import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
ArrowRight,
ChevronUp,
Heart,
Menu,
ShieldCheck,
Sparkles,
Music2,
Star,
X,
} from "lucide-react";

import nalinLogo from "../assets/images/NalinLogo.PNG";
import logo from "../assets/images/NalinLogo.PNG";
import dot from "../assets/images/dot.jfif";
import dott from "../assets/images/dott.jfif";
import dottt from "../assets/images/dottt.jfif";

import "../App.css";

function About() {
const [menuOpen, setMenuOpen] = useState(false);
const [showBackToTop, setShowBackToTop] = useState(false);

// Show the back-to-top button after scrolling.
useEffect(() => {
const handleScroll = () => {
setShowBackToTop(window.scrollY > 500);
};


window.addEventListener("scroll", handleScroll);

return () => {
  window.removeEventListener("scroll", handleScroll);
};


}, []);

// Close the mobile navigation.
const closeMenu = () => {
setMenuOpen(false);
};

// Scroll smoothly to the top.
const scrollToTop = () => {
window.scrollTo({
top: 0,
behavior: "smooth",
});
};

// Close the mobile menu when Escape is pressed.
useEffect(() => {
const handleEscape = (event) => {
if (event.key === "Escape") {
setMenuOpen(false);
}
};


window.addEventListener("keydown", handleEscape);

return () => {
  window.removeEventListener("keydown", handleEscape);
};


}, []);

const values = [
{
icon: <Heart size={22} />,
title: "Confidence",
text: "We believe what you wear should help you feel confident, comfortable and ready to take on your day.",
},
{
icon: <Sparkles size={22} />,
title: "Style",
text: "We combine modern fashion with active living to create pieces that look good wherever life takes you.",
},
{
icon: <ShieldCheck size={22} />,
title: "Quality",
text: "We carefully select products that balance comfort, style and everyday performance.",
},
];

const reasons = [
"Stylish activewear for everyday life",
"Comfortable pieces designed to move with you",
"Affordable options for different lifestyles",
"A growing collection of fitness essentials",
];

return ( <div className="site about-page">
{/* TOP BAR */} <div className="top-bar"> <p>FREE DELIVERY ON SELECTED ORDERS • ACCRA, GHANA</p> </div>


  {/* NAVBAR */}
  <header className="navbar">
    <Link
      to="/"
      className="brand-logo"
      onClick={closeMenu}
    >
      <img
        src={logo}
        alt="Nalin Fitness Apparels logo"
      />
    </Link>

    <nav className="desktop-nav">
      <Link to="/">Home</Link>

      <Link to="/shop">Shop</Link>

      <Link to="/about" className="active">
        About
      </Link>

      <Link to="/contact">Contact</Link>
    </nav>

    {/* NAVIGATION ACTIONS — CART ICON REMOVED */}
    <div className="nav-actions">
      <button
        type="button"
        className="menu-button"
        onClick={() => setMenuOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={menuOpen}
      >
        <Menu size={24} />
      </button>
    </div>
  </header>

  {/* MOBILE MENU */}
  <div
    className={`mobile-menu-overlay ${
      menuOpen ? "show" : ""
    }`}
    onClick={closeMenu}
  >
    <div
      className={`mobile-menu ${
        menuOpen ? "open" : ""
      }`}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="mobile-menu-header">
        <img
          src={logo}
          alt="Nalin Fitness Apparels"
        />

        <button
          type="button"
          className="close-menu"
          onClick={closeMenu}
          aria-label="Close navigation menu"
        >
          <X size={25} />
        </button>
      </div>

      <nav className="mobile-nav">
        <Link to="/" onClick={closeMenu}>
          Home
        </Link>

        <Link to="/shop" onClick={closeMenu}>
          Shop
        </Link>

        <Link to="/about" onClick={closeMenu}>
          About
        </Link>

        <Link to="/contact" onClick={closeMenu}>
          Contact
        </Link>
      </nav>

      <a
        href="https://wa.me/233506735003"
        target="_blank"
        rel="noreferrer"
        className="mobile-whatsapp"
        onClick={closeMenu}
      >
        Chat With Us On WhatsApp

        <ArrowRight size={18} />
      </a>
    </div>
  </div>

  <main>
    {/* HERO */}
    <section className="about-hero">
      <div className="about-hero-content">
        <p className="eyebrow">ABOUT NALIN</p>

        <h1>
          More than
          <em> activewear.</em>
        </h1>

        <p>
          Nalin Fitness Apparels is about feeling good,
          looking confident and embracing an active
          lifestyle without compromising on style.
        </p>

        <Link to="/shop" className="primary-button">
          Explore Collection

          <ArrowRight size={18} />
        </Link>
      </div>

      <div className="about-hero-image">
        <img
          src={dot}
          alt="Nalin Fitness Apparels lifestyle"
        />

        <div className="about-hero-badge">
          <span>NALIN</span>

          <strong>MOVE • FEEL • BE YOU</strong>
        </div>
      </div>
    </section>

    {/* INTRO */}
    <section className="about-intro section-padding">
      <div className="about-intro-label">
        <p className="eyebrow">OUR STORY</p>

        <span>01</span>
      </div>

      <div className="about-intro-content">
        <h2>
          Active living should feel
          <em> effortless.</em>
        </h2>

        <p>
          Nalin Fitness Apparels was created with a
          simple idea: activewear should not only support
          your movement, but also make you feel confident
          in who you are.
        </p>

        <p>
          From workouts and sports to casual days and
          relaxed moments, we bring together stylish,
          comfortable and affordable fitness apparel
          designed to fit into real life.
        </p>

        <p>
          We are building a brand for people who want to
          move, express themselves and enjoy an active
          lifestyle while still looking and feeling their
          best.
        </p>
      </div>
    </section>

    {/* IMAGE STORY */}
    <section className="about-image-story section-padding">
      <div className="about-story-main">
        <img
          src={dott}
          alt="Nalin active lifestyle"
        />

        <div className="about-story-overlay">
          <span>02</span>

          <h3>
            Designed for movement.
            <br />
            Made for life.
          </h3>
        </div>
      </div>

      <div className="about-story-side">
        <div className="about-story-small">
          <img
            src={dottt}
            alt="Nalin fitness fashion"
          />
        </div>

        <div className="about-story-quote">
          <p>
            “Your style should move with you.”
          </p>

          <span>NALIN FITNESS APPARELS</span>
        </div>
      </div>
    </section>

    {/* VISION AND MISSION */}
    <section className="vision-mission section-padding">
      <div className="section-heading">
        <p className="eyebrow">WHAT DRIVES US</p>

        <h2>
          Built around a
          <em> bigger purpose.</em>
        </h2>
      </div>

      <div className="vision-mission-grid">
        <article className="purpose-card">
          <span className="purpose-number">01</span>

          <p className="purpose-label">OUR VISION</p>

          <h3>
            A healthier,
            <em> confident</em> and active lifestyle.
          </h3>

          <p>
            To inspire a healthier, confident and active
            lifestyle through fashion, movement and
            everyday wellness.
          </p>
        </article>

        <article className="purpose-card featured-purpose">
          <span className="purpose-number">02</span>

          <p className="purpose-label">OUR MISSION</p>

          <h3>
            Style that supports
            <em> your lifestyle.</em>
          </h3>

          <p>
            To provide stylish, comfortable and affordable
            fitness apparel while promoting confidence,
            wellness and an active lifestyle.
          </p>
        </article>
      </div>
    </section>

    {/* VALUES */}
    <section className="values-section section-padding">
      <div className="section-heading centered">
        <p className="eyebrow">OUR VALUES</p>

        <h2>
          What Nalin
          <em> stands for.</em>
        </h2>

        <p>
          Everything we do is guided by the belief that
          fashion and an active lifestyle can work
          together.
        </p>
      </div>

      <div className="values-grid">
        {values.map((value) => (
          <article
            className="value-card"
            key={value.title}
          >
            <div className="value-icon">
              {value.icon}
            </div>

            <h3>{value.title}</h3>

            <p>{value.text}</p>
          </article>
        ))}
      </div>
    </section>

    {/* WHY NALIN */}
    <section className="why-nalin section-padding">
      <div className="why-nalin-image">
        <img
          src={dot}
          alt="Nalin activewear lifestyle"
        />
      </div>

      <div className="why-nalin-content">
        <p className="eyebrow">WHY NALIN</p>

        <h2>
          Because your
          <em> lifestyle matters.</em>
        </h2>

        <p className="why-nalin-description">
          Whether you're heading to the gym, playing
          tennis, running errands or simply relaxing,
          your activewear should work with you.
        </p>

        <div className="reason-list">
          {reasons.map((reason, index) => (
            <div
              className="reason-item"
              key={reason}
            >
              <span>0{index + 1}</span>

              <p>{reason}</p>
            </div>
          ))}
        </div>

        <Link to="/shop" className="text-link">
          Shop Nalin

          <ArrowRight size={18} />
        </Link>
      </div>
    </section>

    {/* VIDEO */}
    <section className="about-video-section section-padding">
      <div className="about-video-copy">
        <p className="eyebrow">THE NALIN MOVEMENT</p>

        <h2>
          Move with
          <em> confidence.</em>
        </h2>

        <p>
          Nalin is for every workout, every goal and
          every moment in between.
        </p>

        <div className="about-video-stats">
          <div>
            <strong>01</strong>

            <span>Move</span>
          </div>

          <div>
            <strong>02</strong>

            <span>Feel</span>
          </div>

          <div>
            <strong>03</strong>

            <span>Be You</span>
          </div>
        </div>
      </div>

      <div className="about-video-wrapper">
        <video
          className="about-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source
            src="/fitness-modell.mp4"
            type="video/mp4"
          />

          Your browser does not support the video tag.
        </video>
      </div>
    </section>

    {/* BRAND STATEMENT */}
    <section className="about-statement">
      <div className="about-statement-inner">
        <p className="eyebrow">THE NALIN PHILOSOPHY</p>

        <h2>
          Wear confidence.
          <br />
          <em>Live actively.</em>
        </h2>

        <p>
          We believe movement is not just about exercise.
          It is about how you live, how you feel and how
          confidently you show up every day.
        </p>

        <Link
          to="/shop"
          className="primary-button light-button"
        >
          Shop The Collection

          <ArrowRight size={18} />
        </Link>
      </div>
    </section>

    {/* TESTIMONIAL */}
    <section className="about-testimonial section-padding">
      <div className="about-testimonial-inner">
        <div className="testimonial-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={17}
              fill="currentColor"
            />
          ))}
        </div>

        <blockquote>
          “Nalin is more than what you wear. It is the
          confidence you carry when you step out and be
          yourself.”
        </blockquote>

        <span>NALIN FITNESS APPARELS</span>
      </div>
    </section>

    {/* FINAL CALL TO ACTION */}
    <section className="about-final-cta">
      <div>
        <p className="eyebrow">YOUR NEXT MOVE</p>

        <h2>
          Ready to move
          <em> differently?</em>
        </h2>

        <p>
          Discover activewear designed for your movement,
          your lifestyle and your confidence.
        </p>

        <div className="final-cta-buttons">
          <Link to="/shop" className="primary-button">
            Shop Now

            <ArrowRight size={18} />
          </Link>

          <a
            href="https://wa.me/233506735003"
            target="_blank"
            rel="noreferrer"
            className="secondary-button"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  </main>

  {/* FOOTER */}
  <footer className="site-footer">
    <div className="footer-main">
      <div className="footer-brand">
        <img
          src={nalinLogo}
          alt="NaLin Fitness Apparels"
          className="footer-logo"
        />

        <p>
          Stylish, comfortable and affordable fitness
          apparel designed to help you move with
          confidence.
        </p>

        <div className="footer-socials">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="footer-social instagram"
          >
            <span className="instagram-text">◎</span>
          </a>

          <a
            href="https://www.tiktok.com/@nancy0wusua"
            target="_blank"
            rel="noreferrer"
            aria-label="TikTok"
            className="footer-social tiktok"
          >
            <Music2 size={18} strokeWidth={1.6} />
          </a>

          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="footer-social facebook"
          >
            <span className="facebook-text">f</span>
          </a>
        </div>
      </div>

      <div className="footer-column">
        <span>Explore</span>

        <Link to="/">Home</Link>

        <Link to="/shop">Shop</Link>

        <Link to="/about">About</Link>

        <Link to="/contact">Contact</Link>
      </div>

      <div className="footer-column">
        <span>Customer Care</span>

        <Link to="/privacy">Privacy Policy</Link>

        <Link to="/terms">Terms &amp; Conditions</Link>

        <a href="mailto:nmcdavies1@gmail.com">
          Email Us
        </a>

        <a
          href="https://wa.me/233506735003"
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>
      </div>

      <div className="footer-column">
        <span>Payment</span>

        <div className="footer-payment">
          <strong>MTN MoMo</strong>

          <p>
            Mobile Money payments are accepted.
          </p>
        </div>

        <span className="footer-location-label">
          Location
        </span>

        <p className="footer-location">
          Weija-New Aplaku
          <br />
          AIT University, Sea View Campus
        </p>
      </div>
    </div>

    <div className="footer-bottom">
      <p>
        © 2026 NaLin Fitness Apparels. All rights
        reserved.
      </p>

      <p>Developed by McK MEDIA.</p>
    </div>
  </footer>

  {/* FLOATING WHATSAPP */}
  <a
    href="https://wa.me/233506735003"
    target="_blank"
    rel="noreferrer"
    className="floating-whatsapp"
    aria-label="Chat with NaLin Fitness Apparels on WhatsApp"
    title="Chat with us on WhatsApp"
  >
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.52 3.48A11.77 11.77 0 0 0 12.04 0C5.55 0 .27 5.28.27 11.77c0 2.07.54 4.09 1.57 5.87L.17 24l6.5-1.7a11.76 11.76 0 0 0 5.37 1.29h.01c6.49 0 11.77-5.28 11.77-11.77 0-3.14-1.22-6.09-3.3-8.34ZM12.05 21.57h-.01a9.77 9.77 0 0 1-4.98-1.36l-.36-.21-3.86 1.01 1.03-3.76-.23-.39a9.76 9.76 0 1 1 8.41 4.71Zm5.36-7.31c-.29-.15-1.72-.85-1.99-.95-.27-.1-.46-.15-.65.15-.19.29-.75.95-.92 1.14-.17.2-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.65-1.57-.89-2.15-.23-.56-.47-.49-.65-.5h-.55c-.19 0-.49.07-.75.37-.26.29-.98.96-.98 2.34s1 2.71 1.14 2.9c.14.2 1.96 2.99 4.75 4.19.66.28 1.26.18 1.73.11.53-.08 1.72-.7 1.96-1.38.24-.68.17-1.26.17-1.38-.07-.12-.26-.19-.55-.34Z" />
    </svg>
  </a>

  {/* BACK TO TOP */}
  {showBackToTop && (
    <button
      type="button"
      className="back-to-top"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
    >
      <ChevronUp size={19} />
    </button>
  )}
</div>


);
}

export default About;
