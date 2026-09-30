import { useState, useEffect } from 'react';

const TypingText = ({ words, typingSpeed = 80, pauseDuration = 1800, deletingSpeed = 40 }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    let timeout;

    if (!isDeleting && displayText === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    } else {
      const nextText = isDeleting
        ? currentWord.slice(0, displayText.length - 1)
        : currentWord.slice(0, displayText.length + 1);

      timeout = setTimeout(
        () => setDisplayText(nextText),
        isDeleting ? deletingSpeed : typingSpeed
      );
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, wordIndex, words, typingSpeed, pauseDuration, deletingSpeed]);

  return (
    <span className="text-gingham italic inline-block min-h-[1.2em]">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

export default TypingText;