import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import nalinLogo from "../assets/images/nalinlogo.png";
import "../App.css";

function Terms() {
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
          <FileText size={30} />
        </div>

        <p className="eyebrow">NALIN FITNESS APPARELS</p>

        <h1>
          Terms & <em>Conditions.</em>
        </h1>

        <p className="legal-intro">
          These Terms & Conditions govern your use of the NaLin Fitness
          Apparels website and your interactions with our products and
          services. By using this website, you agree to these terms.
        </p>

        <p className="legal-updated">
          Last updated: October 2026
        </p>

        <section className="legal-section">
          <h2>1. About NaLin Fitness Apparels</h2>

          <p>
            NaLin Fitness Apparels provides fitness apparel, activewear,
            footwear and fitness accessories designed to support an active,
            confident and stylish lifestyle.
          </p>

          <p>
            Our business is located at Weija-New Aplaku, AIT University,
            Sea View Campus, Ghana.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Website Use</h2>

          <p>
            You agree to use this website only for lawful purposes and in a
            manner that does not interfere with the operation, security or
            availability of the website.
          </p>

          <p>
            You must not attempt to gain unauthorized access to any part of
            the website, introduce malicious software, or use the website for
            fraudulent or unlawful activities.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Products and Availability</h2>

          <p>
            We make reasonable efforts to ensure that product descriptions,
            images, prices and availability displayed on the website are
            accurate.
          </p>

          <p>
            However, product availability may change without notice. We
            reserve the right to correct errors, update product information
            or discontinue products where necessary.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Product Images and Colours</h2>

          <p>
            We aim to display our products as accurately as possible.
            However, colours and appearance may vary slightly depending on
            your device, screen settings, lighting and photography.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Orders and Enquiries</h2>

          <p>
            Product enquiries and orders may be initiated through the
            communication channels provided on our website, including
            WhatsApp and telephone contact.
          </p>

          <p>
            An enquiry or order request does not automatically guarantee
            product availability. We may confirm availability, price,
            delivery arrangements and payment details before an order is
            finalized.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Payment</h2>

          <p>
            Our current payment method is Mobile Money (MoMo). Customers
            should only make payments using payment details confirmed by
            NaLin Fitness Apparels through our official communication
            channels.
          </p>

          <p>
            Never share your MoMo PIN, password, OTP or other confidential
            security information with anyone claiming to represent NaLin
            Fitness Apparels.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Pricing</h2>

          <p>
            Product prices may be changed from time to time. Any applicable
            delivery charges or additional costs will be communicated to the
            customer before an order is finalized.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Delivery and Collection</h2>

          <p>
            Delivery or collection arrangements will be agreed with the
            customer when an order is confirmed.
          </p>

          <p>
            Delivery times may vary depending on location, availability,
            traffic, courier arrangements and other circumstances outside
            our reasonable control.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Returns and Exchanges</h2>

          <p>
            Customers should contact NaLin Fitness Apparels as soon as
            possible if they receive an incorrect, damaged or otherwise
            problematic product.
          </p>

          <p>
            Any return or exchange must be discussed with us before the
            product is returned. Eligibility may depend on the condition of
            the product, the reason for the return and the applicable
            circumstances.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Intellectual Property</h2>

          <p>
            Unless otherwise stated, the content of this website, including
            logos, images, text, graphics, designs and branding, belongs to
            or is used by NaLin Fitness Apparels with appropriate rights.
          </p>

          <p>
            You may not reproduce, copy, modify, distribute or commercially
            use our content without permission.
          </p>
        </section>

        <section className="legal-section">
          <h2>11. Third-Party Links</h2>

          <p>
            Our website may contain links to third-party platforms such as
            social media, mapping services or communication services.
          </p>

          <p>
            We are not responsible for the content, availability, security
            or policies of third-party websites and services.
          </p>
        </section>

        <section className="legal-section">
          <h2>12. Limitation of Liability</h2>

          <p>
            We take reasonable steps to keep the website accurate and
            functional. However, we do not guarantee that the website will
            always be available, error-free or completely free from
            interruptions.
          </p>

          <p>
            To the extent permitted by applicable law, NaLin Fitness
            Apparels will not be responsible for losses resulting from
            circumstances beyond our reasonable control.
          </p>
        </section>

        <section className="legal-section">
          <h2>13. Privacy</h2>

          <p>
            Your use of this website is also subject to our Privacy Policy,
            which explains how information provided to us may be collected,
            used and protected.
          </p>

          <p>
            <Link className="legal-inline-link" to="/privacy">
              Read our Privacy Policy
            </Link>
          </p>
        </section>

        <section className="legal-section">
          <h2>14. Changes to These Terms</h2>

          <p>
            NaLin Fitness Apparels may update these Terms & Conditions from
            time to time. Changes will become effective when the updated
            terms are published on this page.
          </p>
        </section>

        <section className="legal-section">
          <h2>15. Contact Us</h2>

          <p>
            If you have questions about these Terms & Conditions, products,
            orders or other services, please contact us through the details
            below.
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

            <strong>Location</strong>
            <span>Weija-New Aplaku, AIT University, Sea View Campus</span>
          </div>
        </section>
      </main>

      <footer className="legal-footer">
        <p>© 2026 NaLin Fitness Apparels. All rights reserved.</p>

        <div>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/">Home</Link>
        </div>
      </footer>
    </div>
  );
}

export default Terms;