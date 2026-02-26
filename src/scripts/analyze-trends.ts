import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";

// Load environment variables explicitly
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const TOKEN = process.env.GITHUB_TOKEN;
if (!TOKEN) {
  console.error("❌ Missing GITHUB_TOKEN");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: "application/vnd.github+json",
};

// Paths
const DATA_DIR = path.resolve(process.cwd(), "data");
const HISTORY_DIR = path.join(DATA_DIR, "history");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(HISTORY_DIR)) fs.mkdirSync(HISTORY_DIR);

const TODAY = new Date().toISOString().slice(0, 10);
const TODAY_FILE = path.join(DATA_DIR, "daily-report.json");
const HISTORY_FILE = path.join(HISTORY_DIR, `${TODAY}.json`);

// --- Helper Functions ---
async function fetchRecentRepos() {
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const url = `https://api.github.com/search/repositories?q=created:>${lastWeek}&sort=stars&order=desc&per_page=50`;

  const res = await fetch(url, { headers });
  const data = await res.json();

  if (!data.items) return [];
  return data.items;
}

function computeMomentum(repo: any, prevRepo?: any) {
  // If previous data exists, compute delta
  const starDelta = prevRepo ? repo.stargazers_count - prevRepo.stars : repo.stargazers_count;
  const contributorDelta = prevRepo ? repo.contributors_count - prevRepo.contributorsDelta : repo.contributors_count || 0;
  const issueDelta = prevRepo ? repo.open_issues_count - prevRepo.issues : repo.open_issues_count || 0;

  // Momentum formula
  const score = starDelta * 2 + contributorDelta * 5 + issueDelta * 1.5;

  return { starDelta, contributorDelta, issueDelta, score };
}

// --- Load yesterday’s data ---
let yesterdayData: any = {};
const yesterdayFile = path.join(HISTORY_DIR, new Date(Date.now() - 86400000).toISOString().slice(0, 10) + ".json");
if (fs.existsSync(yesterdayFile)) {
  yesterdayData = JSON.parse(fs.readFileSync(yesterdayFile, "utf-8"));
}

// --- Main Script ---
async function run() {
  console.log("Fetching GitHub data...");
  const repos = await fetchRecentRepos();

  // Map yesterday for delta lookup
  const yesterdayMap = (yesterdayData.emergingRockets || []).reduce((acc: any, r: any) => {
    acc[r.name] = r;
    return acc;
  }, {});

  // Analyze momentum
  const analyzed = repos.map((r: any) => {
    const prev = yesterdayMap[r.full_name];
    const { starDelta, contributorDelta, issueDelta, score } = computeMomentum(r, prev);

    return {
      name: r.full_name,
      description: r.description,
      stars: r.stargazers_count,
      forks: r.forks_count,
      issues: r.open_issues_count,
      language: r.language,
      url: r.html_url,
      starDelta,
      contributorDelta,
      issueDelta,
      score,
    };
  });

  // Sort by momentum
  analyzed.sort((a: any, b: any) => b.score - a.score);

  // Categorize
  const report = {
    date: TODAY,
    emergingRockets: analyzed.slice(0, 10),
    silentClimbers: analyzed.slice(10, 20),
    coolingDown: analyzed.filter((r: any) => r.score < 0).slice(0, 10),
    experimentalSpike: analyzed.filter((r: any) => r.starDelta > 50).slice(0, 10),
  };

  // Save today
  fs.writeFileSync(TODAY_FILE, JSON.stringify(report, null, 2));
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(report, null, 2));

  console.log(`✅ Daily report generated: ${TODAY_FILE}`);
}

run().catch(err => {
  console.error("❌ Error generating report:", err);
  process.exit(1);
});