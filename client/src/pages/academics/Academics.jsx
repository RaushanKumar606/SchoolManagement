
import { Link } from "react-router-dom";
import "./Academics.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const academicPrograms = [
  {
    number: "01",
    title: "Pre-Primary",
    classes: "Nursery – UKG",
    description:
      "A joyful learning environment focused on creativity, communication, social skills and early childhood development.",
    icon: "✦",
    features: ["Play-Based Learning", "Creative Activities", "Early Literacy"],
  },
  {
    number: "02",
    title: "Primary School",
    classes: "Class 1 – 5",
    description:
      "Building strong academic foundations through interactive lessons, curiosity and practical learning experiences.",
    icon: "✎",
    features: ["Core Subjects", "Activity-Based Learning", "Skill Development"],
  },
  {
    number: "03",
    title: "Middle School",
    classes: "Class 6 – 8",
    description:
      "Encouraging independent thinking, problem-solving and deeper understanding across different subjects.",
    icon: "⌘",
    features: ["Conceptual Learning", "Science Activities", "Critical Thinking"],
  },
  {
    number: "04",
    title: "Secondary School",
    classes: "Class 9 – 10",
    description:
      "Preparing students for board examinations with structured academic guidance and regular assessments.",
    icon: "◎",
    features: ["CBSE Curriculum", "Board Preparation", "Regular Assessments"],
  },
  {
    number: "05",
    title: "Senior Secondary",
    classes: "Class 11 – 12",
    description:
      "Supporting advanced subject learning, career awareness and preparation for higher education.",
    icon: "▤",
    features: ["Advanced Learning", "Career Guidance", "Exam Preparation"],
  },
];

const subjects = [
  { icon: "A", title: "English", description: "Communication and language skills" },
  { icon: "∑", title: "Mathematics", description: "Logical thinking and problem solving" },
  { icon: "⚛", title: "Science", description: "Discovery and practical exploration" },
  { icon: "◎", title: "Social Studies", description: "History, geography and society" },
  { icon: "⌨", title: "Computer Science", description: "Digital and technology skills" },
  { icon: "文", title: "Languages", description: "Language and cultural understanding" },
];

const learningFeatures = [
  {
    icon: "01",
    title: "Student-Centered Learning",
    description:
      "Encouraging every student to participate, explore and develop confidence.",
  },
  {
    icon: "02",
    title: "Experienced Teachers",
    description:
      "Guidance and support from dedicated educators throughout the learning journey.",
  },
  {
    icon: "03",
    title: "Practical Education",
    description:
      "Connecting classroom concepts with activities, experiments and real-life situations.",
  },
  {
    icon: "04",
    title: "Individual Attention",
    description:
      "Supporting students according to their individual learning needs and progress.",
  },
];

function Academics() {
  return (
    <main className="academics-page">
       <Navbar />

      {/* HERO SECTION */}
      <section className="academics-hero">
        <div className="academics-hero-overlay"></div>

        <div className="academics-container academics-hero-content">
          <div className="academics-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Academics</span>
          </div>

          <span className="academics-eyebrow">
            LEARNING TODAY, LEADING TOMORROW
          </span>

          <h1>
            Building Strong Foundations
            <br />
            For A <span>Brighter Future.</span>
          </h1>

          <p>
            At Springfield School, we believe education goes beyond
            textbooks. We inspire students to think, explore, create
            and achieve their full potential.
          </p>

          <div className="academics-hero-buttons">
            <a href="#academic-programs" className="academic-primary-btn">
              Explore Programs <span>→</span>
            </a>

            <a href="#our-approach" className="academic-outline-btn">
              Our Approach
            </a>
          </div>

          <div className="academics-hero-note">
            <span className="hero-note-line"></span>
            CBSE CURRICULUM • PRE-PRIMARY TO CLASS 12
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="academic-intro section-padding">
        <div className="academics-container academic-intro-grid">

          <div className="academic-intro-image">
            <img
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1000&auto=format&fit=crop&q=85"
              alt="Students learning in a classroom"
              loading="lazy"
            />

            <div className="academic-image-label">
              <span>01</span>
              <div>
                <strong>Learn With Purpose</strong>
                <small>Grow With Confidence</small>
              </div>
            </div>
          </div>

          <div className="academic-intro-content">
            <span className="academic-section-label">
              WELCOME TO ACADEMICS
            </span>

            <h2>
              Education That
              <span> Shapes Tomorrow.</span>
            </h2>

            <p>
              Our academic approach focuses on developing knowledgeable,
              confident and responsible individuals. Through a structured
              CBSE curriculum, engaging classroom experiences and
              supportive teachers, we help every student move forward
              with confidence.
            </p>

            <div className="academic-intro-points">
              <div>
                <span>✓</span>
                Strong academic foundation
              </div>
              <div>
                <span>✓</span>
                Concept-based understanding
              </div>
              <div>
                <span>✓</span>
                Holistic student development
              </div>
            </div>

            <a href="#academic-programs" className="academic-text-link">
              Discover Our Programs <span>→</span>
            </a>
          </div>

        </div>
      </section>

      {/* ACADEMIC PROGRAMS */}
      <section
        className="academic-programs section-padding"
        id="academic-programs"
      >
        <div className="academics-container">

          <div className="academic-section-heading">
            <span className="academic-section-label">
              OUR ACADEMIC JOURNEY
            </span>

            <h2>
              Learning For <span>Every Stage</span>
            </h2>

            <p>
              A structured educational journey designed to support
              students from their first classroom experience to
              higher secondary education.
            </p>
          </div>

          <div className="academic-program-grid">
            {academicPrograms.map((program) => (
              <article className="academic-program-card" key={program.number}>
                <div className="program-card-top">
                  <span className="program-number">
                    {program.number}
                  </span>
                  <span className="program-icon">
                    {program.icon}
                  </span>
                </div>

                <span className="program-classes">
                  {program.classes}
                </span>

                <h3>{program.title}</h3>

                <p>{program.description}</p>

                <div className="program-features">
                  {program.features.map((feature) => (
                    <span key={feature}>
                      <span>✓</span> {feature}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* CURRICULUM */}
      <section className="academic-curriculum section-padding">
        <div className="academics-container">

          <div className="academic-section-heading">
            <span className="academic-section-label">
              OUR CURRICULUM
            </span>

            <h2>
              Knowledge Across <span>Every Subject</span>
            </h2>

            <p>
              We provide opportunities for students to develop
              knowledge and skills across essential academic subjects.
            </p>
          </div>

          <div className="academic-subject-grid">
            {subjects.map((subject) => (
              <div className="academic-subject-card" key={subject.title}>
                <div className="subject-icon">
                  {subject.icon}
                </div>

                <div>
                  <h3>{subject.title}</h3>
                  <p>{subject.description}</p>
                </div>

                <span className="subject-arrow">↗</span>
              </div>
            ))}
          </div>

          <div className="curriculum-note">
            <span>✦</span>
            Subject availability and combinations are based on
            the school's approved curriculum and applicable classes.
          </div>

        </div>
      </section>

      {/* TEACHING APPROACH */}
      <section
        className="academic-approach section-padding"
        id="our-approach"
      >
        <div className="academics-container">

          <div className="academic-approach-heading">
            <div>
              <span className="academic-section-label">
                HOW WE TEACH
              </span>

              <h2>
                More Than Just <span>Classroom Learning.</span>
              </h2>
            </div>

            <p>
              We believe meaningful education combines academic
              excellence, practical experiences and personal growth.
            </p>
          </div>

          <div className="academic-approach-grid">
            {learningFeatures.map((feature) => (
              <div className="academic-approach-card" key={feature.icon}>
                <span className="approach-number">
                  {feature.icon}
                </span>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ASSESSMENT */}
      <section className="academic-assessment section-padding">
        <div className="academics-container assessment-grid">

          <div className="assessment-content">
            <span className="academic-section-label">
              STUDENT PROGRESS
            </span>

            <h2>
              Measuring Progress,
              <span> Encouraging Growth.</span>
            </h2>

            <p>
              Assessments help us understand student progress,
              identify learning needs and encourage continuous
              academic improvement.
            </p>

            <div className="assessment-list">
              <div>
                <span>01</span>
                <p>
                  <strong>Periodic Assessments</strong>
                  <small>Regular evaluation of subject understanding.</small>
                </p>
              </div>

              <div>
                <span>02</span>
                <p>
                  <strong>Term Examinations</strong>
                  <small>Evaluation of learning across academic terms.</small>
                </p>
              </div>

              <div>
                <span>03</span>
                <p>
                  <strong>Progress Reports</strong>
                  <small>Tracking academic performance and development.</small>
                </p>
              </div>
            </div>
          </div>

          <div className="assessment-image">
            <img
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1000&auto=format&fit=crop&q=85"
              alt="Student writing an examination"
              loading="lazy"
            />

            <div className="assessment-image-caption">
              <strong>Every Step Matters.</strong>
              <span>Recognizing effort. Celebrating progress.</span>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="academic-cta">
        <div className="academics-container academic-cta-content">

          <span>YOUR CHILD'S FUTURE STARTS HERE</span>

          <h2>
            Give Your Child The
            <br />
            Foundation To <strong>Excel.</strong>
          </h2>

          <p>
            Discover an educational environment where curiosity
            meets opportunity and every student is encouraged to grow.
          </p>

          <div className="academic-cta-buttons">
            <Link to="/admission/apply" className="academic-cta-btn">
              Apply For Admission <span>→</span>
            </Link>

            <Link to="/#contact" className="academic-cta-outline">
              Contact Us
            </Link>
          </div>

        </div>
      </section>
<Footer />
    </main>
  );
}

export default Academics;
