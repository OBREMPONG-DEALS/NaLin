import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import nalinLogo from "../assets/images/NalinLogo.PNG";
import "../App.css";
function Privacy() {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <Link to="/" className="legal-logo">
          <img src={nalinLogo} alt="NaLin Fitness Apparels" />
        </Link>

        <Link to="/" className="legal-back">
          <ArrowLeft size={17} />
          Back to Home
        </Link>
      </header>

      <main className="legal-content">
        <div className="legal-icon">
          <ShieldCheck size={30} />
        </div>

        <p className="eyebrow">NALIN FITNESS APPARELS</p>

        <h1>
          Privacy <em>Policy.</em>
        </h1>

        <p className="legal-intro">
          Your privacy matters to us. This Privacy Policy explains how NaLin
          Fitness Apparels collects, uses, protects and handles information
          when you visit or interact with our website.
        </p>

        <p className="legal-updated">
          Last updated: October 2026
        </p>

        <section className="legal-section">
          <h2>1. Information We Collect</h2>

          <p>
            When you contact us, make an enquiry, or interact with our
            services, we may collect information such as your name, email
            address, phone number, delivery information and details you
            voluntarily provide to us.
          </p>

          <p>
            We may also collect basic technical information about your visit,
            such as your browser type, device type and general website usage,
            where applicable.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. How We Use Your Information</h2>

          <p>
            Information you provide may be used to:
          </p>

          <ul>
            <li>Respond to your enquiries and messages.</li>
            <li>Process and manage orders or product requests.</li>
            <li>Communicate with you about products and services.</li>
            <li>Arrange delivery or collection where applicable.</li>
            <li>Improve our website, products and customer experience.</li>
            <li>Prevent fraudulent or unauthorized activity.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. WhatsApp and Other Communication</h2>

          <p>
            NaLin Fitness Apparels may use WhatsApp, phone calls, email and
            social media to communicate with customers. Information shared
            through these platforms may also be subject to the privacy
            policies of the respective platforms.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Payments</h2>

          <p>
            Our current payment method is Mobile Money (MoMo). Payment
            information may be handled through the relevant payment provider
            or telecommunications service. We do not intentionally collect or
            store your MoMo PIN, password or other confidential authentication
            credentials.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Sharing Your Information</h2>

          <p>
            We do not sell your personal information. We may share necessary
            information with trusted service providers where required to
            operate our business, process orders, arrange deliveries,
            communicate with you, or comply with legal obligations.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Data Security</h2>

          <p>
            We take reasonable steps to protect information provided to us
            against unauthorized access, misuse, loss or disclosure. However,
            no internet-based system can be guaranteed to be completely
            secure.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Cookies</h2>

          <p>
            Our website may use cookies or similar technologies where
            necessary to improve website functionality, understand website
            usage and provide a better browsing experience.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Third-Party Services</h2>

          <p>
            Our website may contain links, embedded content or services from
            third parties, including social media platforms and mapping
            services. We are not responsible for the privacy practices of
            third-party websites or services.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Your Rights</h2>

          <p>
            You may contact us to ask about personal information we hold
            about you, request correction of inaccurate information, or raise
            concerns about how your information is being used, subject to
            applicable laws and legitimate business requirements.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Children's Privacy</h2>

          <p>
            Our website is intended for general audiences and is not designed
            to knowingly collect personal information from children without
            appropriate consent.
          </p>
        </section>

        <section className="legal-section">
          <h2>11. Changes to This Policy</h2>

          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in our business, services, technology or legal
            requirements. Updated versions will be posted on this page.
          </p>
        </section>

        <section className="legal-section">
          <h2>12. Contact Us</h2>

          <p>
            If you have questions about this Privacy Policy or how your
            information is handled, please contact NaLin Fitness Apparels.
          </p>

          <div className="legal-contact">
            <strong>Email</strong>
            <a href="mailto:nmcdavies1@gmail.com">
              nmcdavies1@gmail.com
            </a>

            <strong>WhatsApp</strong>
            <a
              href="https://wa.me/233506735003"
              target="_blank"
              rel="noreferrer"
            >
              050 673 5003
            </a>
          </div>
        </section>
      </main>

      <footer className="legal-footer">
        <p>© 2026 NaLin Fitness Apparels. All rights reserved.</p>

        <div>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/">Home</Link>
        </div>
      </footer>
    </div>
  );
}

export default Privacy;