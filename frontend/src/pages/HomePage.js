import "./HomePage.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="homepage refined">
      {/* ===== Hero Section ===== */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">
            Get It Done With <span>Trusted Local Helpers</span>
          </h1>
          <p className="hero-subtitle">
            Your all-in-one platform to hire skilled helpers, outsource tasks,
            and manage your workflow effortlessly.
          </p>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search tasks — cleaning, repairs, tutoring…"
            />
            <button className="btn btn-primary">Search</button>
          </div>
          <div className="hero-buttons">
            <Link to="/signup">
              <button className="btn btn-primary glow">Post a Task</button>
            </Link>

            <Link to="/helpers">
              <button className="btn btn-outline">Find Help</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section className="how refined-section">
        <h2 className="section-title gradient-text">How It Works</h2>
        <div className="how-grid">
          <div className="step-card">
            <div className="icon-circle">1</div>
            <h3>Post Your Task</h3>
            <p>Describe your task and set your budget in under a minute.</p>
          </div>
          <div className="step-card">
            <div className="icon-circle">2</div>
            <h3>Get Proposals</h3>
            <p>
              Helpers near you will send offers. Compare profiles, ratings &
              prices.
            </p>
          </div>
          <div className="step-card">
            <div className="icon-circle">3</div>
            <h3>Get It Done</h3>
            <p>Hire the best fit, chat, track progress & pay securely.</p>
          </div>
        </div>
      </section>

      {/* ===== Categories ===== */}
      <section className="categories refined-section">
        <h2 className="section-title gradient-text">Popular Categories</h2>
        <div className="category-grid">
          {[
            "🛠️ Home Repair",
            "🧼 Cleaning",
            "🐾 Pet Care",
            "🧑‍🏫 Tutoring",
            "🪑 Assembly",
            "🚚 Shifting",
            "⌨️ Data Entry",
            "🛒 Shopping",
          ].map((item) => (
            <div key={item} className="category-card hover-up">
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta refined-section">
        <div className="cta-content">
          <h2>Ready to Simplify Your Life?</h2>
          <p>
            Post your first task now or join as a helper and start earning
            instantly.
          </p>
          <Link to="/signup" className="btn btn-primary glow">
            Get Started
          </Link>
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Hire-a-Helper. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
