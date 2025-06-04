# globetrotter
All in One Travel Planner App

# Globetrotter AI

Globetrotter AI is a web application that helps users find real-time flight information and travel recommendations using a Next.js frontend and n8n for backend orchestration. It integrates with the Amadeus API for live flight data and is fully containerized with Docker Compose.

## Features
- Search for flights using real airline data (Amadeus API)
- Get travel recommendations and advice
- Orchestrate backend logic with n8n workflows
- Fully containerized for easy local development
- Beautiful, responsive UI for displaying flight results

## Prerequisites
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

## Setup Instructions

### 1. Clone the Repository
```sh
git clone https://github.com/saratala/globetrotter.git
cd globetrotter
```

### 2. Configure Environment Variables
Edit `web/.env.local` to set the n8n webhook URL:
```
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/travel2
```

### 3. Start the Application
This will start both the Next.js frontend and n8n backend:
```sh
docker compose up -d
```

### 4. Set Up n8n
1. Open [http://localhost:5678](http://localhost:5678) in your browser.
2. Complete the initial setup (email, name, password) if prompted.
3. Log in to the n8n dashboard.
4. Set up Amadeus API credentials:
   - Go to "Settings" > "Credentials"
   - Click "Add credential"
   - Choose "HTTP Basic Auth" or "Custom API Key" credential type
   - Name it "AmadeusAPI"
   - Enter Client ID: Wk9xZ8mCokM5GzAzkMZUJ8U8L1U8QV75
   - Enter Client Secret: DEOdfnbnZXQjwpYM
   - Save the credential
5. Import the workflow:
   - Click the menu (top left) → Import Workflow
   - Select `n8n_globetrotter_workflow.json` from the project root
   - Update the Amadeus Auth node to use the saved credentials
   - Activate the workflow

### 5. Use the Web App
1. Open [http://localhost:3001](http://localhost:3001) in your browser.
2. Enter your travel details and submit the form to search for flights and get recommendations.
3. Try a sample search with the following details:
   - Origin: BOS (Boston)
   - Destination: JFK (New York)
   - Departure Date: Select a date in the future (e.g., next week)
   - Adults: 1
   - Query: "Best time to visit New York"

## Updating the Workflow
- If you make changes to `n8n_globetrotter_workflow.json`, re-import it via the n8n dashboard.
- Restart the n8n service if needed:
  ```sh
  docker compose restart n8n
  ```

## Troubleshooting
- **n8n API Auth:** New n8n versions use user management. The old BASIC AUTH variables are ignored. Always log in via the web UI.
- **Amadeus Auth Errors:** If you encounter authentication errors:
  1. Check that the Amadeus Auth node uses explicit "Content-Type: application/x-www-form-urlencoded" header
  2. Verify the "Process Auth Response" node is properly handling the token
  3. Ensure the Authorization header in Amadeus Flight Search node uses the correct syntax: `=="Bearer "+$node["Process Auth Response"].json["access_token"]`
  
- **Flight Search API Errors:**
  1. Ensure all required parameters are included: originLocationCode, destinationLocationCode, departureDate, adults
  2. Add the Accept header: "application/json"
  3. Format dates in YYYY-MM-DD format
  4. Use the "Process Flight Response" node to handle and log any errors
  5. Check n8n logs for API response details
  
- **CORS Issues:** The Docker Compose file sets permissive CORS for local development.
- **Resetting n8n:** To fully reset n8n (removes all workflows/settings):
  ```sh
  docker compose down
  docker volume rm globetrotter_n8n_data
  docker compose up -d
  ```

## Project Structure
```
├── docker-compose.yml
├── n8n_globetrotter_workflow.json
├── web/
│   ├── Dockerfile
│   ├── package.json
│   ├── .env.local
│   └── pages/
│       └── index.js
```

## License
MIT
