import Card from "../ui/Card";
import MotionReveal from "../ui/MotionReveal";

const teamMembers = [
  {
    name: "Dr. A.K. Azad",
    role: "Platform Director",
    department: "Computer Science & Engineering",
    bio: "20+ years in academic technology",
  },
  {
    name: "Prof. Farzana Ahmed",
    role: "Academic Lead",
    department: "Faculty Coordinator",
    bio: "15+ years in student mentorship",
  },
  {
    name: "Md. Hassan Reza",
    role: "Technical Lead",
    department: "System Architecture",
    bio: "Expert in secure platform design",
  },
  {
    name: "Anika Sultana",
    role: "Community Manager",
    department: "Student Relations",
    bio: "Passionate about student success",
  },
];

export default function AboutSection() {
  return (
    <section className="bg-slate-50 py-16" id="team">
      <div className="content-container">
        <MotionReveal className="mb-12 text-center" y={18}>
          <h2>Trusted by Metropolitan University</h2>
          <p className="section-subtitle">
            MetroBridge is developed and maintained by a dedicated team of
            educators and technologists committed to student success.
          </p>
        </MotionReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <MotionReveal delay={index * 70} key={member.name} y={16}>
              <Card className="card-hover-strong text-center p-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-lg font-bold text-white">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <p className="mt-4 font-semibold text-primary">{member.name}</p>
                <p className="text-small font-medium text-accent">
                  {member.role}
                </p>
                <p className="mt-2 text-small text-neutral">
                  {member.department}
                </p>
                <p className="mt-2 text-small italic text-gray-600">
                  "{member.bio}"
                </p>
              </Card>
            </MotionReveal>
          ))}
        </div>

        <MotionReveal delay={120}>
          <Card className="card-hover-strong mt-12 bg-gradient-to-r from-primary/5 to-accent/5 p-8">
            <h3 className="text-center text-h3">Our Mission</h3>
            <p className="section-subtitle">
              To create a secure, professional mentorship ecosystem that
              empowers Metropolitan University students to achieve academic
              excellence and career success through meaningful guidance from
              experienced mentors and alumni.
            </p>
          </Card>
        </MotionReveal>
      </div>
    </section>
  );
}
