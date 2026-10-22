import { useEffect, useState } from "react";

import {
  ArrowRight,
  ChevronUp,
  Menu,
  Play,
  ShoppingBag,
  
  
  Music2,
  Sparkles,
  Star,
  X,
} from "lucide-react";

import "../App.css";

import NalinLogo from "../assets/images/nalinlogo.png";
import lifestyle from "../assets/images/lifestyle.jfif";
import lifee from "../assets/images/lifee.jfif";
import cons from "../assets/images/cons.jfif";
import niw from "../assets/images/niw.jfif";
import neww from "../assets/images/neww.jfif";
import { Link } from "react-router-dom";


function Home() {
  const [cartCount, setCartCount] = useState(() => {
  try {
    const savedCart = localStorage.getItem("nalin_cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];

    return cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  } catch {
    return 0;
  }
});
useEffect(() => {
  const updateCartCount = () => {
    try {
      const savedCart = localStorage.getItem("nalin_cart");
      const cart = savedCart ? JSON.parse(savedCart) : [];

      const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
      );

      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  };

  updateCartCount();

  window.addEventListener("nalin-cart-updated", updateCartCount);

  return () => {
    window.removeEventListener(
      "nalin-cart-updated",
      updateCartCount
    );
  };
}, []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const categories = [
    "Gym Wear",
    "Leggings",
    "Shorts",
    "Sports Bras",
    "Shirts",
    "Tennis Wear",
    "Sneakers",
    "Fitness Accessories",
  ];

  const testimonials = [
    {
      name: "Ama Mensah",
      text: "The quality is excellent and the fit is even better. Nalin has become one of my favourite activewear brands.",
    },
    {
      name: "Jessica A.",
      text: "I love how comfortable everything feels. I can work out, run errands and still look stylish.",
    },
    {
      name: "Priscilla K.",
      text: "Beautiful designs, great quality and very affordable. The whole shopping experience was amazing.",
    },
    {
      name: "Sandra Owusu",
      text: "My leggings fit perfectly and stay comfortable throughout my workouts. Definitely buying again.",
    },
    {
      name: "Esi B.",
      text: "Nalin makes activewear feel fashionable. I love the confidence I get whenever I wear my pieces.",
    },
  ];

  const features = [
    {
      icon: <Sparkles size={22} />,
      title: "Comfort First",
      text: "Thoughtfully selected activewear designed to keep you comfortable throughout your day.",
    },
    {
      icon: <ShoppingBag size={22} />,
      title: "Affordable Style",
      text: "Look good, feel good and stay within your budget with stylish everyday activewear.",
    },
    {
      icon: <ArrowRight size={22} />,
      title: "Built To Move",
      text: "Pieces designed to move naturally with you through workouts, sports and everyday life.",
    },
    {
      icon: <Star size={22} />,
      title: "Confidence In Every Fit",
      text: "Because what you wear should help you feel confident, comfortable and ready.",
    },
  ];

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="site">

      {/* =====================================================
          TOP BAR
          ===================================================== */}

      <div className="top-bar">
        <p>FREE DELIVERY ON SELECTED ORDERS • ACCRA, GHANA</p>
      </div>


      {/* =====================================================
          NAVIGATION
          ===================================================== */}

      <header className="navbar">

        <a
          href="/"
          className="brand-logo"
          onClick={closeMenu}
        >
          <img
            src={NalinLogo}
            alt="Nalin Fitness Apparels logo"
          />
        </a>


        {/* DESKTOP NAV */}

        <nav className="desktop-nav">

          <a href="/">
            Home
          </a>

          <a href="/shop">
            Shop
          </a>

          <a href="/about">
            About
          </a>

          <a href="/contact">
            Contact
          </a>

        </nav>


        {/* NAV ACTIONS */}

        <div className="nav-actions">

          <a
            href="/shop"
            className="cart-button"
            aria-label="Shopping bag"
          >
            <ShoppingBag size={20} />
            <span>{cartCount}</span>
          </a>

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


      {/* =====================================================
          MOBILE MENU
          ===================================================== */}

      <div
  className={`mobile-menu-overlay ${menuOpen ? "show" : ""}`}
  onClick={closeMenu}
>
  <div
    className={`mobile-menu ${menuOpen ? "open" : ""}`}
    onClick={(event) => event.stopPropagation()}
  >
    <div className="mobile-menu-header">
      <img
        src={NalinLogo}
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
      <a href="/" onClick={closeMenu}>
        Home
      </a>

      <a href="/shop" onClick={closeMenu}>
        Shop
      </a>

      <a href="/about" onClick={closeMenu}>
        About
      </a>

      <a href="/contact" onClick={closeMenu}>
        Contact
      </a>
    </nav>

    <a
      href="https://wa.me/233506735003"
      target="_blank"
      rel="noreferrer"
      className="mobile-whatsapp"
    >
      Chat With Us On WhatsApp
      <ArrowRight size={18} />
    </a>
  </div>
</div>


      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <main>


        {/* ===================================================
            HERO
            =================================================== */}

        <section className="hero">

          <div className="hero-content">

            <p className="eyebrow">
              NALIN FITNESS APPARELS
            </p>

            <h1>
              Move.
              <span>Feel.</span>
              Be You.
            </h1>

            <p className="hero-description">
              Shop the best active wear & accessories for working out
              and simply lounging in style.
            </p>


            <div className="hero-buttons">

              <a
                href="/shop"
                className="primary-button"
              >
                Shop Collection
                <ArrowRight size={18} />
              </a>

              <a
                href="https://wa.me/233506735003"
                target="_blank"
                rel="noreferrer"
                className="secondary-button"
              >
                WhatsApp Us
              </a>

            </div>


            <div className="hero-trust">

              <div>
                <strong>100%</strong>
                <span>Style</span>
              </div>

              <div>
                <strong>8+</strong>
                <span>Categories</span>
              </div>

              <div>
                <strong>GH</strong>
                <span>Based</span>
              </div>

            </div>

          </div>


          <div className="hero-image">

            <img
              src={lifestyle}
              alt="Nalin fitness lifestyle"
            />

            <div className="hero-image-label">

              <span>
                EST. NALIN
              </span>

              <strong>
                ACTIVE LIVING
              </strong>

            </div>

          </div>

        </section>


        {/* ===================================================
            CATEGORY STRIP
            =================================================== */}

        <section className="category-strip">

          <div className="category-track">

            {categories.map((category) => (
              <a
                href="/shop"
                key={category}
              >
                {category}
                <span>•</span>
              </a>
            ))}

          </div>

        </section>


        {/* ===================================================
            COLLECTION
            =================================================== */}

        <section className="shop-intro section-padding">

          <div className="section-heading">

            <p className="eyebrow">
              THE COLLECTION
            </p>

            <h2>
              Designed for your
              <em> every move.</em>
            </h2>

            <p>
              From your morning workout to your evening wind-down,
              Nalin brings together comfort, confidence and effortless
              style.
            </p>

            <a
              href="/shop"
              className="text-link"
            >
              Explore the collection
              <ArrowRight size={18} />
            </a>

          </div>


          <div className="collection-cards">

            <a
              href="/shop"
              className="collection-card collection-card-large"
            >

              <img
                src={neww}
                alt="Nalin activewear collection"
              />

              <div className="collection-overlay">

                <span>
                  01
                </span>

                <h3>
                  Move With Confidence
                </h3>

                <ArrowRight size={20} />

              </div>

            </a>


            <a
              href="/shop"
              className="collection-card"
            >

              <img
                src={cons}
                alt="Nalin lifestyle collection"
              />

              <div className="collection-overlay">

                <span>
                  02
                </span>

                <h3>
                  Style That Moves
                </h3>

                <ArrowRight size={20} />

              </div>

            </a>

          </div>

        </section>


        {/* ===================================================
            LIFESTYLE
            =================================================== */}

        <section className="lifestyle-section section-padding">

          <div className="lifestyle-heading">

            <p className="eyebrow">
              THE NALIN LIFESTYLE
            </p>

            <h2>
              More than
              <em> activewear.</em>
            </h2>

            <p>
              Your clothes should move with your lifestyle.
              Nalin is made for training, relaxing, exploring
              and everything in between.
            </p>

          </div>


          <div className="lifestyle-grid">

            <div className="lifestyle-image lifestyle-image-one">

              <img
                src={lifestyle}
                alt="Fitness lifestyle"
              />

            </div>


            <div className="lifestyle-image lifestyle-image-two">

              <img
                src={niw}
                alt="Activewear lifestyle"
              />

            </div>


            <div className="lifestyle-image lifestyle-image-three">

              <img
                src={lifee}
                alt="Nalin fashion lifestyle"
              />

            </div>

          </div>

        </section>


        {/* ===================================================
            VIDEO
            =================================================== */}

        <section className="video-section section-padding">

          <div className="video-copy">

            <p className="eyebrow">
              KEEP MOVING
            </p>

            <h2>
              Your movement.
              <em>Your style.</em>
            </h2>

            <p>
              Whether you're training hard or taking it easy,
              wear something that feels as good as it looks.
            </p>

            <a
              href="/shop"
              className="primary-button"
            >
              Shop Activewear
              <ArrowRight size={18} />
            </a>

          </div>


          <div className="video-wrapper">

            <video
  className="home-video"
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
>
  <source src="/fitness-model.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>


            <div className="video-play-label">

              <Play size={16} />

              <span>
                PLAY VIDEO
              </span>

            </div>

          </div>

        </section>


        {/* ===================================================
            FEATURES
            =================================================== */}

        <section className="features-section section-padding">

          <div className="section-heading centered">

            <p className="eyebrow">
              WHY NALIN
            </p>

            <h2>
              Made for
              <em> real life.</em>
            </h2>

          </div>


          <div className="features-grid">

            {features.map((feature) => (

              <div
                className="feature-card"
                key={feature.title}
              >

                <div className="feature-icon">
                  {feature.icon}
                </div>

                <h3>
                  {feature.title}
                </h3>

                <p>
                  {feature.text}
                </p>

              </div>

            ))}

          </div>

        </section>


        {/* ===================================================
            BRAND STATEMENT
            =================================================== */}

        <section className="brand-statement section-padding">

          <div className="brand-statement-inner">

            <p className="eyebrow">
              OUR PURPOSE
            </p>

            <h2>
              Inspiring a healthier,
              <em> confident and active lifestyle.</em>
            </h2>


            <div className="brand-statement-copy">

              <div>

                <span>
                  OUR VISION
                </span>

                <p>
                  To inspire a healthier, confident and active lifestyle.
                </p>

              </div>


              <div>

                <span>
                  OUR MISSION
                </span>

                <p>
                  To provide stylish, comfortable and affordable
                  fitness apparel while promoting confidence, wellness
                  and an active lifestyle.
                </p>

              </div>

            </div>


            <a
              href="/about"
              className="text-link"
            >
              Discover our story
              <ArrowRight size={18} />
            </a>

          </div>

        </section>


        {/* ===================================================
            TESTIMONIALS
            =================================================== */}

        <section className="testimonials-section section-padding">

          <div className="section-heading centered">

            <p className="eyebrow">
              CUSTOMER LOVE
            </p>

            <h2>
              Loved by women
              <em> on the move.</em>
            </h2>

          </div>


          <div className="testimonials-grid">

            {testimonials.map((testimonial) => (

              <article
                className="testimonial-card"
                key={testimonial.name}
              >

                <div className="stars">

                  {[1, 2, 3, 4, 5].map((star) => (

                    <Star
                      key={star}
                      size={15}
                      fill="currentColor"
                    />

                  ))}

                </div>


                <p>
                  “{testimonial.text}”
                </p>


                <strong>
                  {testimonial.name}
                </strong>

              </article>

            ))}

          </div>

        </section>


        {/* ===================================================
            FINAL CTA
            =================================================== */}

        <section className="final-cta">

          <div className="final-cta-content">

            <p className="eyebrow">
              READY WHEN YOU ARE
            </p>

            <h2>
              Move better.
              <em> Feel better.</em>
            </h2>

            <p>
              Discover activewear made for your workouts,
              your lifestyle and your confidence.
            </p>


            <div className="final-cta-buttons">

              <a
                href="/shop"
                className="primary-button light-button"
              >
                Shop Now
                <ArrowRight size={18} />
              </a>


              <a
                href="https://wa.me/233506735003"
                target="_blank"
                rel="noreferrer"
                className="secondary-button light-outline"
              >
                Chat On WhatsApp
              </a>

            </div>

          </div>

        </section>

      </main>


      <footer className="site-footer">
  <div className="footer-main">
    <div className="footer-brand">
      <img
        src={NalinLogo}
        alt="NaLin Fitness Apparels"
        className="footer-logo"
      />

      <p>
        Stylish, comfortable and affordable fitness apparel
        designed to help you move with confidence.
      </p>

      <div className="footer-socials">
        <a
          href="#"
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
          href="#"
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
      <Link to="/terms">Terms & Conditions</Link>

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
      © 2026 NaLin Fitness Apparels. All rights reserved.
    </p>

    <p>Developed by McK MEDIA.</p>
  </div>
</footer>
      {/* =====================================================
          FLOATING WHATSAPP BUTTON
          ===================================================== */}

      <a
        href="https://wa.me/233506735003"
        target="_blank"
        rel="noreferrer"
        className="floating-whatsapp"
        aria-label="Chat with Nalin Fitness Apparels on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20.52 3.48A11.77 11.77 0 0 0 12.04 0C5.55 0 .27 5.28.27 11.77c0 2.07.54 4.09 1.57 5.87L.17 24l6.5-1.7a11.76 11.76 0 0 0 5.37 1.29h.01c6.49 0 11.77-5.28 11.77-11.77 0-3.14-1.22-6.09-3.3-8.34ZM12.05 21.57h-.01a9.77 9.77 0 0 1-4.98-1.36l-.36-.21-3.86 1.01 1.03-3.76-.23-.39a9.76 9.76 0 1 1 8.41 4.71Zm5.36-7.31c-.29-.15-1.72-.85-1.99-.95-.27-.1-.46-.15-.65.15-.19.29-.75.95-.92 1.14-.17.2-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.65-1.57-.89-2.15-.23-.56-.47-.49-.65-.5h-.55c-.19 0-.49.07-.75.37-.26.29-.98.96-.98 2.34s1 2.71 1.14 2.9c.14.2 1.96 2.99 4.75 4.19.66.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.34Z" />
        </svg>
      </a>


      {/* =====================================================
          BACK TO TOP
          ===================================================== */}

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

export default Home;