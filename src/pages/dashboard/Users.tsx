import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { KpiCard, type KpiData } from "@/components/dashboard/KpiCard";
import { CategoryFilter } from "@/components/dashboard/CategoryFilter";
import { Users, MapPin, Link2, Calendar, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string | null;
  location: string | null;
  followers: number;
  following: number;
  contributions: number;
  company: string | null;
  blog: string | null;
  twitter: string | null;
  isFollowing: boolean;
  lastActive: string;
  categories: string[];
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchUsersData() {
      try {
        // Simulate user data
        const mockUsers: User[] = [
          {
            id: '1',
            username: 'torvalds',
            name: 'Linus Torvalds',
            avatar: '',
            bio: 'Creator of Linux',
            location: 'Portland, OR',
            followers: 150000,
            following: 0,
            contributions: 25000,
            company: 'Linux Foundation',
            blog: '',
            twitter: '',
            isFollowing: false,
            lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            categories: ['DevTools', 'Infrastructure']
          },
          {
            id: '2',
            username: 'gaearon',
            name: 'Dan Abramov',
            avatar: '',
            bio: 'Creator of React',
            location: 'San Francisco, CA',
            followers: 120000,
            following: 150,
            contributions: 18000,
            company: 'Vercel',
            blog: 'overreacted.io',
            twitter: 'dan_abramov',
            isFollowing: true,
            lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            categories: ['Frontend', 'DevTools']
          }
        ];
        
        setUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching users data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsersData();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategories = selectedCategories.includes('all') || 
      user.categories.some(cat => selectedCategories.includes(cat));
    
    return matchesSearch && matchesCategories;
  });

  const kpiData: KpiData[] = [
    {
      title: 'Total Users',
      value: filteredUsers.length,
      delta: 0,
      accentColor: 'blue',
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
    {
      title: 'Top Contributors',
      value: filteredUsers.filter(u => u.contributions > 10000).length,
      delta: 0,
      accentColor: 'green',
    },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
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
          activeItem="users"
          isMobile={true}
          onClose={() => setIsSidebarOpen(false)}
          onItemClick={(item) => {
            console.log('Navigate to:', item.id);
            setIsSidebarOpen(false);
          }}
        />
      </div>

      {/* Desktop Sidebar (always visible) */}
      <div className="hidden lg:block fixed left-0 top-0 h-full z-40">
        <Sidebar 
          activeItem="users"
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
            title="User Analytics"
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

            {/* Users Grid */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue" />
                <h2 className="text-xl sm:text-2xl font-bold text-primary">Notable Developers</h2>
                <span className="px-2 sm:px-3 py-1 bg-blue text-white text-xs sm:text-sm rounded-full">
                  {filteredUsers.length} users
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredUsers.map((user) => (
                  <Card key={user.id} className="border-border hover:border-blue transition-colors">
                    <CardContent className="p-4">
                      {/* User Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue to-purple rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-primary truncate">{user.name}</h3>
                          <p className="text-sm text-secondary truncate">@{user.username}</p>
                        </div>
                      </div>

                      {/* User Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary">{formatNumber(user.followers)}</div>
                          <p className="text-xs text-secondary">Followers</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary">{formatNumber(user.contributions)}</div>
                          <p className="text-xs text-secondary">Contributions</p>
                        </div>
                      </div>

                      {/* Categories */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {user.categories.map((category) => (
                          <Badge key={category} variant="outline" className="text-xs border-green text-green bg-green/10">
                            {category}
                          </Badge>
                        ))}
                      </div>

                      {/* Location and Activity */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-secondary mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{user.location || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Active now</span>
                        </div>
                      </div>

                      {/* GitHub Link */}
                      <div className="pt-3 border-t border-border">
                        <a
                          href={`https://github.com/${user.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue hover:text-blue/80 transition-colors text-sm"
                        >
                          <Link2 className="w-3 h-3" />
                          View GitHub Profile
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
