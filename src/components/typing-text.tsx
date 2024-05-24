import { useEffect, useState } from "react";

interface TypingTextProps {
  children: string;
  className: string;
}

export default function TypingText({ children, className }: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < children.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + children[index]);
        setIndex((prev) => prev + 1);
      }, 20);

      return () => clearTimeout(timeout);
    }
  }, [index, children]);

  return <p className={className}>{displayedText}</p>;
}
