import { useEffect, useState } from "react";
import Badge from "./Badge";
import Card from "./Card";

export default function ReviewCarousel({
  reviews,
  autoPlay = true,
  interval = 5000,
}) {
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(autoPlay);

  useEffect(() => {
    if (!isAutoPlay || reviews.length === 0) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isAutoPlay, reviews.length, interval]);

  if (!reviews || reviews.length === 0) return null;

  const goToSlide = (index) => {
    setCurrent(index);
    setIsAutoPlay(false);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % reviews.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
    setIsAutoPlay(false);
  };

  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-card">
        <div className="relative flex transition-all duration-500">
          {reviews.map((review, index) => (
            <div
              key={index}
              className={`min-w-full transition-opacity duration-500 ${
                index === current ? "opacity-100" : "absolute opacity-0"
              }`}>
              <Card className="card-hover">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-base font-bold text-white">
                    {review.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-primary">
                      {review.author}
                    </p>
                    <p className="text-small text-neutral">{review.role}</p>
                    <div className="mt-1 flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} className="text-accent">
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-body italic text-gray-700">
                  "{review.text}"
                </p>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          className="rounded-full border border-primary-light bg-white p-2 text-primary transition hover:bg-primary hover:text-white"
          onClick={prevSlide}
          type="button">
          ←
        </button>

        {reviews.map((_, index) => (
          <button
            key={index}
            className={`h-3 rounded-full transition ${
              index === current
                ? "w-8 bg-primary"
                : "w-3 bg-border hover:bg-neutral"
            }`}
            onClick={() => goToSlide(index)}
            type="button"
          />
        ))}

        <button
          className="rounded-full border border-primary-light bg-white p-2 text-primary transition hover:bg-primary hover:text-white"
          onClick={nextSlide}
          type="button">
          →
        </button>
      </div>

      <div className="mt-3 text-center text-small text-neutral">
        {current + 1} / {reviews.length}
      </div>
    </div>
  );
}
