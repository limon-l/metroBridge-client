import { useEffect, useState } from "react";
import Card from "./Card";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return isVisible ? (
    <button
      className="fixed bottom-6 right-6 z-40 rounded-full bg-primary p-3 text-white shadow-soft transition hover:bg-primary-light hover:scale-110"
      onClick={scrollToTop}
      title="Scroll to top"
      type="button">
      ↑
    </button>
  ) : null;
}
