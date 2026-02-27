# New Repository Radar - Setup Instructions

## Overview

This is a production-ready SaaS feature that tracks newly created GitHub repositories in real-time. The system consists of:

- **Backend API**: Node.js/Express server that fetches data from GitHub API
- **Frontend**: React dashboard displaying real repository data with geographic enrichment

## Prerequisites

1. **Node.js** (v18 or higher)
2. **GitHub Personal Access Token** with `public_repo` scope

## Setup Steps

### 1. GitHub Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "New Repository Radar")
4. Select the `public_repo` scope
5. Click "Generate token"
6. **Copy the token immediately** - you won't see it again

### 2. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your GitHub token:
   ```env
   GITHUB_TOKEN=ghp_your_actual_github_token_here
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   VITE_API_URL=http://localhost:3001
   ```

### 3. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3001`

### 4. Frontend Setup

1. Navigate back to the root directory:
   ```bash
   cd ..
   ```

2. Install frontend dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## Access the Application

- **New Repository Radar**: `http://localhost:5173/new-repository-radar`
- **API Health Check**: `http://localhost:3001/api/health`
- **API Repositories**: `http://localhost:3001/api/new-repos`

## API Endpoints

### GET /api/health
Health check endpoint to verify the API is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "message": "New Repository Radar API is running"
}
```

### GET /api/new-repos
Fetches repositories created in the last 24 hours from GitHub.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123456789,
      "name": "example-repo",
      "full_name": "user/example-repo",
      "html_url": "https://github.com/user/example-repo",
      "description": "An amazing repository",
      "stargazers_count": 42,
      "forks_count": 5,
      "language": "TypeScript",
      "topics": ["web", "api", "typescript"],
      "owner": {
        "login": "user",
        "avatar_url": "https://github.com/user.png",
        "location": "San Francisco, CA",
        "country": "United States"
      },
      "created_at": "2024-01-15T09:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z",
      "created_ago": "2 hours ago"
    }
  ],
  "total_count": 42,
  "message": "Found 42 repositories from the last 24 hours"
}
```

## Features

### Frontend Dashboard
- **Real-time data**: Fetches live GitHub data via backend API
- **Geographic enrichment**: Shows country information based on user location
- **Interactive filters**: Sort by stars, forks, creation date, or update date
- **Responsive design**: Works on desktop and mobile devices
- **Loading states**: Skeleton loaders while fetching data
- **Error handling**: Graceful error states with retry functionality

### Backend API
- **GitHub integration**: Uses official GitHub REST API
- **Rate limiting aware**: Proper error handling for API limits
- **Location enrichment**: Fetches user profiles to get location data
- **Country detection**: Intelligent parsing of location strings
- **CORS enabled**: Secure cross-origin requests
- **Environment variables**: Secure token management

## Security Notes

- ✅ **No tokens in frontend**: GitHub token is only used on the backend
- ✅ **Environment variables**: Sensitive data stored in `.env` file
- ✅ **CORS configured**: Only allows requests from configured frontend URL
- ✅ **Error handling**: No sensitive information leaked in error responses

## Troubleshooting

### Common Issues

1. **"GITHUB_TOKEN environment variable is not set"**
   - Make sure you've created a `.env` file with your GitHub token
   - Restart the backend server after adding the token

2. **"GitHub API rate limit exceeded"**
   - GitHub API has rate limits (5000 requests/hour for authenticated requests)
   - Wait for the limit to reset or check your token usage

3. **"CORS errors" in browser**
   - Ensure the backend is running on port 3001
   - Check that `FRONTEND_URL` in `.env` matches your frontend URL

4. **"No repositories found"**
   - This is normal if no new repositories were created in the last 24 hours
   - Try again later or check the GitHub API directly

### Debug Mode

To enable debug logging, set the environment variable:
```bash
DEBUG=* npm run dev
```

## Production Deployment

For production deployment:

1. **Backend**: Use a process manager like PM2
2. **Frontend**: Build the React app and serve with a web server
3. **Environment**: Use proper environment variable management
4. **HTTPS**: Use SSL certificates in production
5. **Rate limiting**: Consider implementing additional rate limiting

## License

MIT License - see LICENSE file for details.
