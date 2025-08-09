"use client";

import clsx from "clsx";
import ChoiceGrid from "./components/choice-grid";
import { useState, useEffect } from "react";

const FEEL_CHOICES = [
  "Action",
  "Drama",
  "Romance",
  "Comedy",
  "Isekai",
  "Surreal",
  "Cyberpunk",
  "Steampunk",
  "Mythic",
  "Shojo",
  "Pulpy",
  "Noir",
  "Gothic",
  "Magical Realism",
  "Horror",
  "Shonen",
  "Slice of Life",
  "Mecha",
  "Utopian",
  "Satirical",
  "Space Opera",
  "Historical",
  "Dystopian",
  "War",
  "Cozy",
  "Cutesy",
];

export default function Home() {
  const [fadeIn, setFadeIn] = useState(false);

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
        min={3}
        max={3}
        allowUserInput
      />

      <h1>
        The draw of the story - <span className="text-nowrap">Choose two</span>
      </h1>

      <h1>Your inspirations</h1>
    </div>
  );
}
