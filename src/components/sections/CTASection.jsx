import { Link } from "react-router-dom";
import Button from "../ui/Button";
import Card from "../ui/Card";

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-primary via-primary-light to-primary-dark py-16">
      <div className="content-container text-center text-white">
        <h2 className="text-white">Join the MetroBridge community today</h2>
        <p className="mt-4 max-w-2xl text-slate-100">
          Whether you're seeking mentorship or ready to guide the next
          generation, MetroBridge makes it simple.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/signup">
            <Button size="lg" variant="cta">
              Get Started Free
            </Button>
          </Link>
          <Link to="/contact">
            <Button
              className="border-white text-white hover:bg-white/10"
              size="lg"
              variant="secondary">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
