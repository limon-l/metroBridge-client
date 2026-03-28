import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function ReviewCarousel({
  reviews,
  autoPlay = true,
  interval = 5000,
}) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const reviewCount = reviews?.length ?? 0;

  if (!reviews || reviewCount === 0) return null;

  // Auto-advance when not hovered
  useEffect(() => {
    if (!autoPlay || isHovered || reviewCount === 0) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviewCount);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, isHovered, reviewCount, interval]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % reviewCount);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + reviewCount) % reviewCount);
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  const review = reviews[current];

  return (
    <div className="relative w-full">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 h-[600px] bg-gradient-to-br from-primary/10 via-transparent to-accent/10 blur-3xl" />

      {/* Main carousel container */}
      <div className="relative mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          {/* Left: Text Content */}
          <div className="order-2 space-y-6 lg:order-1">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Success Stories
              </p>
              <h2 className="text-4xl font-bold leading-tight text-dark sm:text-5xl">
                {review.author}
              </h2>
              <p className="text-lg font-medium text-primary">{review.role}</p>
            </div>

            {/* Review stars and text */}
            <div className="space-y-4">
              <div className="flex gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className="text-lg text-accent"
                  />
                ))}
              </div>
              <p className="text-lg leading-relaxed text-gray-600">
                "{review.text}"
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-light px-6 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 active:scale-95">
                Get Started
                <span>→</span>
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-primary px-6 py-3 font-semibold text-primary transition-all duration-300 hover:bg-primary/5">
                Learn More
              </button>
            </div>
          </div>

          {/* Right: Glassmorphic Card */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Decorative blur background */}
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 blur-xl" />

              {/* Main card with glassmorphism */}
              <div className="relative rounded-2xl border border-white/20 bg-white/40 p-8 backdrop-blur-md transition-all duration-500 hover:bg-white/50 hover:shadow-2xl sm:p-10">
                {/* Dashboard preview header */}
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <p className="text-xs font-medium text-neutral">
                    Dashboard Preview
                  </p>
                </div>

                {/* Dashboard content */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="h-3 w-2/3 rounded-full bg-gradient-to-r from-primary/30 to-accent/30" />
                    <div className="h-3 w-full rounded-full bg-gradient-to-r from-primary/20 to-accent/20" />
                    <div className="h-3 w-4/5 rounded-full bg-gradient-to-r from-primary/20 to-accent/20" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <p className="text-xs text-neutral">Sessions</p>
                      <p className="text-xl font-bold text-primary">240+</p>
                    </div>
                    <div className="rounded-lg bg-accent/10 p-3">
                      <p className="text-xs text-neutral">Success Rate</p>
                      <p className="text-xl font-bold text-accent">98%</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div
                      className="h-2 rounded-full bg-primary/20"
                      style={{ width: "75%" }}
                    />
                    <div
                      className="h-2 rounded-full bg-accent/20"
                      style={{ width: "90%" }}
                    />
                    <div
                      className="h-2 rounded-full bg-primary/20"
                      style={{ width: "85%" }}
                    />
                  </div>
                </div>

                {/* Author avatar */}
                <div className="mt-6 flex items-center gap-4 border-t border-white/10 pt-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-lg font-bold text-white">
                    {review.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-dark">{review.author}</p>
                    <p className="text-sm text-neutral">{review.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            aria-label="Previous slide"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-white/50 text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white hover:shadow-lg backdrop-blur"
            onClick={prevSlide}
            type="button"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <span className="text-xl">←</span>
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {reviews.map((_, index) => (
              <button
                aria-label={`Go to slide ${index + 1}`}
                key={index}
                className={`rounded-full transition-all duration-300 ${
                  index === current
                    ? "h-3 w-8 bg-gradient-to-r from-primary to-primary-light shadow-md"
                    : "h-3 w-3 bg-white/40 hover:bg-white/60 backdrop-blur"
                }`}
                onClick={() => goToSlide(index)}
                type="button"
              />
            ))}
          </div>

          <button
            aria-label="Next slide"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-white/50 text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white hover:shadow-lg backdrop-blur"
            onClick={nextSlide}
            type="button"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <span className="text-xl">→</span>
          </button>
        </div>

        {/* Slide counter */}
        <div className="mt-6 text-center">
          <p className="inline-block rounded-full bg-white/40 px-4 py-2 text-sm font-medium text-neutral backdrop-blur">
            {current + 1} / {reviewCount}
          </p>
        </div>
      </div>
    </div>
  );
}
