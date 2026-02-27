import express from 'express';
import { detectCountry } from '../lib/countryDetection.js';

// Force reload environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '../.env', debug: true });

const router = express.Router();

// GitHub API configuration
const GITHUB_API_BASE = 'https://api.github.com';
const TOKEN = process.env.GITHUB_TOKEN;
console.log('🔍 Debug: TOKEN === placeholder:', TOKEN === 'ghp_your_github_personal_access_token_here');
console.log('🔍 Debug: TOKEN length:', TOKEN ? TOKEN.length : 'undefined');
console.log('🔍 Debug: TOKEN starts with ghp:', TOKEN ? TOKEN.startsWith('ghp_') : 'undefined');

if (!TOKEN || TOKEN === 'ghp_your_github_personal_access_token_here') {
  console.error('⚠️  GITHUB_TOKEN environment variable is not properly configured!');
  console.error('   Please set a valid GitHub Personal Access Token to use the API.');
  console.error('   See README_SETUP.md for instructions.');
}

// Helper function to make authenticated GitHub API requests
async function fetchFromGitHub(url) {
  if (!TOKEN || TOKEN === 'ghp_your_github_personal_access_token_here') {
    throw new Error('GitHub token is not configured. Please set GITHUB_TOKEN environment variable with a valid Personal Access Token.');
  }

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'NewRepositoryRadar/1.0'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`GitHub API error: ${response.status} - ${errorData.message || response.statusText}`);
  }

  return response.json();
}

// Helper function to enrich repository with owner location
async function enrichRepositoryWithLocation(repo) {
  try {
    const userData = await fetchFromGitHub(`${GITHUB_API_BASE}/users/${repo.owner.login}`);
    
    let country = 'Unknown';
    if (userData.location) {
      const detected = detectCountry(userData.location);
      country = detected.country;
    }

    return {
      ...repo,
      owner: {
        ...repo.owner,
        location: userData.location || null,
        country: country
      }
    };
  } catch (error) {
    console.warn(`Failed to fetch user data for ${repo.owner.login}:`, error.message);
    return {
      ...repo,
      owner: {
        ...repo.owner,
        location: null,
        country: 'Unknown'
      }
    };
  }
}

// Helper function to format creation time
function formatTimeAgo(dateString) {
  const created = new Date(dateString);
  const now = new Date();
  const diffMs = now - created;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else {
    return 'just now';
  }
}

// GET /api/new-repos
router.get('/', async (req, res) => {
  try {
    // Check if token is configured
    if (!TOKEN || TOKEN === 'ghp_your_github_personal_access_token_here') {
      return res.status(401).json({
        success: false,
        error: 'GitHub token is not configured',
        message: 'Please set a valid GITHUB_TOKEN environment variable. See README_SETUP.md for instructions.'
      });
    }

    // Calculate date for 24 hours ago
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateString = yesterday.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Fetch repositories created in the last 24 hours
    const searchUrl = `${GITHUB_API_BASE}/search/repositories?q=created:>=${dateString}&sort=stars&order=desc&per_page=50`;
    
    console.log(`Fetching repositories from: ${searchUrl}`);
    const searchResults = await fetchFromGitHub(searchUrl);

    if (!searchResults.items || searchResults.items.length === 0) {
      return res.json({
        success: true,
        data: [],
        total_count: 0,
        message: 'No repositories found in the last 24 hours'
      });
    }

    // Enrich repositories with owner location data
    console.log(`Enriching ${searchResults.items.length} repositories with location data...`);
    const enrichedRepos = await Promise.all(
      searchResults.items.map(repo => enrichRepositoryWithLocation(repo))
    );

    // Transform data to match frontend expectations
    const transformedRepos = enrichedRepos.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      html_url: repo.html_url,
      description: repo.description,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      language: repo.language,
      topics: repo.topics || [],
      owner: {
        login: repo.owner.login,
        avatar_url: repo.owner.avatar_url,
        location: repo.owner.location,
        country: repo.owner.country
      },
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      created_ago: formatTimeAgo(repo.created_at)
    }));

    res.json({
      success: true,
      data: transformedRepos,
      total_count: searchResults.total_count,
      message: `Found ${transformedRepos.length} repositories from the last 24 hours`
    });

  } catch (error) {
    console.error('Error fetching new repositories:', error);
    
    // Return appropriate error response
    const statusCode = error.message.includes('403') ? 429 : 
                     error.message.includes('401') ? 401 : 
                     error.message.includes('token') ? 401 : 500;
    
    res.status(statusCode).json({
      success: false,
      error: error.message,
      message: 'Failed to fetch repositories from GitHub API'
    });
  }
});

export default router;
