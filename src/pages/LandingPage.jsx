import { Link } from "react-router-dom";
import ReviewCarousel from "../components/ui/ReviewCarousel";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import MotionReveal from "../components/ui/MotionReveal";
import FeaturesSection from "../components/sections/FeaturesSection";
import AboutSection from "../components/sections/AboutSection";
import { reviews } from "../utils/mockData";

const steps = [
  {
    title: "Create approved account",
    text: "Sign up with your university information and wait for admin approval.",
  },
  {
    title: "Find the right mentor",
    text: "Search mentors by department, course expertise, and availability.",
  },
  {
    title: "Collaborate and grow",
    text: "Book sessions, join video calls, and access learning resources.",
  },
];

const platformHighlights = [
  {
    title: "Approved network",
    text: "Every active member is verified before they can join conversations.",
  },
  {
    title: "Fast collaboration",
    text: "Jump from mentoring to messages, bookings, and resources without friction.",
  },
  {
    title: "Academic support",
    text: "Students get guidance, reminders, and community access in one place.",
  },
];

export default function LandingPage() {
  return (
    <div>
      <section
        className="bg-gradient-to-r from-primary to-primary-light py-16 text-white sm:py-24"
        id="how">
        <div className="content-container grid items-center gap-8 lg:grid-cols-2">
          <MotionReveal className="shine" y={18}>
            <p className="text-small uppercase tracking-widest text-red-100">
              Metropolitan University, Sylhet
            </p>
            <h1 className="mt-4 text-h1 text-white">
              Connect, Learn, Grow Together
            </h1>
            <p className="mt-4 max-w-xl text-body text-slate-100">
              MetroBridge is a secure mentorship and academic collaboration
              platform for freshers, seniors, alumni, and university moderators.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/student-signup">
                <Button size="lg" variant="cta">
                  Get Started
                </Button>
              </Link>
              <Link to="/student-login">
                <Button size="lg" variant="secondary">
                  Sign In
                </Button>
              </Link>
            </div>
          </MotionReveal>
          <MotionReveal delay={120} y={18}>
            <Card className="bg-white/10 p-6 text-white backdrop-blur">
              <h3 className="text-h3 text-white">How it works</h3>
              <div className="mt-5 space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-card border border-white/20 bg-white/10 p-4 transition-all duration-300 hover:translate-x-1 hover:bg-white/15">
                    <p className="text-small font-semibold text-red-100">
                      Step {index + 1}
                    </p>
                    <p className="mt-1 text-body font-semibold text-white">
                      {step.title}
                    </p>
                    <p className="mt-1 text-small text-slate-100">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </MotionReveal>
        </div>
      </section>

      <section className="content-container py-14" id="features">
        <MotionReveal y={20}>
          <FeaturesSection />
        </MotionReveal>
      </section>

      <section className="content-container pb-16" id="benefits">
        <MotionReveal y={18}>
          <Card className="card-hover-strong">
            <h2>Benefits for students</h2>
            <p className="mt-3">
              MetroBridge helps students access trusted mentors, structured
              learning support, and direct career guidance from alumni in one
              professional platform.
            </p>
          </Card>
        </MotionReveal>
      </section>

      <section className="content-container pb-16" id="highlights">
        <MotionReveal y={18}>
          <div className="mb-8 text-center">
            <h2>Built for everyday academic momentum</h2>
            <p className="section-subtitle">
              A few focused layers that keep students, mentors, and moderators
              moving in sync.
            </p>
          </div>
        </MotionReveal>

        <div className="grid gap-4 md:grid-cols-3">
          {platformHighlights.map((item, index) => (
            <MotionReveal delay={index * 70} key={item.title} y={16}>
              <Card className="card-hover-strong border-primary/10 bg-gradient-to-br from-white to-slate-50 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-white">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3>{item.title}</h3>
                <p className="mt-2 text-small text-neutral">{item.text}</p>
              </Card>
            </MotionReveal>
          ))}
        </div>
      </section>

      <AboutSection />

      <section className="bg-slate-50 py-14" id="reviews">
        <div className="content-container">
          <MotionReveal y={18}>
            <h2 className="text-center">What students and mentors say</h2>
            <p className="section-subtitle">
              Join 1,000+ students and mentors transforming academic
              collaboration
            </p>
            <div className="mt-10">
              <ReviewCarousel reviews={reviews} />
            </div>
          </MotionReveal>
        </div>
      </section>

      <section className="border-t border-border bg-white py-14">
        <div className="content-container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <MotionReveal delay={40}>
              <Card className="card-hover-strong text-center p-6">
                <h3 className="text-h2 text-primary">1,240+</h3>
                <p className="mt-2 text-small text-neutral">Active Students</p>
              </Card>
            </MotionReveal>
            <MotionReveal delay={90}>
              <Card className="card-hover-strong text-center p-6">
                <h3 className="text-h2 text-primary">380+</h3>
                <p className="mt-2 text-small text-neutral">
                  Mentors & Advisors
                </p>
              </Card>
            </MotionReveal>
            <MotionReveal delay={140}>
              <Card className="card-hover-strong text-center p-6">
                <h3 className="text-h2 text-primary">8,500+</h3>
                <p className="mt-2 text-small text-neutral">
                  Sessions Completed
                </p>
              </Card>
            </MotionReveal>
            <MotionReveal delay={190}>
              <Card className="card-hover-strong text-center p-6">
                <h3 className="text-h2 text-accent">4.8/5</h3>
                <p className="mt-2 text-small text-neutral">Average Rating</p>
              </Card>
            </MotionReveal>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary to-primary-light py-12 text-white">
        <div className="content-container text-center">
          <h2 className="text-white">
            Ready to transform your academic journey?
          </h2>
          <p className="section-subtitle-light">
            Join MetroBridge today and connect with experienced mentors from
            Metropolitan University.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/student-signup">
              <Button size="lg" variant="cta">
                Create Free Account
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="secondary">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
