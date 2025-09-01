const API_BASE_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:8000" : "/api"; // For production/static builds

export interface GenerateSettingsRequest {
  feel_choices: string[];
  story_draws: string[];
  inspirations: string[];
}

export interface GenerateSettingsResponse {
  success: boolean;
  message: string;
  generated_content: {
    story_title: string;
    main_character: string;
    setting: string;
    plot_hook: string;
    inspirations_used: string[];
  };
}

export async function generateSettings(
  request: GenerateSettingsRequest
): Promise<GenerateSettingsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generateSettings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error calling generateSettings API:", error);
    throw error;
  }
}

export async function healthCheck(): Promise<{
  status: string;
  service: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error calling health check API:", error);
    throw error;
  }
}
