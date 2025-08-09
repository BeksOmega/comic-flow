"use client";
import { useState, useRef, useEffect, useCallback } from "react";
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
  const [customChoices, setCustomChoices] = useState<string[]>([]);
  const [fadeCustomChoiceIn, setFadeCustomChoiceIn] = useState<boolean>(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const { playAudio } = useSharedAudio("/audio/pen-circle.wav");

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeCustomChoiceIn(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const isValid = selected.length >= min;

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  const addChoiceSelection = useCallback((choice: string) => {
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
  }, []);

  const removeChoiceSelection = useCallback((choice: string) => {
    setSelected((prev) => prev.filter((item) => item !== choice));
  }, []);

  const updateChoiceSelection = useCallback(
    (oldChoice: string, newChoice: string) => {
      setSelected((prev) => {
        const index = prev.indexOf(oldChoice);
        if (index !== -1) {
          return [...prev.slice(0, index), newChoice, ...prev.slice(index + 1)];
        }
        return prev;
      });
    },
    []
  );

  const debounceCustomChoice = useCallback(
    (value: string) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      setDebounceTimer(
        setTimeout(() => {
          addChoiceSelection(value);
        }, 600)
      );
    },
    [debounceTimer, setDebounceTimer]
  );

  const cancelChoiceDebounce = useCallback(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  }, [debounceTimer]);

  const handleSelectedInput = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number,
      oldChoice: string
    ) => {
      const newChoice = e.target.value;
      if (newChoice === "") {
        setCustomChoices((prev) => [
          ...prev.slice(0, index),
          ...prev.slice(index + 1),
        ]);
        removeChoiceSelection(oldChoice);
      } else {
        setCustomChoices((prev) => [
          ...prev.slice(0, index),
          newChoice,
          ...prev.slice(index + 1),
        ]);
        updateChoiceSelection(oldChoice, newChoice);
      }
    },
    [debounceCustomChoice, removeChoiceSelection, updateChoiceSelection]
  );

  const handleUnselectedInput = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number,
      oldChoice: string
    ) => {
      const newChoice = e.target.value;
      if (newChoice === "") {
        setCustomChoices((prev) => [
          ...prev.slice(0, index),
          ...prev.slice(index + 1),
        ]);
        cancelChoiceDebounce();
      } else {
        if (!oldChoice) {
          setFadeCustomChoiceIn(false);
          setTimeout(() => {
            setFadeCustomChoiceIn(true);
          }, 0);
        }
        setCustomChoices((prev) => [
          ...prev.slice(0, index),
          newChoice,
          ...prev.slice(index + 1),
        ]);
        debounceCustomChoice(newChoice);
      }
    },
    [debounceCustomChoice, removeChoiceSelection, updateChoiceSelection]
  );

  return (
    <div
      className={`flex flex-wrap gap-x-4 gap-y-2 opacity-inherit ${className || ""}`}
    >
      {choices.map((choice) => (
        <div key={`${choice}`}>
          <RoughNotation
            type="circle"
            show={true}
            color="var(--color-neutral-400)"
            strokeWidth={2}
            padding={6}
            animate={false}
            className={clsx(
              "anno:transition-opacity anno:duration-150",
              hovered === choice && !selected.includes(choice)
                ? "anno:opacity-100"
                : "anno:opacity-0"
            )}
          >
            {!selected.includes(choice) && (
              <button
                onClick={() => addChoiceSelection(choice)}
                onMouseEnter={() => setHovered(choice)}
                onMouseLeave={() => setHovered(null)}
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
                onClick={() => addChoiceSelection(choice)}
                onMouseEnter={() => setHovered(choice)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
              >
                {choice}
              </button>
            )}
          </RoughNotation>
        </div>
      ))}
      {allowUserInput &&
        [...customChoices, ""].map((choice, index) => (
          <div
            key={index}
            className={
              choice === ""
                ? clsx(
                    "transition-expo",
                    fadeCustomChoiceIn
                      ? "opacity-100 expo-0"
                      : "opacity-0 expo-100"
                  )
                : ""
            }
          >
            <RoughNotation
              type="underline"
              show={true}
              animate={false}
              color="var(--color-neutral-400)"
              strokeWidth={2}
              padding={0}
              className={clsx(
                "anno:transition-opacity anno:duration-150",
                !selected.includes(choice)
                  ? "anno:opacity-100"
                  : "anno:opacity-0"
              )}
            >
              {!selected.includes(choice) && (
                <input
                  type="text"
                  onClick={() => {
                    if (choice) {
                      addChoiceSelection(choice);
                    }
                  }}
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleUnselectedInput(e, index, choice);
                  }}
                  className={clsx(
                    "max-w-md min-w-[125px] field-sizing-content",
                    "outline-none placeholder:text-neutral-500",
                    "font-prose-italic text-center"
                  )}
                  placeholder="A custom choice"
                  value={choice}
                />
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
                <input
                  type="text"
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleSelectedInput(e, index, choice);
                  }}
                  className={clsx(
                    "max-w-md min-w-[125px] field-sizing-content",
                    "outline-none placeholder:text-neutral-500",
                    "font-prose-italic text-center"
                  )}
                  placeholder="A custom choice"
                  value={choice}
                />
              )}
            </RoughNotation>
          </div>
        ))}
    </div>
  );
}
