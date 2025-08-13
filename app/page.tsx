"use client";

import clsx from "clsx";
import ChoiceGrid from "./components/choice-grid";
import { useState, useEffect } from "react";
import LongInput from "./components/long-input";

const FEEL_CHOICES = [
  "Action",
  "Drama",
  "Romance",
  "Comedy",
  "Isekai",
  "Surreal",
  "Cyberpunk",
  "Steampunk",
  "Suspense",
  "Mythic",
  "Thriller",
  "Shojo",
  "Pulp",
  "Noir",
  "Gothic",
  "Magical Realism",
  "Horror",
  "Shonen",
  "Slice of Life",
  "Mecha",
  "Satirical",
  "Space Opera",
  "Historical",
  "Dystopian",
  "War",
  "Cozy",
  "Cutesy",
];

const DRAW_CHOICES = [
  "Mystery",
  "Exploration",
  "Humor",
  "Character",
  "World",
  "Conflict",
];

export default function Home() {
  const [fadeIn, setFadeIn] = useState(false);
  const [inspirations, setInspirations] = useState<string[]>(["", "", ""]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={clsx(
        "m-4 flex flex-col gap-4",
        "transition-expo",
        fadeIn ? "opacity-100 expo-0" : "opacity-0 expo-100"
      )}
    >
      <h1>
        The feel of the experience -{" "}
        <span className="text-nowrap">Choose three</span>
      </h1>
      <ChoiceGrid
        className="max-w-2xl pl-4"
        choices={FEEL_CHOICES}
        min={1}
        max={3}
        allowUserInput
      />

      <h1 className="mt-4">
        The draw of the story - <span className="text-nowrap">Choose two</span>
      </h1>
      <ChoiceGrid
        className="max-w-2xl pl-4"
        choices={DRAW_CHOICES}
        min={1}
        max={2}
        allowUserInput
      />

      <h1 className="mt-4">Your inspirations</h1>
      {inspirations.map((inspiration, index) => (
        <LongInput
          key={index}
          placeholder="Movie, tv show, book, thought"
          value={inspiration}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInspirations([
              ...inspirations.slice(0, index),
              e.target.value,
              ...inspirations.slice(index + 1),
            ])
          }
        />
      ))}
    </div>
  );
}
