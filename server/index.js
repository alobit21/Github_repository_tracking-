import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import newReposRouter from './api/new-repos.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'New Repository Radar API is running'
  });
});

// API routes
app.use('/api/new-repos', newReposRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
    message: 'The requested endpoint does not exist'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 New Repository Radar API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 New repositories: http://localhost:${PORT}/api/new-repos`);
  
  if (!process.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN === 'ghp_your_github_personal_access_token_here') {
    console.error('⚠️  WARNING: GITHUB_TOKEN environment variable is not properly configured!');
    console.error('   Please set a valid GitHub Personal Access Token to use the API.');
    console.error('   See README_SETUP.md for instructions.');
  }
});

export default app;
