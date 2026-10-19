import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import nalinLogo from "../assets/images/NalinLogo.PNG";

import {
ArrowRight,
CheckCircle,
ChevronUp,
Clock3,
Mail,
MapPin,
Menu,
Music2,
MessageCircle,
Phone,
Send,
X,
AlertCircle,
} from "lucide-react";

import "../App.css";

import logo from "../assets/images/NalinLogo.PNG";
import cons from "../assets/images/cons.jfif";
import conss from "../assets/images/conss.jfif";

// WEB3FORMS CONFIGURATION
const WEB3FORMS_ACCESS_KEY =
"274f00e1-9586-460a-9ea2-79f83365f859";

function Contact() {
const [menuOpen, setMenuOpen] = useState(false);
const [showBackToTop, setShowBackToTop] = useState(false);

const [submitted, setSubmitted] = useState(false);
const [isSending, setIsSending] = useState(false);
const [submitError, setSubmitError] = useState("");

useEffect(() => {
const handleScroll = () => {
setShowBackToTop(window.scrollY > 500);
};


window.addEventListener("scroll", handleScroll);
handleScroll();

return () => {
  window.removeEventListener("scroll", handleScroll);
};


}, []);

const closeMenu = () => {
setMenuOpen(false);
};

const scrollToTop = () => {
window.scrollTo({
top: 0,
behavior: "smooth",
});
};

// SEND CONTACT FORM THROUGH WEB3FORMS
const handleSubmit = async (event) => {
event.preventDefault();


if (isSending) return;

const form = event.currentTarget;

setIsSending(true);
setSubmitError("");

try {
  const formData = new FormData(form);

  formData.set("access_key", WEB3FORMS_ACCESS_KEY);
  formData.set("subject", "NaLin Website Enquiry");
  formData.set("from_name", "NaLin Fitness Apparels");
  formData.set("replyto", formData.get("email"));

  const response = await fetch(
    "https://api.web3forms.com/submit",
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message ||
        "Your message could not be sent. Please try again."
    );
  }

  setSubmitted(true);
  form.reset();
} catch (error) {
  console.error("NaLin contact form error:", error);

  setSubmitError(
    error.message ||
      "Unable to send your message. Please check your internet connection and try again."
  );
} finally {
  setIsSending(false);
}


};

const handleSendAnotherMessage = () => {
setSubmitted(false);
setSubmitError("");
};

return ( <div className="site contact-page">
{/* TOP BAR */} <div className="top-bar"> <p>FREE DELIVERY ON SELECTED ORDERS • ACCRA, GHANA</p> </div>

```
  {/* NAVBAR — CART ICON REMOVED */}
  <header className="navbar">
    <Link
      to="/"
      className="brand-logo"
      onClick={closeMenu}
    >
      <img
        src={logo}
        alt="NaLin Fitness Apparels logo"
      />
    </Link>

    <nav className="desktop-nav">
      <Link to="/">Home</Link>
      <Link to="/shop">Shop</Link>
      <Link to="/about">About</Link>
      <Link to="/contact" className="active">
        Contact
      </Link>
    </nav>

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
          alt="NaLin Fitness Apparels"
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
      >
        Chat With Us On WhatsApp
        <ArrowRight size={18} />
      </a>
    </div>
  </div>

  <main>
    {/* HERO */}
    <section className="contact-hero">
      <div className="contact-hero-content">
        <p className="eyebrow">GET IN TOUCH</p>

        <h1>
          Let's talk
          <em> Nalin.</em>
        </h1>

        <p>
          Have a question about our products, orders or
          collections? We would love to hear from you.
        </p>

        <a
          href="https://wa.me/233506735003"
          target="_blank"
          rel="noreferrer"
          className="primary-button"
        >
          Chat On WhatsApp
          <ArrowRight size={18} />
        </a>
      </div>

      <div className="contact-hero-image">
        <img
          src={cons}
          alt="NaLin Fitness Apparels lifestyle"
        />

        <div className="contact-hero-label">
          <span>NALIN FITNESS APPARELS</span>
          <strong>WE'RE HERE FOR YOU</strong>
        </div>
      </div>
    </section>

    {/* CONTACT INFORMATION */}
    <section className="contact-details section-padding">
      <div className="section-heading">
        <p className="eyebrow">CONTACT INFORMATION</p>

        <h2>
          Reach us
          <em> directly.</em>
        </h2>

        <p>
          Choose the easiest way to connect with NaLin.
          Whether you want to ask a question or place an
          order, our team is ready to help.
        </p>
      </div>

      <div className="contact-info-grid">
        <a
          href="https://wa.me/233506735003"
          target="_blank"
          rel="noreferrer"
          className="contact-info-card"
        >
          <div className="contact-info-icon">
            <MessageCircle size={22} />
          </div>

          <span>WHATSAPP</span>

          <h3>050 673 5003</h3>

          <p>
            Chat with us directly on WhatsApp.
          </p>

          <strong>
            Message us <ArrowRight size={16} />
          </strong>
        </a>

        <a
          href="tel:+233245432258"
          className="contact-info-card"
        >
          <div className="contact-info-icon">
            <Phone size={22} />
          </div>

          <span>PHONE</span>

          <h3>024 543 2258</h3>

          <p>Call us for enquiries and orders.</p>

          <strong>
            Call now <ArrowRight size={16} />
          </strong>
        </a>

        <a
          href="mailto:nmcdavies1@gmail.com"
          className="contact-info-card"
        >
          <div className="contact-info-icon">
            <Mail size={22} />
          </div>

          <span>EMAIL</span>

          <h3>nmcdavies1@gmail.com</h3>

          <p>Send us an email anytime.</p>

          <strong>
            Send email <ArrowRight size={16} />
          </strong>
        </a>

        <div className="contact-info-card">
          <div className="contact-info-icon">
            <MapPin size={22} />
          </div>

          <span>LOCATION</span>

          <h3>Weija-New Aplaku</h3>

          <p>
            AIT University, Sea View Campus, Accra.
          </p>

          <a
            href="https://maps.google.com/?q=Weija-New+Aplaku+AIT+University+Sea+View+Campus"
            target="_blank"
            rel="noreferrer"
            className="contact-card-link"
          >
            Get directions <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>

    {/* FORM + IMAGE */}
    <section className="contact-form-section section-padding">
      <div className="contact-form-image">
        <img
          src={conss}
          alt="NaLin activewear"
        />

        <div className="contact-form-image-overlay">
          <span>03</span>

          <h3>
            Your next favourite
            <br />
            activewear is waiting.
          </h3>
        </div>
      </div>

      <div className="contact-form-wrapper">
        <p className="eyebrow">SEND A MESSAGE</p>

        <h2>
          Tell us
          <em> what's on your mind.</em>
        </h2>

        {/* SUCCESS MESSAGE */}
        {submitted ? (
          <div
            className="contact-success"
            role="status"
            aria-live="polite"
          >
            <div className="contact-success-icon">
              <CheckCircle size={28} />
            </div>

            <h3>Message sent successfully!</h3>

            <p>
              Thank you for contacting NaLin Fitness
              Apparels. Your message has been submitted.
              We will get back to you as soon as possible.
            </p>

            <button
              type="button"
              className="secondary-button"
              onClick={handleSendAnotherMessage}
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >
            {/* Honeypot spam protection field */}
            <input
              type="checkbox"
              name="botcheck"
              className="hidden"
              tabIndex="-1"
              autoComplete="off"
              aria-hidden="true"
              style={{ display: "none" }}
            />

            <div className="form-row">
              <label>
                <span>Your Name</span>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  autoComplete="name"
                  maxLength={100}
                  required
                />
              </label>

              <label>
                <span>Email Address</span>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  maxLength={254}
                  required
                />
              </label>
            </div>

            <label>
              <span>Subject</span>

              <input
                type="text"
                name="subject"
                placeholder="What can we help you with?"
                maxLength={150}
                required
              />
            </label>

            <label>
              <span>Message</span>

              <textarea
                name="message"
                rows="6"
                placeholder="Write your message..."
                maxLength={5000}
                required
              />
            </label>

            {/* ERROR MESSAGE */}
            {submitError && (
              <div
                className="contact-error"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle size={19} />
                <span>{submitError}</span>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="primary-button form-submit"
              disabled={isSending}
              aria-busy={isSending}
            >
              {isSending
                ? "Sending Message..."
                : "Send Message"}

              {!isSending && <Send size={17} />}
            </button>

            <p className="contact-form-note">
              Your information will be used to respond
              to your enquiry in accordance with our{" "}
              <Link to="/privacy">Privacy Policy</Link>.
            </p>
          </form>
        )}
      </div>
    </section>

    {/* BUSINESS HOURS */}
    <section className="contact-hours section-padding">
      <div className="contact-hours-inner">
        <div>
          <p className="eyebrow">WHEN TO REACH US</p>

          <h2>
            We're here to
            <em> help.</em>
          </h2>
        </div>

        <div className="hours-card">
          <Clock3 size={23} />

          <div>
            <strong>Customer Support</strong>

            <p>
              Monday – Saturday
              <br />
              8:00 AM – 6:00 PM
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* MAP */}
    <section className="contact-location">
      <div className="contact-location-copy">
        <p className="eyebrow">VISIT NALIN</p>

        <h2>
          Come and
          <em> see us.</em>
        </h2>

        <p>
          Find us at Weija-New Aplaku, AIT University,
          Sea View Campus.
        </p>

        <a
          href="https://maps.google.com/?q=Weija-New+Aplaku+AIT+University+Sea+View+Campus"
          target="_blank"
          rel="noreferrer"
          className="primary-button"
        >
          Open In Maps
          <MapPin size={18} />
        </a>
      </div>

      <div className="contact-map">
        <iframe
          title="NaLin Fitness Apparels location"
          src="https://www.google.com/maps?q=Weija-New%20Aplaku%20AIT%20University%20Sea%20View%20Campus&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>

    {/* FINAL CTA */}
    <section className="contact-final-cta">
      <div>
        <p className="eyebrow">READY TO MOVE?</p>

        <h2>
          Your style.
          <em> Your movement.</em>
        </h2>

        <p>
          Explore the NaLin collection and find something
          made for your lifestyle.
        </p>

        <Link to="/shop" className="primary-button">
          Shop The Collection
          <ArrowRight size={18} />
        </Link>
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
          apparel designed to help you move with confidence.
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
        © {new Date().getFullYear()} NaLin Fitness
        Apparels. All rights reserved.
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
      <path d="M20.52 3.48A11.77 11.77 0 0 0 12.04 0C5.55 0 .27 5.28.27 11.77c0 2.07.54 4.09 1.57 5.87L.17 24l6.5-1.7a11.76 11.76 0 0 0 5.37 1.29h.01c6.49 0 11.77-5.28 11.77-11.77 0-3.14-1.22-6.09-3.3-8.34ZM12.05 21.57h-.01a9.77 9.77 0 0 1-4.98-1.36l-.36-.21-3.86 1.01 1.03-3.76-.23-.39a9.76 9.76 0 1 1 8.41 4.71Zm5.36-7.31c-.29-.15-1.72-.85-1.99-.95-.27-.1-.46-.15-.65.15-.19.29-.75.95-.92 1.14-.17.2-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.65-1.57-.89-2.15-.23-.56-.47-.49-.65-.5h-.55c-.19 0-.49.07-.75.37-.26.29-.98.96-.98 2.34s1 2.71 1.14 2.9c.14.2 1.96 2.99 4.75 4.19.66.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.34Z" />
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

export default Contact;
