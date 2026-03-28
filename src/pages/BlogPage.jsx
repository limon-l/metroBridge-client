import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import MotionReveal from "../components/ui/MotionReveal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faUser,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

const blogPosts = [
  {
    id: 1,
    title: "10 Tips for Effective Academic Mentoring",
    excerpt:
      "Learn the essential strategies that top mentors use to help their mentees succeed in academics.",
    content:
      "Effective mentoring is both an art and a science. In this comprehensive guide, we explore 10 proven strategies that successful mentors use to elevate their mentees' academic performance...",
    author: "Dr. Sarah Ahmed",
    date: new Date("2026-03-28"),
    category: "Mentoring",
    readTime: "5 min read",
    image: "🎓",
  },
  {
    id: 2,
    title: "Building Confidence in Your Academic Journey",
    excerpt:
      "Expert advice on overcoming self-doubt and building unshakeable confidence in your studies.",
    content:
      "Confidence is key to academic success. This article explores practical techniques for building and maintaining academic confidence throughout your journey...",
    author: "Prof. Md. Hassan",
    date: new Date("2026-03-25"),
    category: "Personal Growth",
    readTime: "6 min read",
    image: "💪",
  },
  {
    id: 3,
    title: "The Future of Online Education",
    excerpt:
      "Exploring trends and innovations shaping the landscape of digital learning in 2026.",
    content:
      "Online education has evolved dramatically. In this article, we discuss emerging technologies and methodologies that are transforming how students learn...",
    author: "Prof. Farzana Ahmed",
    date: new Date("2026-03-22"),
    category: "Technology",
    readTime: "7 min read",
    image: "🚀",
  },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  const categories = [
    "All",
    ...new Set(blogPosts.map((post) => post.category)),
  ];

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredPosts(blogPosts);
    } else {
      setFilteredPosts(
        blogPosts.filter((post) => post.category === selectedCategory),
      );
    }
  }, [selectedCategory]);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-primary-light to-primary-dark py-16 text-white sm:py-20">
        <MotionReveal className="content-container text-center" y={16}>
          <h1 className="text-h1 text-white">MetroBridge Blog</h1>
          <p className="section-subtitle-light text-body">
            Insights, strategies, and stories from academic mentors and
            students.
          </p>
        </MotionReveal>
      </section>

      {/* Category Filter */}
      <div className="content-container py-8">
        <MotionReveal y={16}>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-primary text-white shadow-lg"
                    : "border border-primary bg-white text-primary hover:bg-primary/5"
                }`}>
                {category}
              </button>
            ))}
          </div>
        </MotionReveal>
      </div>

      {/* Blog Posts Grid */}
      <div className="content-container pb-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post, index) => (
            <MotionReveal delay={index * 70} key={post.id} y={16}>
              <Card className="card-hover-strong flex flex-col">
                {/* Featured Image */}
                <div className="flex h-48 items-center justify-center rounded-t-card bg-gradient-to-br from-primary/10 to-accent/10">
                  <span className="text-6xl">{post.image}</span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  {/* Category Badge */}
                  <span className="inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {post.category}
                  </span>

                  {/* Title */}
                  <h3 className="mt-3 text-h3 font-bold text-primary">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="mt-2 flex-1 text-small text-neutral">
                    {post.excerpt}
                  </p>

                  {/* Meta Information */}
                  <div className="mt-4 space-y-2 border-t border-border pt-4 text-xs text-neutral">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faCalendar}
                        className="text-primary"
                      />
                      <span>{formatDate(post.date)}</span>
                      <span className="ml-auto">{post.readTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faUser} className="text-primary" />
                      <span>{post.author}</span>
                    </div>
                  </div>

                  {/* Read More Button */}
                  <Link to={`/blog/${post.id}`} className="mt-4">
                    <Button variant="cta" size="sm" className="w-full">
                      Read Article
                      <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </MotionReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
