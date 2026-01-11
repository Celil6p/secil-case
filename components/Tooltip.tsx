"use client";

import { createPortal } from "react-dom";
import { useEffect, useState, useRef } from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

export function Tooltip({ children, content }: TooltipProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (containerRef.current && isHovered) {
        const rect = containerRef.current.getBoundingClientRect();
        setPosition({
          left: rect.left + rect.width / 2,
          top: rect.top
        });
      }
    };

    updatePosition();
    const handleScroll = () => updatePosition();
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered &&
        createPortal(
          <div
            className="px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded whitespace-nowrap z-[10000] pointer-events-none"
            style={{
              position: "fixed",
              left: `${position.left}px`,
              top: `${position.top}px`,
              transform: "translate(-50%, -100%)",
              marginTop: "-8px"
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />,
          document.body
        )}
    </div>
  );
}
