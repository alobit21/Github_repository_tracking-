export interface Repository {
  id: string;
  name: string;
  fullName: string;
  owner: {
    login: string;
    type: 'User' | 'Organization';
    location: string | null;
    avatarUrl: string;
  };
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  createdAt: string;
  updatedAt: string;
  url: string;
  inferredCountry: string;
  momentum: number;
  growthIndicators: {
    starsGrowth: number;
    forksGrowth: number;
    activityScore: number;
  };
  trendDirection: 'up' | 'neutral' | 'down';
}

export interface CountryStats {
  country: string;
  countryCode: string;
  repositoryCount: number;
  averageStars: number;
  totalStars: number;
  averageForks: number;
  topLanguages: Array<{ language: string; count: number }>;
  momentum: number;
}

export interface RegionalMomentum {
  country: string;
  countryCode: string;
  newRepositoriesCount: number;
  averageStars: number;
  growthRate: number;
  topLanguage: string;
  flag: string;
}

export interface TechnologyDistribution {
  language: string;
  count: number;
  countries: Array<{ country: string; count: number }>;
  percentage: number;
}

export interface FilterOptions {
  countries: string[];
  languages: string[];
  minStars: number;
  timeRange: '1h' | '6h' | '12h' | '24h';
  sortBy: 'momentum' | 'stars' | 'forks' | 'created';
  sortOrder: 'asc' | 'desc';
}

export interface GlobalDiscoveryData {
  repositories: Repository[];
  countryStats: CountryStats[];
  regionalMomentum: RegionalMomentum[];
  technologyDistribution: TechnologyDistribution[];
  hiddenGems: Repository[];
  breakoutWatchlist: Repository[];
  totalRepositories: number;
  lastUpdated: string;
}
