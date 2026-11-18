
import { Link } from "react-router-dom";
import "./Facilities.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
const facilities = [
  {
    number: "01",
    title: "Smart Classrooms",
    category: "DIGITAL LEARNING",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&auto=format&fit=crop&q=85",
    description:
      "A comfortable learning environment supported by modern teaching tools and interactive educational experiences.",
  },
  {
    number: "02",
    title: "Science Laboratory",
    category: "PRACTICAL LEARNING",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=900&auto=format&fit=crop&q=85",
    description:
      "An environment where students can explore scientific concepts through experiments and practical activities.",
  },
  {
    number: "03",
    title: "Computer Laboratory",
    category: "TECHNOLOGY",
    image:
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=900&auto=format&fit=crop&q=85",
    description:
      "Opportunities to develop digital literacy, computer knowledge and essential technology skills.",
  },
  {
    number: "04",
    title: "School Library",
    category: "READING & RESEARCH",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=900&auto=format&fit=crop&q=85",
    description:
      "A welcoming reading environment that encourages curiosity, independent learning and knowledge development.",
  },
  {
    number: "05",
    title: "Sports & Playground",
    category: "PHYSICAL DEVELOPMENT",
    image:
      "https://images.unsplash.com/photo-1526676037777-05a232554f77?w=900&auto=format&fit=crop&q=85",
    description:
      "Physical activities and sports opportunities that encourage teamwork, discipline and healthy habits.",
  },
  {
    number: "06",
    title: "Activity Rooms",
    category: "CREATIVE DEVELOPMENT",
    image:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=900&auto=format&fit=crop&q=85",
    description:
      "Spaces that support creativity, communication, collaborative learning and student participation.",
  },
];

const highlights = [
  {
    icon: "01",
    title: "Safe Environment",
    description:
      "A school environment designed with student safety and well-being in mind.",
  },
  {
    icon: "02",
    title: "Modern Learning",
    description:
      "Learning spaces designed to support engaging educational experiences.",
  },
  {
    icon: "03",
    title: "Holistic Growth",
    description:
      "Opportunities for academic, physical, creative and social development.",
  },
];

function Facilities() {
  return (
    <main className="facilities-page">
   <Navbar />
      {/* HERO */}
      <section className="facilities-hero">
        <div className="facilities-hero-overlay"></div>

        <div className="facilities-container facilities-hero-content">

          <div className="facilities-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Facilities</span>
          </div>

          <span className="facilities-eyebrow">
            A BETTER ENVIRONMENT FOR BETTER LEARNING
          </span>

          <h1>
            Spaces That Inspire
            <br />
            <span>Learning & Growth.</span>
          </h1>

          <p>
            Discover an educational environment designed to
            encourage curiosity, creativity, confidence and
            the all-round development of every student.
          </p>

          <a href="#school-facilities" className="facilities-primary-btn">
            Explore Our Facilities <span>→</span>
          </a>

          <div className="facilities-hero-note">
            <span></span>
            COMFORT • LEARNING • DEVELOPMENT
          </div>

        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="facilities-intro section-facilities">
        <div className="facilities-container facilities-intro-grid">

          <div className="facilities-intro-image">
            <img
              src="https://images.unsplash.com/photo-1562774053-701939374585?w=1000&auto=format&fit=crop&q=85"
              alt="School campus building"
              loading="lazy"
            />

            <div className="facilities-image-label">
              <strong>Designed For Learning</strong>
              <span>Every Space Has A Purpose</span>
            </div>
          </div>

          <div className="facilities-intro-content">

            <span className="facilities-section-label">
              OUR CAMPUS ENVIRONMENT
            </span>

            <h2>
              A Place Where
              <span> Potential Comes Alive.</span>
            </h2>

            <p>
              At Springfield School, we believe that a positive
              learning environment plays an important role in
              student development. Our facilities are designed
              to support classroom learning, practical exploration,
              physical activities and creativity.
            </p>

            <div className="facilities-intro-points">
              <div><span>✓</span> Comfortable learning spaces</div>
              <div><span>✓</span> Opportunities for practical learning</div>
              <div><span>✓</span> Activities beyond academics</div>
            </div>

          </div>

        </div>
      </section>

      {/* FACILITIES GRID */}
      <section
        className="facilities-list section-facilities"
        id="school-facilities"
      >
        <div className="facilities-container">

          <div className="facilities-section-heading">
            <span className="facilities-section-label">
              EXPLORE OUR CAMPUS
            </span>

            <h2>
              Facilities For <span>Every Student</span>
            </h2>

            <p>
              Explore the learning spaces and activities that
              contribute to a well-rounded school experience.
            </p>
          </div>

          <div className="facilities-grid">

            {facilities.map((facility) => (
              <article className="facility-card" key={facility.number}>

                <div className="facility-image">
                  <img
                    src={facility.image}
                    alt={facility.title}
                    loading="lazy"
                  />

                  <span className="facility-number">
                    {facility.number}
                  </span>
                </div>

                <div className="facility-card-content">

                  <span className="facility-category">
                    {facility.category}
                  </span>

                  <h3>{facility.title}</h3>

                  <p>{facility.description}</p>

                  <span className="facility-card-bottom">
                    LEARN MORE <span>↗</span>
                  </span>

                </div>

              </article>
            ))}

          </div>

        </div>
      </section>

      {/* CAMPUS HIGHLIGHTS */}
      <section className="facilities-highlights section-facilities">
        <div className="facilities-container">

          <div className="facilities-section-heading">
            <span className="facilities-section-label">
              OUR COMMITMENT
            </span>

            <h2>
              More Than Just <span>Infrastructure.</span>
            </h2>

            <p>
              We aim to create an environment where students
              feel supported, motivated and inspired to grow.
            </p>
          </div>

          <div className="facilities-highlights-grid">

            {highlights.map((item) => (
              <div className="facility-highlight-card" key={item.icon}>

                <span>{item.icon}</span>

                <h3>{item.title}</h3>

                <p>{item.description}</p>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* GALLERY */}
      <section className="facilities-gallery section-facilities">
        <div className="facilities-container">

          <div className="facilities-section-heading">
            <span className="facilities-section-label">
              CAMPUS GALLERY
            </span>

            <h2>
              A Glimpse Of <span>School Life.</span>
            </h2>

            <p>
              Discover the spaces where learning, friendship
              and creativity come together.
            </p>
          </div>

          <div className="facilities-gallery-grid">
            <img
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&auto=format&fit=crop&q=85"
              alt="Students in classroom"
              loading="lazy"
            />

            <img
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=900&auto=format&fit=crop&q=85"
              alt="School library"
              loading="lazy"
            />

            <img
              src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=900&auto=format&fit=crop&q=85"
              alt="Science laboratory"
              loading="lazy"
            />

            <img
              src="https://images.unsplash.com/photo-1526676037777-05a232554f77?w=900&auto=format&fit=crop&q=85"
              alt="Sports and outdoor activities"
              loading="lazy"
            />
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="facilities-cta">
        <div className="facilities-container facilities-cta-content">

          <span>DISCOVER SPRINGFIELD SCHOOL</span>

          <h2>
            The Right Environment.
            <br />
            <strong>A Brighter Future.</strong>
          </h2>

          <p>
            Give your child an opportunity to learn, explore
            and grow in a supportive educational environment.
          </p>

          <div className="facilities-cta-buttons">

            <Link to="/admission/apply">
              Apply For Admission <span>→</span>
            </Link>

            <Link to="/#contact">
              Contact Us
            </Link>

          </div>

        </div>
      </section>
<Footer />
    </main>
  );
}

export default Facilities;
