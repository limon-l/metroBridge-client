import { Link } from "react-router-dom";
import Button from "../ui/Button";
import FeatureShowcase from "../ui/FeatureShowcase";

const platformFeatures = [
  {
    icon: "🔍",
    title: "Smart Mentor Discovery",
    description:
      "Find mentors by expertise, department, and availability using our intelligent matching system.",
  },
  {
    icon: "📅",
    title: "Easy Scheduling",
    description:
      "Book sessions in just 3 steps with flexible time slot selection and automated confirmations.",
  },
  {
    icon: "🎥",
    title: "Video Collaboration",
    description:
      "Professional video calls with integrated chat, file sharing, and session recordings.",
  },
  {
    icon: "🛡️",
    title: "Secure Platform",
    description:
      "University-approved system with role-based access, moderation, and data encryption.",
  },
  {
    icon: "📚",
    title: "Resource Library",
    description:
      "Access curated study materials, notes, and academic resources from mentors.",
  },
  {
    icon: "⭐",
    title: "Community Feedback",
    description:
      "Transparent reviews and ratings help you find the best mentors and build your reputation.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="content-container py-16">
      <div className="mb-12 text-center">
        <h2>Platform features designed for success</h2>
        <p className="mt-3 max-w-2xl text-neutral">
          MetroBridge provides all the tools you need for effective academic
          mentorship and collaboration.
        </p>
      </div>
      <FeatureShowcase features={platformFeatures} />
    </section>
  );
}
