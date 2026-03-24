import ContactForm from "../components/dashboard/ContactForm";
import Card from "../components/ui/Card";
import MotionReveal from "../components/ui/MotionReveal";

const contactInfo = [
  {
    icon: "📍",
    title: "Visit us",
    content: "Metropolitan University, Sylhet, Bangladesh",
  },
  {
    icon: "📧",
    title: "Email",
    content: "support@metrobridge.edu.bd",
  },
  {
    icon: "📞",
    title: "Phone",
    content: "+880 1XXX-XXX-XXX",
  },
  {
    icon: "⏰",
    title: "Office Hours",
    content: "Sun-Thu: 9:00 AM - 5:00 PM (UTC+6)",
  },
];

export default function ContactPage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-primary via-primary-light to-primary-dark py-12 text-white sm:py-16">
        <MotionReveal className="content-container text-center" y={16}>
          <h1 className="text-h1 text-white">Contact our team</h1>
          <p className="mt-2 max-w-2xl text-body text-slate-100">
            Have questions? Our support team is here to help with your
            mentorship journey at MetroBridge.
          </p>
        </MotionReveal>
      </section>

      <div className="content-container py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <MotionReveal y={20}>
            <ContactForm />
          </MotionReveal>

          <div className="space-y-4">
            {contactInfo.map((info, index) => (
              <MotionReveal delay={index * 70} key={info.title} y={16}>
                <Card className="card-hover-strong p-5">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{info.icon}</div>
                    <div>
                      <p className="font-semibold text-primary">{info.title}</p>
                      <p className="mt-1 text-small text-neutral">
                        {info.content}
                      </p>
                    </div>
                  </div>
                </Card>
              </MotionReveal>
            ))}

            <MotionReveal delay={280} y={16}>
              <Card className="card-hover-strong bg-primary p-6 text-white">
                <h3 className="text-h3 text-white">Quick support</h3>
                <p className="mt-2 text-small text-slate-100">
                  For urgent issues, reach out to our support team via email or
                  visit our office during business hours.
                </p>
              </Card>
            </MotionReveal>
          </div>
        </div>
      </div>

      <section className="border-t border-border bg-slate-50 py-12">
        <div className="content-container">
          <MotionReveal y={20}>
            <Card className="bg-white p-8">
              <h2 className="text-center">Frequently asked questions</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    q: "How do I create an account?",
                    a: "Sign up on our platform and wait for admin approval.",
                  },
                  {
                    q: "Are there any fees?",
                    a: "MetroBridge is free for Metropolitan University students.",
                  },
                  {
                    q: "How do I book a mentor session?",
                    a: "Find a mentor and complete booking in just 3 steps.",
                  },
                  {
                    q: "Is my data secure?",
                    a: "Yes, we use industry-standard encryption for all data.",
                  },
                ].map((faq) => (
                  <div
                    key={faq.q}
                    className="rounded-card border border-border p-4">
                    <p className="font-semibold text-primary">{faq.q}</p>
                    <p className="mt-2 text-small text-neutral">{faq.a}</p>
                  </div>
                ))}
              </div>
            </Card>
          </MotionReveal>
        </div>
      </section>
    </div>
  );
}
