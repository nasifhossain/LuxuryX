import { Link } from "react-router-dom";
import "./style.css"; // Importing premium styles
import Navbar from "../../navbar";

function Home() {
  return (
    <div className="home-container">
      <Navbar/>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Elevate Your Lifestyle</h1>
          <p>Experience the perfect blend of craftsmanship and innovation.</p>
          <Link to="/product-list" className="btn explore-btn">Explore Our Collection</Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured">
        <h2>Discover Excellence</h2>
        <div className="featured-items">
          <div className="item">
            <img src="https://zealande.com/cdn/shop/articles/1689684177_Masque_Everything_to_luxury_0965d66e-de02-4bf5-a5bf-7ee5d3c883a3.webp?v=1742469526" alt="Luxury Watch" />
            <p>Timeless Elegance</p>
          </div>
          <div className="item">
            <img src="https://hips.hearstapps.com/hmg-prod/images/bella-emar-is-seen-wearing-my-essential-wardrobe-vest-na-kd-news-photo-1721744803.jpg?crop=0.668xw:1.00xh;0.167xw,0&resize=1120:*" alt="Designer Bag" />
            <p>Premium Craftsmanship</p>
          </div>
          <div className="item">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIcquvJb2WkvPqNRsnX_uzABlRzBm1WAEfPw&s" alt="Smart Gadget" />
            <p>Next-Gen Innovation</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonial-container">
          <div className="testimonial">
            <p>"LuxuryX redefines elegance. Their watches are truly a masterpiece!"</p>
            <span>- Sarah J.</span>
          </div>
          <div className="testimonial">
            <p>"The craftsmanship in every product is simply unmatched. A true luxury experience."</p>
            <span>- Mark T.</span>
          </div>
        </div>
      </section>

      {/* Trusted Brands */}
      <section className="trusted-brands">
        <h2>Trusted By The Best</h2>
        <div className="brand-logos">
          <img src="https://brandeps.com/logo-download/H/H-&-M-logo-01.png" alt="Brand 1" />
          <img src="https://brandeps.com/logo-download/L/Levis-logo-vector-01.svg" alt="Brand 2" />
          <img src="https://brandeps.com/logo-download/P/Polo-Ralph-Lauren-logo-vector-01.svg" alt="Brand 3" />
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="newsletter">
        <h2>Join Our Exclusive Club</h2>
        <p>Subscribe and get early access to limited edition products.</p>
        <input type="email" placeholder="Enter your email" />
        <button className="btn subscribe-btn">Subscribe</button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 LuxuryX. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
