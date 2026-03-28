import { useRef, useEffect, useState } from "react";

export default function ExpandableContent({ isOpen, children }) {
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setMaxHeight(contentRef.current.scrollHeight);
    } else {
      setMaxHeight(0);
    }
  }, [isOpen]);

  return (
    <div
      ref={contentRef}
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{
        maxHeight: `${maxHeight}px`,
      }}>
      {children}
    </div>
  );
}
