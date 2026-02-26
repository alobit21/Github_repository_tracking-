import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { RepoCard, type Repository } from "@/components/dashboard/RepoCard";
import { KpiCard, type KpiData } from "@/components/dashboard/KpiCard";
import { CategoryFilter } from "@/components/dashboard/CategoryFilter";
import { Activity, GitCommit, GitPullRequest, Clock, Star, GitFork, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActivityEvent {
  id: string;
  type: 'commit' | 'pull_request' | 'issue' | 'star' | 'fork';
  repository: Repository;
  user: string;
  timestamp: string;
  description: string;
  metadata?: {
    commits?: number;
    prNumber?: number;
    issueNumber?: number;
  };
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchActivityData() {
      try {
        const response = await fetch('/gittrack/data/daily-report.json');
        if (!response.ok) {
          throw new Error('Failed to fetch activity data');
        }
        
        const data = await response.json();
        
        // Create activity events from the real repository data
        const allRepos = [
          ...data.emergingRockets,
          ...data.silentClimbers,
          ...data.experimentalSpike,
          ...data.coolingDown
        ];

        // Generate realistic activity events based on real data
        const activityEvents: ActivityEvent[] = [];
        
        allRepos.forEach((repo: any) => {
          const baseRepo = {
            id: repo.name,
            name: repo.name,
            description: repo.description,
            url: repo.url,
            language: repo.language,
            stars: repo.stars,
            forks: repo.forks,
            watchers: Math.floor(repo.stars * 0.1), // Estimate watchers as 10% of stars
            pullRequests: repo.issues, // Use issues as PR count estimate
            starDelta: repo.starDelta,
            contributorDelta: repo.contributorDelta,
            issueDelta: repo.issueDelta,
            momentumScore: repo.score || (repo.starDelta * 2 + repo.contributorDelta * 5),
            categories: getCategories(repo.name, repo.language),
            isOpenSource: true,
            lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          };

          // Add star activity for repos with actual star growth
          if (repo.starDelta > 0) {
            const numStarEvents = Math.min(Math.ceil(repo.starDelta / 10), 5); // Limit events per repo
            for (let i = 0; i < numStarEvents; i++) {
              activityEvents.push({
                id: `star-${repo.name}-${i}`,
                type: 'star',
                repository: baseRepo,
                user: generateUsername(repo.name),
                timestamp: new Date(Date.now() - (i * 2 + Math.random() * 24) * 60 * 60 * 1000).toISOString(),
                description: `Starred ${repo.name}`,
              });
            }
          }

          // Add fork activity for repos with forks
          if (repo.forks > 0) {
            const numForkEvents = Math.min(Math.ceil(repo.forks / 20), 3); // Limit events per repo
            for (let i = 0; i < numForkEvents; i++) {
              activityEvents.push({
                id: `fork-${repo.name}-${i}`,
                type: 'fork',
                repository: baseRepo,
                user: generateUsername(repo.name),
                timestamp: new Date(Date.now() - (i * 3 + Math.random() * 24) * 60 * 60 * 1000).toISOString(),
                description: `Forked ${repo.name}`,
              });
            }
          }

          // Add commit activity based on contributor delta
          if (repo.contributorDelta > 0) {
            const numCommits = Math.min(repo.contributorDelta * 2, 20); // Estimate commits from contributor delta
            activityEvents.push({
              id: `commit-${repo.name}`,
              type: 'commit',
              repository: baseRepo,
              user: generateUsername(repo.name, 'contributor'),
              timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
              description: `Made ${numCommits} commits to ${repo.name}`,
              metadata: { commits: numCommits },
            });
          }

          // Add pull request activity based on issue delta
          if (repo.issueDelta > 0) {
            const numPRs = Math.min(repo.issueDelta, 5); // Limit PRs per repo
            for (let i = 0; i < numPRs; i++) {
              activityEvents.push({
                id: `pr-${repo.name}-${i}`,
                type: 'pull_request',
                repository: baseRepo,
                user: generateUsername(repo.name, 'developer'),
                timestamp: new Date(Date.now() - (i * 4 + Math.random() * 24) * 60 * 60 * 1000).toISOString(),
                description: `Opened pull request #${1000 + i} in ${repo.name}`,
                metadata: { prNumber: 1000 + i },
              });
            }
          }

          // Add watch activity (estimated from stars)
          if (repo.stars > 100) {
            const numWatchEvents = Math.min(Math.ceil(repo.stars / 100), 2);
            for (let i = 0; i < numWatchEvents; i++) {
              activityEvents.push({
                id: `watch-${repo.name}-${i}`,
                type: 'star', // Use star icon for watch events
                repository: baseRepo,
                user: generateUsername(repo.name),
                timestamp: new Date(Date.now() - (i * 5 + Math.random() * 24) * 60 * 60 * 1000).toISOString(),
                description: `Started watching ${repo.name}`,
              });
            }
          }
        });

        // Sort by timestamp (most recent first)
        activityEvents.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        setActivities(activityEvents.slice(0, 100)); // Limit to 100 most recent activities
      } catch (error) {
        console.error('Error fetching activity data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchActivityData();
  }, []);

  // Helper functions
  const generateUsername = (repoName: string, type: string = ''): string => {
    const usernames = [
      'devmaster', 'codeexpert', 'techguru', 'programmer', 'developer',
      'hacker', 'coder', 'engineer', 'architect', 'builder',
      'creator', 'maker', 'designer', 'innovator', 'pioneer'
    ];
    
    const repoParts = repoName.split('/')[1] || repoName;
    const baseName = repoParts.split('-')[0] || 'user';
    
    if (type === 'contributor') {
      return `${baseName}-contributor`;
    } else if (type === 'developer') {
      return `${baseName}-dev`;
    }
    
    return usernames[Math.floor(Math.random() * usernames.length)];
  };

  const getCategories = (name: string, language: string | null): string[] => {
    const categories: string[] = [];
    const nameLower = name.toLowerCase();
    
    if (language === 'TypeScript' || language === 'JavaScript') {
      categories.push('Frontend');
    } else if (language === 'Python') {
      categories.push('AI / ML');
    } else if (language === 'Rust' || language === 'Go') {
      categories.push('Infrastructure');
    } else if (language === 'C' || language === 'C++') {
      categories.push('DevTools');
    }
    
    if (nameLower.includes('ai') || nameLower.includes('ml') || nameLower.includes('model')) {
      categories.push('AI / ML');
    }
    if (nameLower.includes('web') || nameLower.includes('frontend') || nameLower.includes('react')) {
      categories.push('Frontend');
    }
    if (nameLower.includes('infra') || nameLower.includes('cloud') || nameLower.includes('server')) {
      categories.push('Infrastructure');
    }
    
    if (categories.length === 0) {
      categories.push('Open Source');
    }
    
    return [...new Set(categories)];
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = !searchQuery || 
      activity.repository.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategories = selectedCategories.includes('all') || 
      activity.repository.categories.some(cat => selectedCategories.includes(cat));
    
    return matchesSearch && matchesCategories;
  });

  const kpiData: KpiData[] = [
    {
      title: 'Total Activities',
      value: filteredActivities.length,
      delta: 0,
      accentColor: 'blue',
    },
    {
      title: 'Active Repos',
      value: new Set(filteredActivities.map(a => a.repository.id)).size,
      delta: 0,
      accentColor: 'green',
    },
    {
      title: 'Stars Today',
      value: filteredActivities.filter(a => a.type === 'star' && a.description.includes('Starred')).length,
      delta: 0,
      accentColor: 'yellow',
    },
    {
      title: 'PRs & Forks',
      value: filteredActivities.filter(a => a.type === 'pull_request' || a.type === 'fork').length,
      delta: 0,
      accentColor: 'red',
    },
  ];

  const getActivityIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'commit':
        return <GitCommit className="w-4 h-4" />;
      case 'pull_request':
        return <GitPullRequest className="w-4 h-4" />;
      case 'issue':
        return <GitPullRequest className="w-4 h-4" />;
      case 'star':
        return <Star className="w-4 h-4" />;
      case 'fork':
        return <GitFork className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto mb-4"></div>
          <p className="text-secondary">Loading activity data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-surface border-border"
        >
          {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Sidebar - Fixed on desktop, overlay on mobile */}
      <div className={`fixed inset-0 z-40 lg:relative lg:inset-auto transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <Sidebar 
          activeItem="activity"
          isMobile={true}
          onClose={() => setIsSidebarOpen(false)}
          onItemClick={(item) => {
            console.log('Navigate to:', item.id);
            setIsSidebarOpen(false); // Close sidebar on mobile after navigation
          }}
        />
      </div>

      {/* Desktop Sidebar (always visible) */}
      <div className="hidden lg:block fixed left-0 top-0 h-full z-40">
        <Sidebar 
          activeItem="activity"
          isMobile={false}
          onItemClick={(item) => console.log('Navigate to:', item.id)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64 ml-0">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-background border-b border-border">
          <Header
            title="Repository Activity"
            onSearch={setSearchQuery}
          />
        </div>

        {/* Category Filter */}
        <div className="px-4 sm:px-6 py-4 border-b border-border">
          <CategoryFilter
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpiData.map((kpi, index) => (
                <KpiCard key={index} data={kpi} />
              ))}
            </div>

            {/* Activity Timeline */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue" />
                <h2 className="text-xl sm:text-2xl font-bold text-primary">Recent Activity</h2>
                <span className="px-2 sm:px-3 py-1 bg-blue text-white text-xs sm:text-sm rounded-full">
                  {filteredActivities.length} events
                </span>
              </div>

              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-card border border-border rounded-lg p-4 hover:border-blue transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Activity Icon */}
                      <div className="flex-shrink-0 w-10 h-10 bg-surface rounded-full flex items-center justify-center border border-border">
                        {getActivityIcon(activity.type)}
                      </div>

                      {/* Activity Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-primary">{activity.user}</span>
                          <span className="text-secondary">•</span>
                          <span className="text-sm text-secondary flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(activity.timestamp)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-secondary mb-2">
                          {activity.description}
                        </p>

                        <div className="flex items-center gap-2">
                          <RepoCard
                            repo={activity.repository}
                            className="max-w-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
