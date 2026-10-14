import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="school-home">

      {/* ================= NAVBAR ================= */}
      <header className="navbar">
        <div className="nav-container">

          <Link to="/" className="school-brand">
            <div className="school-logo">S</div>

            <div>
              <h2>Springfield School</h2>
              <span>Knowledge • Character • Excellence</span>
            </div>
          </Link>

          <nav className="nav-menu">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <a href="#academics">Academics</a>
            <a href="#facilities">Facilities</a>
            
            <Link to="/admission/apply">Admissions</Link>
            <a href="#events">Events</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="nav-actions">
            <Link to="/login" className="login-link">
              Login
            </Link>

            <Link to="/register" className="admission-btn">
              Apply Now
            </Link>
          </div>

        </div>
      </header>


      {/* ================= HERO ================= */}
      <section className="hero">

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <span className="hero-small-title">
            WELCOME TO OUR SCHOOL
          </span>

          <h1>
            Building Bright
            <br />
            <span>Futures Together.</span>
          </h1>

          <p>
            We provide a safe, inspiring and inclusive environment
            where every student can learn, grow and achieve their
            full potential.
          </p>

          <div className="hero-buttons">
            <a href="#admission" className="hero-primary-btn">
              Explore Admissions
            </a>

            <a href="#about" className="hero-secondary-btn">
              Discover Our School →
            </a>
          </div>

        </div>

        <div className="hero-bottom">
          <div>
            <strong>25+</strong>
            <span>Years of Excellence</span>
          </div>

          <div>
            <strong>1,500+</strong>
            <span>Students</span>
          </div>

          <div>
            <strong>100+</strong>
            <span>Expert Teachers</span>
          </div>

          <div>
            <strong>98%</strong>
            <span>Success Rate</span>
          </div>
        </div>

      </section>


      {/* ================= ABOUT ================= */}
      <section className="about-section" id="about">

        <div className="section-container about-grid">

          <div className="about-image">
            <div className="image-placeholder">
              <span>🏫</span>
              <p>Our School Campus</p>
            </div>

            <div className="experience-card">
              <strong>25+</strong>
              <span>Years of<br />Educational Excellence</span>
            </div>
          </div>

          <div className="about-content">

            <span className="section-tag">
              ABOUT OUR SCHOOL
            </span>

            <h2>
              Where Learning Meets
              <span> Inspiration</span>
            </h2>

            <p>
              Springfield School is committed to providing quality
              education that develops not only academic excellence
              but also confidence, creativity and strong values.
            </p>

            <p>
              Our dedicated teachers, modern facilities and
              student-focused approach create an environment where
              every child is encouraged to discover their strengths
              and achieve their goals.
            </p>

            <a href="#contact" className="text-link">
              Learn More About Us →
            </a>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section className="features-section" id="academics">

        <div className="section-container">

          <div className="section-heading">
            <span className="section-tag">
              WHY CHOOSE US
            </span>

            <h2>
              Education Beyond
              <span> Classrooms</span>
            </h2>

            <p>
              We focus on the complete development of every student.
            </p>
          </div>


          <div className="features-grid">

            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Quality Education</h3>
              <p>
                Strong academic programs designed to build
                knowledge, curiosity and critical thinking.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👩‍🏫</div>
              <h3>Expert Teachers</h3>
              <p>
                Experienced and caring teachers dedicated to
                helping every student succeed.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔬</div>
              <h3>Modern Learning</h3>
              <p>
                Smart classrooms, laboratories and technology
                supported learning experiences.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚽</div>
              <h3>Sports & Activities</h3>
              <p>
                Sports, arts and extracurricular activities that
                encourage teamwork and creativity.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* ================= ACADEMICS ================= */}
      <section className="academics-section">

        <div className="section-container">

          <div className="section-heading">
            <span className="section-tag">
              OUR ACADEMICS
            </span>

            <h2>
              Learning for Every
              <span> Stage</span>
            </h2>
          </div>


          <div className="academic-grid">

            <div className="academic-card">
              <span className="academic-number">01</span>
              <div className="academic-icon">🌱</div>
              <h3>Primary School</h3>
              <p>
                Building strong foundations through curiosity,
                creativity and engaging learning.
              </p>
              <a href="#contact">Learn More →</a>
            </div>

            <div className="academic-card featured">
              <span className="academic-number">02</span>
              <div className="academic-icon">📖</div>
              <h3>Middle School</h3>
              <p>
                Developing independent thinking, collaboration
                and deeper academic understanding.
              </p>
              <a href="#contact">Learn More →</a>
            </div>

            <div className="academic-card">
              <span className="academic-number">03</span>
              <div className="academic-icon">🎓</div>
              <h3>Senior School</h3>
              <p>
                Preparing students for higher education,
                careers and responsible citizenship.
              </p>
              <a href="#contact">Learn More →</a>
            </div>

          </div>

        </div>

      </section>


      {/* ================= FACILITIES ================= */}
      <section className="facilities-section" id="facilities">

        <div className="section-container">

          <div className="facilities-grid">

            <div className="facilities-content">

              <span className="section-tag">
                OUR FACILITIES
              </span>

              <h2>
                Everything Students
                <span> Need to Thrive</span>
              </h2>

              <p>
                Our campus is designed to provide students with
                comfortable, safe and inspiring spaces for learning,
                creativity and personal development.
              </p>

              <div className="facility-list">

                <div>
                  <span>✓</span>
                  Smart Classrooms
                </div>

                <div>
                  <span>✓</span>
                  Science & Computer Labs
                </div>

                <div>
                  <span>✓</span>
                  Library & Reading Room
                </div>

                <div>
                  <span>✓</span>
                  Sports Ground
                </div>

                <div>
                  <span>✓</span>
                  Transportation
                </div>

                <div>
                  <span>✓</span>
                  Safe & Secure Campus
                </div>

              </div>

            </div>


            <div className="facility-visual">

              <div className="facility-box large">
                <span>🏫</span>
                <strong>Modern Campus</strong>
              </div>

              <div className="facility-box">
                <span>📚</span>
                <strong>Library</strong>
              </div>

              <div className="facility-box">
                <span>⚽</span>
                <strong>Sports</strong>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= ADMISSION ================= */}
      <section className="admission-section" id="admission">

        <div className="admission-container">

          <div>
            <span className="section-tag light">
              ADMISSIONS OPEN
            </span>

            <h2>
              Give Your Child a
              <br />
              <span>Great Start.</span>
            </h2>

            <p>
              Applications are now open for the upcoming
              academic session.
            </p>
          </div>

          <div className="admission-actions">

            <Link to="/admission/apply" className="admission-white-btn">
              Apply for Admission
            </Link>

            <a href="#contact" className="admission-outline-btn">
              Contact Admissions
            </a>

          </div>

        </div>

      </section>


      {/* ================= EVENTS ================= */}
      <section className="events-section" id="events">

        <div className="section-container">

          <div className="section-heading event-heading">

            <div>
              <span className="section-tag">
                SCHOOL LIFE
              </span>

              <h2>
                Latest <span>Events</span>
              </h2>
            </div>

            <a href="#events" className="text-link">
              View All Events →
            </a>

          </div>


          <div className="events-grid">

            <article className="event-card">

              <div className="event-date">
                <strong>15</strong>
                <span>JUN</span>
              </div>

              <div className="event-content">
                <span>School Event</span>
                <h3>Annual Sports Day</h3>
                <p>
                  A day filled with sports, teamwork and
                  exciting competitions.
                </p>
              </div>

            </article>


            <article className="event-card">

              <div className="event-date">
                <strong>22</strong>
                <span>JUN</span>
              </div>

              <div className="event-content">
                <span>Academic</span>
                <h3>Science Exhibition</h3>
                <p>
                  Students present innovative projects and
                  scientific ideas.
                </p>
              </div>

            </article>


            <article className="event-card">

              <div className="event-date">
                <strong>05</strong>
                <span>JUL</span>
              </div>

              <div className="event-content">
                <span>Cultural</span>
                <h3>Cultural Festival</h3>
                <p>
                  Celebrating creativity, culture and
                  student talent.
                </p>
              </div>

            </article>

          </div>

        </div>

      </section>


      {/* ================= CONTACT CTA ================= */}
      <section className="contact-section" id="contact">

        <div className="section-container contact-grid">

          <div>
            <span className="section-tag">
              GET IN TOUCH
            </span>

            <h2>
              Have Questions?
              <span> We're Here to Help.</span>
            </h2>

            <p>
              Contact our school office for admissions,
              academics and other information.
            </p>
          </div>

          <div className="contact-details">

            <div>
              <span>📍</span>
              <div>
                <strong>Visit Us</strong>
                <p>9715 School Road, Sikati parsa saran, India</p>
              </div>
            </div>

            <div>
              <span>📞</span>
              <div>
                <strong>Call Us</strong>
                <p>+91 8102891606</p>
              </div>
            </div>

            <div>
              <span>✉️</span>
              <div>
                <strong>Email Us</strong>
                <p>info@springfieldschool.edu</p>
              </div>
            </div>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="footer">

        <div className="section-container footer-grid">

          <div className="footer-brand">

            <div className="school-brand">
              <div className="school-logo">S</div>

              <div>
                <h2>Springfield School</h2>
                <span>Knowledge • Character • Excellence</span>
              </div>
            </div>

            <p>
              Inspiring young minds to learn, lead and make
              a positive difference in the world.
            </p>

          </div>


          <div className="footer-column">
            <h4>Quick Links</h4>
            <a href="#about">About Us</a>
            <a href="#academics">Academics</a>
            <a href="#facilities">Facilities</a>
            <a href="#admission">Admissions</a>
          </div>


          <div className="footer-column">
            <h4>Information</h4>
            <a href="#events">Events</a>
            <a href="#contact">Contact</a>
            <Link to="/login">Student Login</Link>
            <Link to="/register">Register</Link>
          </div>


          <div className="footer-column">
            <h4>Contact</h4>
            <p>📍 123 School Road</p>
            <p>📞 +91 98765 43210</p>
            <p>✉️ info@springfieldschool.edu</p>
          </div>

        </div>


        <div className="footer-bottom">
          <p>
            © 2026 Springfield School. All rights reserved.
          </p>

          <p>
            Privacy Policy &nbsp; • &nbsp; Terms
          </p>
        </div>

      </footer>

    </div>
  );
}

export default Home;