import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { KpiCard, type KpiData } from "@/components/dashboard/KpiCard";
import { Users, Activity } from "lucide-react";

interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string | null;
  location: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  contributions: number;
  languages: string[];
  company: string | null;
  blog: string | null;
  twitter: string | null;
  isFollowing: boolean;
  lastActive: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'followers' | 'following'>('followers');

  useEffect(() => {
    async function fetchUsersData() {
      try {
        // Fetch real GitHub followers and following data
        const [followersResponse, followingResponse] = await Promise.all([
          fetch('https://api.github.com/user/followers'),
          fetch('https://api.github.com/user/following')
        ]);

        if (!followersResponse.ok || !followingResponse.ok) {
          throw new Error('Failed to fetch GitHub data');
        }

        const followers = await followersResponse.json();
        const following = await followingResponse.json();

        // Combine followers and following into users array
        const allUsers = [
          ...followers.map((user: any) => ({
            ...user,
            type: 'follower',
            isFollowing: false
          })),
          ...following.map((user: any) => ({
            ...user,
            type: 'following',
            isFollowing: true
          }))
        ];

        // Transform to our User interface
        const usersData: User[] = allUsers.map((user: any) => ({
          id: user.id.toString(),
          username: user.login,
          name: user.name || user.login,
          avatar: user.avatar_url,
          bio: user.bio,
          location: user.location,
          followers: user.followers || 0,
          following: user.following || 0,
          publicRepos: user.public_repos || 0,
          totalStars: 0, // Would need additional API call to get this
          contributions: 0, // Would need additional API call to get this
          languages: [], // Would need additional API call to get this
          company: user.company,
          blog: user.blog,
          twitter: user.twitter_username ? `@${user.twitter_username}` : null,
          isFollowing: user.isFollowing,
          lastActive: user.updated_at || new Date().toISOString(),
        }));

        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching GitHub user data:', error);
        // Fallback to mock data if GitHub API fails
        const mockUsers: User[] = [
          {
            id: '1',
            username: 'octocat',
            name: 'The Octocat',
            avatar: 'https://github.com/octocat.png',
            bio: 'GitHub mascot',
            location: 'San Francisco',
            followers: 5000,
            following: 9,
            publicRepos: 8,
            totalStars: 1000,
            contributions: 500,
            languages: ['JavaScript', 'Ruby'],
            company: 'GitHub',
            blog: 'https://octocat.github.io',
            twitter: '@octocat',
            isFollowing: true,
            lastActive: new Date().toISOString(),
          }
        ];
        setUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    }

    fetchUsersData();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery || 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.bio && user.bio.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'followers':
        return b.followers - a.followers;
      case 'following':
        return b.following - a.following;
      default:
        return 0;
    }
  });

  const kpiData: KpiData[] = [
    {
      title: 'Total Users',
      value: filteredUsers.length,
      delta: 0,
      accentColor: 'blue',
    },
    {
      title: 'Following',
      value: filteredUsers.filter(u => u.isFollowing).length,
      delta: 0,
      accentColor: 'green',
    },
    {
      title: 'Total Followers',
      value: filteredUsers.reduce((sum, user) => sum + user.followers, 0),
      delta: 0,
      accentColor: 'yellow',
    },
    {
      title: 'Active Today',
      value: filteredUsers.filter(u => {
        const hoursSinceActive = (Date.now() - new Date(u.lastActive).getTime()) / (1000 * 60 * 60);
        return hoursSinceActive <= 24;
      }).length,
      delta: 0,
      accentColor: 'red',
    },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatLastActive = (lastActive: string) => {
    const date = new Date(lastActive);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto mb-4"></div>
          <p className="text-secondary">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full z-40">
        <Sidebar 
          activeItem="users"
          onItemClick={(item) => console.log('Navigate to:', item.id)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background border-b border-border">
          <Header
            title="GitHub Users"
            onSearch={setSearchQuery}
          />
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex gap-4 items-center">
            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'followers' | 'following')}
              className="px-3 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue"
            >
              <option value="followers">Most Followers</option>
              <option value="following">Most Following</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpiData.map((kpi, index) => (
                <KpiCard key={index} data={kpi} />
              ))}
            </div>

            {/* Users Grid */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-blue" />
                <h2 className="text-2xl font-bold text-primary">Notable Developers</h2>
                <span className="px-3 py-1 bg-blue text-white text-sm rounded-full">
                  {filteredUsers.length} users
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-card border border-border rounded-lg p-6 hover:border-blue transition-colors"
                  >
                    {/* User Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-16 h-16 rounded-full"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-primary truncate">
                          {user.name}
                        </h3>
                        <p className="text-sm text-secondary">@{user.username}</p>
                        
                        {user.company && (
                          <p className="text-sm text-secondary mt-1">{user.company}</p>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    {user.bio && (
                      <p className="text-sm text-secondary mb-4 line-clamp-2">
                        {user.bio}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-2 bg-surface rounded">
                        <div className="text-lg font-semibold text-primary">
                          {formatNumber(user.followers)}
                        </div>
                        <div className="text-xs text-secondary">Followers</div>
                      </div>
                      
                      <div className="text-center p-2 bg-surface rounded">
                        <div className="text-lg font-semibold text-primary">
                          {formatNumber(user.totalStars)}
                        </div>
                        <div className="text-xs text-secondary">Stars</div>
                      </div>
                    </div>

                    {/* Languages */}
                    {user.company && (
                      <div className="mb-4">
                        <div className="text-sm text-secondary mb-2">Company</div>
                        <div className="text-sm text-primary">{user.company}</div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-xs text-secondary">
                        <Activity className="w-3 h-3" />
                        {formatLastActive(user.lastActive)}
                      </div>
                      
                      <button
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          user.isFollowing
                            ? 'bg-surface border border-border text-secondary hover:bg-card'
                            : 'bg-blue text-white hover:bg-blue/90'
                        }`}
                      >
                        {user.isFollowing ? 'Following' : 'Follow'}
                      </button>
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
