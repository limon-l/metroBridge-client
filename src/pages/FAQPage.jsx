import { useState } from "react";
import Card from "../components/ui/Card";
import MotionReveal from "../components/ui/MotionReveal";
import ExpandableContent from "../components/ui/ExpandableContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

const faqCategories = {
  Getting_Started: [
    {
      id: 1,
      question: "How do I create an account on MetroBridge?",
      answer:
        "Click on the 'Sign Up' button, fill in your university information, and submit. Your account will be activated after admin approval, which typically takes 24 hours.",
    },
    {
      id: 2,
      question: "What information do I need to provide during signup?",
      answer:
        "We require your full name, university ID, department, current batch, email address, and a secure password. All information is kept confidential and secure.",
    },
    {
      id: 3,
      question: "Is MetroBridge free to use?",
      answer:
        "Yes! MetroBridge is completely free for all Metropolitan University students, mentors, and alumni. No hidden fees or charges.",
    },
  ],
  Mentorship: [
    {
      id: 4,
      question: "How do I find a mentor?",
      answer:
        "Use our Smart Mentor Discovery feature to search by expertise, department, or availability. Filter results and view mentor profiles with ratings and reviews.",
    },
    {
      id: 5,
      question: "Can I have multiple mentors?",
      answer:
        "Absolutely! Many students benefit from multiple mentors with different expertise areas. You can have as many mentor relationships as you find valuable.",
    },
    {
      id: 6,
      question: "What qualifications do mentors have?",
      answer:
        "All mentors are verified alumni or senior students with proven academic excellence and community vetting. We ensure quality through our review system.",
    },
  ],
  Sessions: [
    {
      id: 7,
      question: "How do I book a mentoring session?",
      answer:
        "Select your desired mentor, choose available time slots, and confirm the booking. You'll receive a confirmation email with video call details.",
    },
    {
      id: 8,
      question: "Can I reschedule or cancel a session?",
      answer:
        "Yes, you can reschedule or cancel up to 24 hours before the session. Same-day cancellations may affect your reliability rating.",
    },
    {
      id: 9,
      question: "What platform is used for video sessions?",
      answer:
        "We use a secure, integrated video calling platform. Sessions are conducted directly in the MetroBridge app with chat and file sharing.",
    },
  ],
  Technical: [
    {
      id: 10,
      question: "What are the system requirements?",
      answer:
        "MetroBridge works on all modern browsers (Chrome, Firefox, Safari, Edge) on desktop and mobile devices. A stable internet connection is recommended.",
    },
    {
      id: 11,
      question: "Is my data secure on MetroBridge?",
      answer:
        "Yes. We use end-to-end encryption, secure authentication, and comply with data protection standards. Your privacy is our top priority.",
    },
    {
      id: 12,
      question: "How do I report a technical issue?",
      answer:
        "Use the 'Quick support' section on our Contact page or email support@metrobridge.edu.bd with details of the issue. Our team responds within 24 hours.",
    },
  ],
};

export default function FAQPage() {
  const [expandedId, setExpandedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Getting_Started");

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const currentFAQs = faqCategories[selectedCategory] || [];

  return (
    <div>
      <section className="banner-surface bg-gradient-to-r from-primary via-primary-light to-accent py-16 text-white sm:py-20">
        <MotionReveal className="content-container text-center" y={16}>
          <h1 className="text-h1 text-white">Frequently Asked Questions</h1>
          <p className="section-subtitle-light text-body">
            Find answers to common questions about MetroBridge, mentorship,
            sessions, and more.
          </p>
        </MotionReveal>
      </section>

      <div className="content-container py-8">
        <MotionReveal y={16}>
          <div className="scroll-x flex gap-3 overflow-x-auto pb-2 lg:justify-center">
            {Object.keys(faqCategories).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full px-4 py-2 font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-primary text-white shadow-lg"
                    : "border border-primary bg-white text-primary hover:bg-primary/5"
                }`}>
                {category.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </MotionReveal>
      </div>

      <div className="content-container pb-16">
        <div className="mx-auto max-w-3xl space-y-4">
          {currentFAQs.map((faq, index) => (
            <MotionReveal delay={index * 50} key={faq.id} y={12}>
              <Card
                className="cursor-pointer transition-all duration-300 hover:shadow-md"
                onClick={() => toggleExpand(faq.id)}>
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="flex-1 text-body font-semibold text-primary">
                      {faq.question}
                    </h3>
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300">
                      <FontAwesomeIcon
                        icon={expandedId === faq.id ? faMinus : faPlus}
                      />
                    </div>
                  </div>

                  <ExpandableContent isOpen={expandedId === faq.id}>
                    <div className="mt-4 border-t border-border pt-4">
                      <p className="text-small leading-relaxed text-neutral">
                        {faq.answer}
                      </p>
                    </div>
                  </ExpandableContent>
                </div>
              </Card>
            </MotionReveal>
          ))}
        </div>
      </div>

      <section className="bg-slate-50 py-12">
        <MotionReveal className="content-container text-center" y={16}>
          <Card className="bg-white p-8">
            <h2 className="text-h2">Didn't find your answer?</h2>
            <p className="mt-3 text-body text-neutral">
              Our support team is here to help with any questions you have.
            </p>
            <div className="mt-6">
              <a
                href="/contact"
                className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg">
                Contact Support
              </a>
            </div>
          </Card>
        </MotionReveal>
      </section>
    </div>
  );
}
