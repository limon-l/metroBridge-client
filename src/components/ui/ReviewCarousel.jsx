import { useEffect, useMemo, useState } from "react";
import Card from "./Card";

export default function ReviewCarousel({
  reviews,
  autoPlay = true,
  interval = 4500,
}) {
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(autoPlay);

  const reviewCount = reviews?.length ?? 0;

  const visibleReviews = useMemo(() => {
    if (reviewCount <= 1) {
      return (
        reviews?.map((review, index) => ({ review, index, offset: 0 })) ?? []
      );
    }

    return reviews.map((review, index) => {
      let offset = index - current;
      if (offset > reviewCount / 2) {
        offset -= reviewCount;
      }
      if (offset < -reviewCount / 2) {
        offset += reviewCount;
      }
      return { review, index, offset };
    });
  }, [current, reviewCount, reviews]);

  useEffect(() => {
    if (!isAutoPlay || reviewCount === 0) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviewCount);
    }, interval);

    return () => clearInterval(timer);
  }, [isAutoPlay, reviewCount, interval]);

  if (!reviews || reviewCount === 0) return null;

  const goToSlide = (index) => {
    setCurrent(index);
    setIsAutoPlay(false);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % reviewCount);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + reviewCount) % reviewCount);
    setIsAutoPlay(false);
  };

  const getCardStyle = (offset) => {
    const absOffset = Math.abs(offset);
    const isActive = offset === 0;
    const limited = Math.min(absOffset, 3);

    const rotate = offset * 7;
    const translateX = offset * 76;
    const translateY = limited * 14;
    const scale = isActive ? 1 : 1 - limited * 0.08;
    const opacity = absOffset > 3 ? 0 : isActive ? 1 : 0.75 - limited * 0.12;
    const zIndex = 30 - limited;

    return {
      transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
      opacity,
      zIndex,
      pointerEvents: isActive ? "auto" : "none",
    };
  };

  return (
    <div className="relative w-full">
      <div className="relative mx-auto h-[360px] w-full max-w-3xl overflow-hidden rounded-card bg-gradient-to-br from-primary/5 via-white to-accent/5 p-3 sm:h-[330px]">
        <div className="relative h-full w-full">
          {visibleReviews.map(({ review, index, offset }) => (
            <div
              key={index}
              className="absolute left-1/2 top-1/2 w-[92%] max-w-2xl -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
              style={getCardStyle(offset)}>
              <Card className="border-primary/10 bg-white/95 p-6 shadow-soft backdrop-blur">
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-base font-bold text-white sm:h-16 sm:w-16">
                    {review.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-primary">
                      {review.author}
                    </p>
                    <p className="text-small text-neutral">{review.role}</p>
                    <div className="mt-1 flex gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} className="text-accent drop-shadow-sm">
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-body italic leading-relaxed text-gray-700">
                  "{review.text}"
                </p>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          aria-label="Previous review"
          className="rounded-full border border-primary-light bg-white p-2 text-primary transition-all duration-200 hover:-translate-x-0.5 hover:bg-primary hover:text-white"
          onClick={prevSlide}
          type="button">
          ←
        </button>

        {reviews.map((_, index) => (
          <button
            aria-label={`Go to review ${index + 1}`}
            key={index}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === current
                ? "w-8 bg-primary"
                : "w-2.5 bg-border hover:bg-neutral"
            }`}
            onClick={() => goToSlide(index)}
            type="button"
          />
        ))}

        <button
          aria-label="Next review"
          className="rounded-full border border-primary-light bg-white p-2 text-primary transition-all duration-200 hover:translate-x-0.5 hover:bg-primary hover:text-white"
          onClick={nextSlide}
          type="button">
          →
        </button>
      </div>

      <div className="mt-3 text-center text-small text-neutral">
        {current + 1} / {reviewCount}
      </div>
    </div>
  );
}
