
import React from "react";
import { Link } from "react-router-dom";
import "./Events.css";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";

const upcomingEvents = [
  {
    date: "15",
    month: "DEC",
    category: "Cultural",
    title: "Annual Function",
    description:
      "A celebration of student talent through dance, music, drama and cultural performances.",
    time: "10:00 AM onwards",
  },
  {
    date: "22",
    month: "DEC",
    category: "Sports",
    title: "Annual Sports Day",
    description:
      "An exciting day of sports competitions, teamwork and athletic achievements.",
    time: "09:00 AM onwards",
  },
  {
    date: "10",
    month: "JAN",
    category: "Academic",
    title: "Science Exhibition",
    description:
      "Explore innovative ideas, creative models and scientific projects by our students.",
    time: "11:00 AM onwards",
  },
];

const pastEvents = [
  {
    title: "Independence Day",
    image:
      "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "School Activities",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Cultural Celebration",
    image:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=800&q=80",
  },
];

function Events() {
  return (
    <main className="events-page">
<Navbar />
      {/* HERO */}
      <section className="events-hero">
        <div className="events-hero-overlay">
          <span className="events-tag">SPRINGFIELD SCHOOL</span>
          <h1>School Events & Activities</h1>
          <p>
            Celebrating learning, creativity, talent and unforgettable
            school memories.
          </p>
          <a href="#upcoming-events" className="events-primary-btn">
            Explore Events
          </a>
        </div>
      </section>

      {/* INTRO */}
      <section className="events-intro section-container">
        <span className="events-subtitle">LIFE AT SPRINGFIELD</span>
        <h2>Every Event Creates a Memory</h2>
        <p>
          At Springfield School, we believe that education goes beyond
          classrooms. Our events encourage students to discover their
          talents, develop confidence and build lasting friendships.
        </p>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="upcoming-events section-container" id="upcoming-events">
        <div className="events-section-heading">
          <div>
            <span className="events-subtitle">SAVE THE DATE</span>
            <h2>Upcoming Events</h2>
          </div>
          <p>Be a part of our exciting school celebrations.</p>
        </div>

        <div className="upcoming-events-grid">
          {upcomingEvents.map((event, index) => (
            <article className="event-card" key={index}>
              <div className="event-date">
                <strong>{event.date}</strong>
                <span>{event.month}</span>
              </div>

              <span className="event-category">{event.category}</span>
              <h3>{event.title}</h3>
              <p>{event.description}</p>

              <div className="event-time">
                <span>◷</span> {event.time}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* EVENT CATEGORIES */}
      <section className="event-categories">
        <div className="section-container">
          <div className="events-intro">
            <span className="events-subtitle">EXPLORE ACTIVITIES</span>
            <h2>Events for Every Interest</h2>
          </div>

          <div className="event-category-grid">
            <div className="category-box">
              <span>🏆</span>
              <h3>Sports Events</h3>
              <p>Building teamwork, discipline and sportsmanship.</p>
            </div>

            <div className="category-box">
              <span>🎭</span>
              <h3>Cultural Events</h3>
              <p>Celebrating creativity, art, music and traditions.</p>
            </div>

            <div className="category-box">
              <span>🔬</span>
              <h3>Academic Events</h3>
              <p>Encouraging innovation, curiosity and discovery.</p>
            </div>

            <div className="category-box">
              <span>🇮🇳</span>
              <h3>National Celebrations</h3>
              <p>Developing patriotism and respect for our nation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PAST EVENTS */}
      <section className="past-events section-container">
        <div className="events-intro">
          <span className="events-subtitle">OUR MEMORIES</span>
          <h2>Moments We Cherish</h2>
          <p>A glimpse of celebrations and activities at our school.</p>
        </div>

        <div className="past-events-grid">
          {pastEvents.map((event, index) => (
            <div className="past-event-card" key={index}>
              <img src={event.image} alt={event.title} />
              <div>
                <h3>{event.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="events-cta">
        <div className="section-container">
          <span>BE A PART OF OUR JOURNEY</span>
          <h2>Learning Is Better When We Celebrate Together</h2>
          <p>
            Discover the joy of learning and growing at Springfield School.
          </p>
          <Link to="/admission/apply" className="events-primary-btn">
            Join Springfield
          </Link>
        </div>
      </section>
<Footer />
    </main>
  );
}

export default Events;
