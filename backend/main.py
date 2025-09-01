from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

# Pydantic model for the request
class GenerateSettingsRequest(BaseModel):
    feel_choices: List[str]
    story_draws: List[str]
    inspirations: List[str] = []

# Pydantic model for the response
class GenerateSettingsResponse(BaseModel):
    success: bool
    message: str
    generated_content: dict

@app.post("/api/generateSettings", response_model=GenerateSettingsResponse)
async def generate_settings(request: GenerateSettingsRequest):
    """
    Dummy API endpoint for generating story settings based on user choices.
    This will be the first thing you build out.
    """
    # Dummy logic - replace with your actual implementation
    dummy_content = {
        "story_title": f"Adventure in {', '.join(request.feel_choices[:2])}",
        "main_character": "Protagonist",
        "setting": f"A world where {', '.join(request.story_draws)} matters most",
        "plot_hook": f"Something happens that challenges the status quo of {', '.join(request.feel_choices)}",
        "inspirations_used": request.inspirations
    }
    
    return GenerateSettingsResponse(
        success=True,
        message="Settings generated successfully (dummy response)",
        generated_content=dummy_content
    )

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "comic-flow-backend"}
