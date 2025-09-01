# Comic Flow - Local Development Setup

This guide will help you run both the backend and frontend locally and get them communicating with each other.

## Prerequisites

- Python 3.8+
- Node.js 18+ and npm
- Git

## Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install Python dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Run the FastAPI server:**

   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The backend will be available at: http://localhost:8000

4. **Test the backend:**
   - Health check: http://localhost:8000/api/health
   - API docs: http://localhost:8000/docs

## Frontend Setup

1. **Install Node.js dependencies (from project root):**

   ```bash
   npm install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   ```

   The frontend will be available at: http://localhost:3000

## API Endpoints

### POST /api/generateSettings

Generates story settings based on user choices.

**Request Body:**

```json
{
  "feel_choices": ["Action", "Drama", "Romance"],
  "story_draws": ["Character Development", "World Building"],
  "inspirations": ["Lord of the Rings", "Star Wars"]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Settings generated successfully (dummy response)",
  "generated_content": {
    "story_title": "Adventure in Action, Drama",
    "main_character": "Protagonist",
    "setting": "A world where Character Development, World Building matters most",
    "plot_hook": "Something happens that challenges the status quo of Action, Drama, Romance",
    "inspirations_used": ["Lord of the Rings", "Star Wars"]
  }
}
```

## Development vs Static Export

- **Development mode:** `npm run dev` - Connects to local backend at localhost:8000
- **Static export:** `npm run build:static` - Creates static files in `out/` directory

## Troubleshooting

### CORS Issues

If you see CORS errors, make sure:

1. Backend is running on port 8000
2. Frontend is running on port 3000
3. Backend CORS middleware is properly configured

### Backend Connection Issues

- Check if backend is running: `curl http://localhost:8000/api/health`
- Verify port 8000 is not in use by another service

### Frontend Build Issues

- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Next Steps

1. **Backend:** Replace the dummy logic in `generateSettings` with your actual AI/ML implementation
2. **Frontend:** Integrate the API calls into your UI components
3. **Add more endpoints** as needed for your comic generation workflow
