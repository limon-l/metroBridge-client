import { useParams, Link, useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import MotionReveal from "../components/ui/MotionReveal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const blogPosts = [
  {
    id: 1,
    title: "10 Tips for Effective Academic Mentoring",
    excerpt:
      "Learn the essential strategies that top mentors use to help their mentees succeed in academics.",
    author: "Dr. Sarah Ahmed",
    date: new Date("2026-03-28"),
    category: "Mentoring",
    readTime: "5 min read",
    image: "🎓",
    content: `
Effective mentoring is both an art and a science. In this comprehensive guide, we explore 10 proven strategies that successful mentors use to elevate their mentees' academic performance.

## 1. Establish Clear Goals

The foundation of successful mentoring is setting clear, achievable academic goals. Work with your mentee to establish short-term and long-term objectives that are SMART (Specific, Measurable, Achievable, Relevant, Time-bound).

## 2. Create a Structured Schedule

Consistency matters. Meet regularly with your mentee at scheduled times. This creates accountability and demonstrates your commitment to their success.

## 3. Listen More Than You Speak

Great mentors ask powerful questions and listen deeply to their mentees' concerns. This approach builds trust and helps mentees discover their own solutions.

## 4. Provide Constructive Feedback

Balance positive reinforcement with constructive criticism. Focus on specific behaviors and their impact, not on personal judgment.

## 5. Share Your Experiences

Personal anecdotes about your own academic challenges and how you overcame them can be incredibly powerful. It shows that struggles are normal and surmountable.

## 6. Encourage Critical Thinking

Rather than giving all the answers, guide your mentees to think critically and solve problems independently. This builds confidence and self-reliance.

## 7. Build a Growth Mindset

Help your mentees understand that abilities can be developed through dedication and hard work. This mindset is crucial for long-term academic success.

## 8. Create a Safe Learning Environment

Your mentee should feel comfortable asking questions and making mistakes without judgment. A safe environment is essential for growth.

## 9. Connect Them with Resources

Know what resources are available and connect your mentees with books, courses, study groups, and other mentors who can help them grow.

## 10. Celebrate Progress

Acknowledge and celebrate even small wins. Recognition motivates continued effort and reinforces positive behaviors.

Remember, effective mentoring is a two-way relationship built on mutual respect and commitment to growth.
    `,
  },
  {
    id: 2,
    title: "Building Confidence in Your Academic Journey",
    excerpt:
      "Expert advice on overcoming self-doubt and building unshakeable confidence in your studies.",
    author: "Prof. Md. Hassan",
    date: new Date("2026-03-25"),
    category: "Personal Growth",
    readTime: "6 min read",
    image: "💪",
    content: `
Confidence is key to academic success. This article explores practical techniques for building and maintaining academic confidence throughout your journey.

## Understanding Academic Confidence

Academic confidence is the belief in your ability to learn, understand, and successfully complete academic tasks. It's different from arrogance—it's based on your actual competence and growth potential.

## Start with Small Wins

Begin with manageable tasks and gradually increase difficulty. Each small success builds your confidence for bigger challenges ahead.

## Practice Deliberate Learning

Focus on deep understanding rather than memorization. When you truly understand concepts, confidence naturally follows.

## Embrace Mistakes

Mistakes are learning opportunities, not failures. Every error brings you closer to mastery. Reframe your relationship with failure.

## Seek Support Strategically

Don't hesitate to ask for help when needed. Using resources shows strength, not weakness. Study groups, tutors, and mentors are valuable assets.

## Develop a Growth Mindset

Believe that your abilities can be developed. This mindset shift is transformative and directly impacts your academic confidence.

Remember: confidence is built through consistent effort, learning from setbacks, and celebrating progress.
    `,
  },
  {
    id: 3,
    title: "The Future of Online Education",
    excerpt:
      "Exploring trends and innovations shaping the landscape of digital learning in 2026.",
    author: "Prof. Farzana Ahmed",
    date: new Date("2026-03-22"),
    category: "Technology",
    readTime: "7 min read",
    image: "🚀",
    content: `
Online education has evolved dramatically. In this article, we discuss emerging technologies and methodologies that are transforming how students learn.

## AI-Powered Personalized Learning

Artificial intelligence is enabling personalized learning paths tailored to individual student needs. Adaptive systems adjust content difficulty and pacing in real-time.

## Virtual Reality Classrooms

VR technology is creating immersive learning experiences that bring abstract concepts to life. Imagine studying geology in a virtual earthquake simulator!

## Collaborative Learning Platforms

Modern platforms emphasize peer collaboration and mentoring. Communities of learners support each other through online forums and study groups.

## Microlearning and Just-in-Time Education

Breaking content into bite-sized modules makes learning more accessible and flexible for busy students.

## Data-Driven Learning Analytics

Institutions are using analytics to identify struggling students early and provide targeted interventions.

## Accessibility and Inclusivity

Online education removes geographical barriers and accommodates diverse learning styles and physical abilities.

The future of education is hybrid, personalized, and student-centric. MetroBridge is proud to be at the forefront of this revolution.
    `,
  },
];

export default function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find((p) => p.id === parseInt(id));

  if (!post) {
    return (
      <div className="content-container py-16 text-center">
        <h1 className="text-h1 text-primary">Article Not Found</h1>
        <p className="mt-4 text-neutral">
          The article you're looking for doesn't exist.
        </p>
        <Link to="/blog" className="mt-6 inline-block">
          <Button variant="cta">Back to Blog</Button>
        </Link>
      </div>
    );
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      {/* Back Button */}
      <div className="content-container py-6">
        <button
          onClick={() => navigate("/blog")}
          className="inline-flex items-center gap-2 text-primary transition-all duration-200 hover:gap-3">
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Blog
        </button>
      </div>

      {/* Article Header */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
        <MotionReveal className="content-container space-y-6" y={16}>
          <div>
            <span className="inline-block rounded-full bg-primary/20 px-4 py-1 text-sm font-semibold text-primary">
              {post.category}
            </span>
            <h1 className="mt-4 text-h1 text-primary">{post.title}</h1>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-small text-neutral">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-primary" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendar} className="text-primary" />
              <span>{formatDate(post.date)}</span>
            </div>
            <span>{post.readTime}</span>
          </div>
        </MotionReveal>
      </section>

      {/* Featured Image */}
      <div className="bg-gradient-to-b from-primary/5 to-accent/5 py-12">
        <div className="flex items-center justify-center">
          <span className="text-9xl">{post.image}</span>
        </div>
      </div>

      {/* Article Content */}
      <article className="content-container py-16">
        <MotionReveal y={16}>
          <Card className="p-8 sm:p-12">
            <div className="prose prose-lg max-w-4xl space-y-6 text-neutral">
              {post.content.split("\n").map((paragraph, index) => {
                if (paragraph.startsWith("##")) {
                  return (
                    <h2
                      key={index}
                      className="mt-8 text-h2 font-bold text-primary first:mt-0">
                      {paragraph.replace("## ", "")}
                    </h2>
                  );
                }
                if (paragraph.trim()) {
                  return (
                    <p key={index} className="leading-relaxed">
                      {paragraph}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          </Card>
        </MotionReveal>
      </article>

      {/* CTA Section */}
      <section className="bg-slate-50 py-12">
        <MotionReveal className="content-container text-center" y={16}>
          <Card className="bg-white p-8">
            <h2 className="text-h2">Ready to start your mentorship journey?</h2>
            <p className="mt-3 text-body text-neutral">
              Connect with experienced mentors and accelerate your academic
              growth.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/student-signup">
                <Button variant="cta">Get Started</Button>
              </Link>
              <Link to="/blog">
                <Button variant="secondary">More Articles</Button>
              </Link>
            </div>
          </Card>
        </MotionReveal>
      </section>
    </div>
  );
}
