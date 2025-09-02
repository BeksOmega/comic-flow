"use client";

import clsx from "clsx";
import ChoiceGrid from "./components/choice-grid";
import { useState, useEffect } from "react";
import { generateSettings, GenerateSettingsResponse } from "./lib/api";

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
  const [selectedFeels, setSelectedFeels] = useState<string[]>([]);
  const [selectedDraws, setSelectedDraws] = useState<string[]>([]);
  const [inspirations, setInspirations] = useState<string[]>([]);
  const [apiResponse, setApiResponse] =
    useState<GenerateSettingsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerateSettings = async () => {
    if (selectedFeels.length < 3 || selectedDraws.length < 2) {
      setError("Please select 3 feel choices and 2 story draws first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setApiResponse(null);

    try {
      const response = await generateSettings({
        feel_choices: selectedFeels,
        story_draws: selectedDraws,
        inspirations: inspirations,
      });
      setApiResponse(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate settings"
      );
    } finally {
      setIsLoading(false);
    }
  };

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
        onSelectionChange={setSelectedFeels}
      />

      <h1>
        The draw of the story - <span className="text-nowrap">Choose two</span>
      </h1>
      <ChoiceGrid
        className="max-w-2xl pl-4"
        choices={[
          "Character Development",
          "World Building",
          "Plot Twists",
          "Emotional Journey",
          "Action Sequences",
          "Mystery",
          "Romance",
          "Friendship",
          "Growth",
          "Conflict Resolution",
        ]}
        min={2}
        max={2}
        allowUserInput
        onSelectionChange={setSelectedDraws}
      />

      <h1>Your inspirations</h1>
      <ChoiceGrid
        className="max-w-2xl pl-4"
        choices={[
          "Lord of the Rings",
          "Star Wars",
          "Studio Ghibli",
          "Marvel Comics",
          "DC Comics",
          "Anime Classics",
          "Manga Favorites",
          "Literary Works",
          "Films",
          "TV Shows",
        ]}
        min={0}
        max={5}
        allowUserInput
        onSelectionChange={setInspirations}
      />

      {/* Generate Settings Button */}
      <div className="mt-6">
        <button
          onClick={handleGenerateSettings}
          disabled={
            isLoading || selectedFeels.length < 3 || selectedDraws.length < 2
          }
          className={clsx(
            "px-6 py-3 rounded-lg font-medium transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "bg-blue-600 hover:bg-blue-700 text-white",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          )}
        >
          {isLoading ? "Generating..." : "Generate Story Settings"}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* API Response Display */}
      {apiResponse && (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            Generated Story Settings
          </h2>

          {/* Input Summary */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 mb-3">
              Your Input
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong className="text-blue-700">Feel Choices:</strong>
                <p className="text-blue-800">
                  {apiResponse.generated_content.input_feelings.join(", ")}
                </p>
              </div>
              <div>
                <strong className="text-blue-700">Story Draws:</strong>
                <p className="text-blue-800">
                  {apiResponse.generated_content.input_draws.join(", ")}
                </p>
              </div>
              <div>
                <strong className="text-blue-700">Inspirations:</strong>
                <p className="text-blue-800">
                  {apiResponse.generated_content.inspirations_used.length > 0
                    ? apiResponse.generated_content.inspirations_used.join(", ")
                    : "None specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Generated Content */}
          <div className="space-y-4 mb-6">
            <div>
              <strong className="text-green-700">Story Title:</strong>
              <p className="text-green-800">
                {apiResponse.generated_content.story_title}
              </p>
            </div>
            <div>
              <strong className="text-green-700">Main Character:</strong>
              <p className="text-green-800">
                {apiResponse.generated_content.main_character}
              </p>
            </div>
            <div>
              <strong className="text-green-700">Setting:</strong>
              <p className="text-green-800">
                {apiResponse.generated_content.setting}
              </p>
            </div>
            <div>
              <strong className="text-green-700">Plot Hook:</strong>
              <p className="text-green-800">
                {apiResponse.generated_content.plot_hook}
              </p>
            </div>
          </div>

          {/* Raw LLM Response */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              AI Generated Content
            </h3>
            <div className="bg-white p-4 rounded border text-gray-700 whitespace-pre-wrap font-mono text-sm">
              {apiResponse.generated_content.llm_response}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
