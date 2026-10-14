function About() {
  return (
    <div className="about-page">

      {/* Hero */}
      <section className="inner-hero">
        <div className="inner-hero-content">
          <span>ABOUT OUR SCHOOL</span>
          <h1>Shaping Minds.<br />Building Futures.</h1>
          <p>
            Discover our story, values and commitment to
            providing meaningful education.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="about-introduction">
        <div className="section-container about-intro-grid">

          <div>
            <span className="section-tag">
              WHO WE ARE
            </span>

            <h2>
              More Than a School,
              <span> A Community.</span>
            </h2>
          </div>

          <div>
            <p>
              Springfield School is a learning community where
              students are encouraged to explore, question,
              create and grow.
            </p>

            <p>
              We believe education should prepare students not
              only for examinations, but also for life. Our
              approach combines strong academics, character
              development, creativity and practical learning.
            </p>
          </div>

        </div>
      </section>

      {/* Mission Vision */}
      <section className="mission-section">

        <div className="section-container">

          <div className="mission-grid">

            <div className="mission-card">
              <div className="mission-icon">🎯</div>

              <h3>Our Mission</h3>

              <p>
                To provide a supportive and inspiring learning
                environment where every student can develop
                knowledge, confidence, character and a passion
                for lifelong learning.
              </p>
            </div>

            <div className="mission-card">
              <div className="mission-icon">🌟</div>

              <h3>Our Vision</h3>

              <p>
                To develop responsible, confident and
                compassionate individuals who are prepared to
                contribute positively to society.
              </p>
            </div>

            <div className="mission-card">
              <div className="mission-icon">🤝</div>

              <h3>Our Values</h3>

              <p>
                Respect, integrity, responsibility, curiosity,
                collaboration and excellence guide everything
                we do.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* Principal */}
      <section className="principal-section">

        <div className="section-container principal-grid">

          <div className="principal-image">
            <div>
              👨‍🏫
            </div>
          </div>

          <div className="principal-content">

            <span className="section-tag">
              PRINCIPAL'S MESSAGE
            </span>

            <h2>
              Every Child Has
              <span> Potential.</span>
            </h2>

            <p>
              Education is one of the most powerful tools we can
              give to a child. At Springfield School, we strive to
              create an environment where students feel safe,
              respected and motivated to learn.
            </p>

            <p>
              Our teachers work closely with students and
              families to ensure that every learner receives the
              guidance and opportunities they need to succeed.
            </p>

            <div className="principal-signature">
              <strong>Dr. Rajesh Sharma</strong>
              <span>Principal, Springfield School</span>
            </div>

          </div>

        </div>

      </section>

      {/* Why Us */}
      <section className="about-features">

        <div className="section-container">

          <div className="section-heading">

            <span className="section-tag">
              OUR APPROACH
            </span>

            <h2>
              What Makes Our
              <span> School Different?</span>
            </h2>

          </div>

          <div className="about-feature-grid">

            <div>
              <strong>01</strong>
              <h3>Student Focused</h3>
              <p>
                Every student's learning journey matters.
              </p>
            </div>

            <div>
              <strong>02</strong>
              <h3>Strong Academics</h3>
              <p>
                We maintain high academic standards.
              </p>
            </div>

            <div>
              <strong>03</strong>
              <h3>Character Building</h3>
              <p>
                We develop responsible and confident students.
              </p>
            </div>

            <div>
              <strong>04</strong>
              <h3>Future Ready</h3>
              <p>
                Students develop skills for a changing world.
              </p>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default About;