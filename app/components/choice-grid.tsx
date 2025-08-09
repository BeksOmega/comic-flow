"use client";
import { useState, useRef, useEffect } from "react";
import { RoughNotation } from "react-rough-notation";
import clsx from "clsx";

// Shared audio instance - only one per page
let sharedAudioInstance: HTMLAudioElement | null = null;

const useSharedAudio = (audioSrc: string) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!sharedAudioInstance) {
      sharedAudioInstance = new Audio(audioSrc);
      sharedAudioInstance.preload = "auto";
      sharedAudioInstance.volume = 0.5;
      sharedAudioInstance.addEventListener("canplaythrough", () => {
        setIsLoaded(true);
      });
    }
  }, [audioSrc]);

  const playAudio = () => {
    if (sharedAudioInstance) {
      sharedAudioInstance.currentTime = 0; // Reset to beginning
      sharedAudioInstance.play().catch((error) => {
        console.log("Audio play failed:", error);
      });
    }
  };

  return { playAudio, isLoaded };
};

export default function ChoiceGrid({
  className,
  choices,
  min,
  max,
  onValidityChange,
  allowUserInput,
}: {
  className?: string;
  choices: string[];
  min: number;
  max: number;
  onValidityChange?: (isValid: boolean) => void;
  allowUserInput?: boolean;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const { playAudio } = useSharedAudio("/audio/pen-circle.wav");

  const isValid = selected.length >= min;

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  const handleChoiceClick = (choice: string) => {
    setSelected((prev) => {
      if (prev.includes(choice)) {
        return prev.filter((item) => item !== choice);
      } else {
        playAudio();
        if (prev.length >= max) {
          return [...prev.slice(1, max), choice];
        }
        return [...prev, choice];
      }
    });
  };

  return (
    <div
      className={`flex flex-wrap gap-x-4 gap-y-2 opacity-inherit ${className || ""}`}
    >
      {choices.map((choice) => (
        <div key={`${choice}`}>
          <RoughNotation
            type="circle"
            show={hovered === choice && !selected.includes(choice)}
            color="var(--color-neutral-400)"
            strokeWidth={2}
            padding={6}
            animate={false}
          >
            {!selected.includes(choice) && (
              <button
                onClick={() => handleChoiceClick(choice)}
                onMouseEnter={() => setHovered(choice)}
                onMouseLeave={() => setHovered(null)}
                onMouseDown={() => setHovered(null)}
                onMouseUp={() => setHovered(choice)}
                className="cursor-pointer"
              >
                {choice}
              </button>
            )}
          </RoughNotation>
          <RoughNotation
            type="circle"
            show={selected.includes(choice)}
            color="var(--color-neutral-950)"
            strokeWidth={2}
            padding={6}
            animationDuration={400}
          >
            {selected.includes(choice) && (
              <button
                onClick={() => handleChoiceClick(choice)}
                onMouseEnter={() => setHovered(choice)}
                onMouseLeave={() => setHovered(null)}
                onMouseDown={() => setHovered(null)}
                onMouseUp={() => setHovered(choice)}
                className="cursor-pointer"
              >
                {choice}
              </button>
            )}
          </RoughNotation>
        </div>
      ))}
      {allowUserInput && (
        <RoughNotation
          type="underline"
          show={true}
          animate={false}
          color="var(--color-neutral-400)"
          strokeWidth={2}
          padding={0}
        >
          <input
            type="text"
            className={clsx(
              "max-w-md outline-none",
              "font-prose-italic placeholder:text-neutral-500 field-sizing-content"
            )}
            placeholder="A custom choice"
          />
        </RoughNotation>
      )}
    </div>
  );
}
