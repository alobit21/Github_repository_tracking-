import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Folder, Star } from "lucide-react";

interface CategoryData {
  id: string;
  name: string;
  description: string;
  repoCount: number;
  totalStars: number;
  growth: number;
  topRepos: string[];
  color: string;
}

const mockCategories: CategoryData[] = [
  {
    id: '1',
    name: 'AI / ML',
    description: 'Machine learning frameworks, AI tools, and data science libraries',
    repoCount: 1247,
    totalStars: 892341,
    growth: 23.5,
    topRepos: ['tensorflow', 'pytorch', 'scikit-learn'],
    color: 'bg-green'
  },
  {
    id: '2',
    name: 'Frontend',
    description: 'JavaScript frameworks, CSS libraries, and UI components',
    repoCount: 3421,
    totalStars: 2156789,
    growth: 15.2,
    topRepos: ['react', 'vue', 'angular'],
    color: 'bg-blue'
  },
  {
    id: '3',
    name: 'Infrastructure',
    description: 'Cloud services, DevOps tools, and deployment platforms',
    repoCount: 892,
    totalStars: 567234,
    growth: 18.9,
    topRepos: ['kubernetes', 'docker', 'terraform'],
    color: 'bg-yellow'
  },
  {
    id: '4',
    name: 'DevTools',
    description: 'Development tools, IDEs, and productivity utilities',
    repoCount: 1567,
    totalStars: 423456,
    growth: 12.3,
    topRepos: ['vscode', 'git', 'webpack'],
    color: 'bg-purple'
  },
  {
    id: '5',
    name: 'Web3',
    description: 'Blockchain, DeFi, and decentralized applications',
    repoCount: 634,
    totalStars: 234567,
    growth: 31.2,
    topRepos: ['ethereum', 'hardhat', 'web3.js'],
    color: 'bg-indigo'
  },
  {
    id: '6',
    name: 'Backend',
    description: 'Server frameworks, databases, and API tools',
    repoCount: 2134,
    totalStars: 1876234,
    growth: 8.7,
    topRepos: ['nodejs', 'django', 'spring-boot'],
    color: 'bg-red'
  }
];

export default function Categories() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full z-40">
        <Sidebar 
          activeItem="categories"
          onItemClick={(item) => console.log('Navigate to:', item.id)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background border-b border-border">
          <Header />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">Category Analysis</h1>
              <p className="text-secondary">Explore trends across different technology ecosystems.</p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCategories.map((category) => (
                <Card key={category.id} className="border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <Badge variant="outline" className="text-xs border-blue text-blue bg-blue/10">{category.repoCount} repos</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-secondary">{category.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-green mb-1">
                          <TrendingUp className="w-3 h-3" />
                          <span className="text-sm font-medium">+{category.growth}%</span>
                        </div>
                        <p className="text-xs text-secondary">Growth</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-blue mb-1">
                          <Star className="w-3 h-3" />
                          <span className="text-sm font-medium">{(category.totalStars / 1000).toFixed(0)}K</span>
                        </div>
                        <p className="text-xs text-secondary">Total Stars</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-secondary" />
                        <span className="text-sm text-primary">Top Repositories:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {category.topRepos.map((repo, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-green text-green bg-green/10">
                            {repo}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-secondary">Category Activity</span>
                        <span className="text-primary">{Math.min(100, category.growth * 3)}%</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${category.color}`}
                        style={{ width: `${Math.min(100, category.growth * 3)}%` }}
                      />
                    </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
