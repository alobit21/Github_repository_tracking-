import type { Repository, CountryStats, RegionalMomentum, TechnologyDistribution, GlobalDiscoveryData } from '@/types/repository';

const mockRepositories: Repository[] = [
  {
    id: '1',
    name: 'ai-copilot',
    fullName: 'microsoft/ai-copilot',
    owner: {
      login: 'microsoft',
      type: 'Organization',
      location: 'Redmond, WA',
      avatarUrl: 'https://github.com/microsoft.png'
    },
    description: 'Advanced AI-powered coding assistant with real-time suggestions and code completion',
    stars: 2847,
    forks: 312,
    language: 'TypeScript',
    topics: ['ai', 'copilot', 'typescript', 'developer-tools'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    url: 'https://github.com/microsoft/ai-copilot',
    inferredCountry: 'United States',
    momentum: 92,
    growthIndicators: {
      starsGrowth: 847,
      forksGrowth: 92,
      activityScore: 88
    },
    trendDirection: 'up'
  },
  {
    id: '2',
    name: 'rust-web-framework',
    fullName: 'rust-lang/rust-web-framework',
    owner: {
      login: 'rust-lang',
      type: 'Organization',
      location: 'Berlin, Germany',
      avatarUrl: 'https://github.com/rust-lang.png'
    },
    description: 'High-performance web framework built with Rust for modern web applications',
    stars: 1923,
    forks: 156,
    language: 'Rust',
    topics: ['rust', 'web-framework', 'performance', 'async'],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    url: 'https://github.com/rust-lang/rust-web-framework',
    inferredCountry: 'Germany',
    momentum: 78,
    growthIndicators: {
      starsGrowth: 523,
      forksGrowth: 41,
      activityScore: 72
    },
    trendDirection: 'up'
  },
  {
    id: '3',
    name: 'quantum-simulator',
    fullName: 'ibm/quantum-simulator',
    owner: {
      login: 'ibm',
      type: 'Organization',
      location: 'Armonk, NY',
      avatarUrl: 'https://github.com/ibm.png'
    },
    description: 'Open-source quantum computing simulator for research and education',
    stars: 1456,
    forks: 234,
    language: 'Python',
    topics: ['quantum', 'python', 'simulation', 'research'],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    url: 'https://github.com/ibm/quantum-simulator',
    inferredCountry: 'United States',
    momentum: 65,
    growthIndicators: {
      starsGrowth: 312,
      forksGrowth: 28,
      activityScore: 58
    },
    trendDirection: 'up'
  },
  {
    id: '4',
    name: 'blockchain-scalability',
    fullName: 'ethereum/blockchain-scalability',
    owner: {
      login: 'ethereum',
      type: 'Organization',
      location: 'Zug, Switzerland',
      avatarUrl: 'https://github.com/ethereum.png'
    },
    description: 'Layer 2 scaling solutions for Ethereum blockchain with zero-knowledge proofs',
    stars: 892,
    forks: 167,
    language: 'Solidity',
    topics: ['blockchain', 'ethereum', 'scaling', 'zk-proofs'],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    url: 'https://github.com/ethereum/blockchain-scalability',
    inferredCountry: 'Switzerland',
    momentum: 71,
    growthIndicators: {
      starsGrowth: 234,
      forksGrowth: 19,
      activityScore: 64
    },
    trendDirection: 'up'
  },
  {
    id: '5',
    name: 'ml-pipeline-orchestrator',
    fullName: 'google/ml-pipeline-orchestrator',
    owner: {
      login: 'google',
      type: 'Organization',
      location: 'Mountain View, CA',
      avatarUrl: 'https://github.com/google.png'
    },
    description: 'Scalable machine learning pipeline orchestration with Kubernetes integration',
    stars: 1678,
    forks: 289,
    language: 'Go',
    topics: ['machine-learning', 'kubernetes', 'pipeline', 'mlops'],
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    url: 'https://github.com/google/ml-pipeline-orchestrator',
    inferredCountry: 'United States',
    momentum: 84,
    growthIndicators: {
      starsGrowth: 445,
      forksGrowth: 67,
      activityScore: 79
    },
    trendDirection: 'up'
  },
  {
    id: '6',
    name: 'mobile-game-engine',
    fullName: 'unity/mobile-game-engine',
    owner: {
      login: 'unity',
      type: 'Organization',
      location: 'San Francisco, CA',
      avatarUrl: 'https://github.com/unity.png'
    },
    description: 'Lightweight game engine optimized for mobile platforms with WebGL support',
    stars: 734,
    forks: 98,
    language: 'C#',
    topics: ['gaming', 'mobile', 'webgl', 'unity'],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    url: 'https://github.com/unity/mobile-game-engine',
    inferredCountry: 'United States',
    momentum: 52,
    growthIndicators: {
      starsGrowth: 156,
      forksGrowth: 23,
      activityScore: 48
    },
    trendDirection: 'neutral'
  },
  {
    id: '7',
    name: 'edge-computing-framework',
    fullName: 'aws/edge-computing-framework',
    owner: {
      login: 'aws',
      type: 'Organization',
      location: 'Seattle, WA',
      avatarUrl: 'https://github.com/aws.png'
    },
    description: 'Distributed edge computing framework for IoT and real-time applications',
    stars: 1123,
    forks: 178,
    language: 'Rust',
    topics: ['edge-computing', 'iot', 'rust', 'distributed'],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    url: 'https://github.com/aws/edge-computing-framework',
    inferredCountry: 'United States',
    momentum: 69,
    growthIndicators: {
      starsGrowth: 289,
      forksGrowth: 34,
      activityScore: 62
    },
    trendDirection: 'up'
  },
  {
    id: '8',
    name: 'web3-wallet-sdk',
    fullName: 'metamask/web3-wallet-sdk',
    owner: {
      login: 'metamask',
      type: 'Organization',
      location: 'New York, NY',
      avatarUrl: 'https://github.com/metamask.png'
    },
    description: 'Comprehensive SDK for building Web3 wallet applications with multi-chain support',
    stars: 2341,
    forks: 456,
    language: 'JavaScript',
    topics: ['web3', 'wallet', 'blockchain', 'ethereum'],
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    url: 'https://github.com/metamask/web3-wallet-sdk',
    inferredCountry: 'United States',
    momentum: 87,
    growthIndicators: {
      starsGrowth: 623,
      forksGrowth: 89,
      activityScore: 81
    },
    trendDirection: 'up'
  },
  {
    id: '9',
    name: 'react-native-ui-kit',
    fullName: 'facebook/react-native-ui-kit',
    owner: {
      login: 'facebook',
      type: 'Organization',
      location: 'Menlo Park, CA',
      avatarUrl: 'https://github.com/facebook.png'
    },
    description: 'Modern UI component library for React Native with design system support',
    stars: 1567,
    forks: 234,
    language: 'TypeScript',
    topics: ['react-native', 'ui-kit', 'mobile', 'design-system'],
    createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    url: 'https://github.com/facebook/react-native-ui-kit',
    inferredCountry: 'United States',
    momentum: 74,
    growthIndicators: {
      starsGrowth: 389,
      forksGrowth: 45,
      activityScore: 68
    },
    trendDirection: 'up'
  },
  {
    id: '10',
    name: 'kubernetes-automation',
    fullName: 'redhat/kubernetes-automation',
    owner: {
      login: 'redhat',
      type: 'Organization',
      location: 'Raleigh, NC',
      avatarUrl: 'https://github.com/redhat.png'
    },
    description: 'Automated Kubernetes cluster management and deployment tools',
    stars: 923,
    forks: 145,
    language: 'Python',
    topics: ['kubernetes', 'automation', 'devops', 'containers'],
    createdAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    url: 'https://github.com/redhat/kubernetes-automation',
    inferredCountry: 'United States',
    momentum: 58,
    growthIndicators: {
      starsGrowth: 198,
      forksGrowth: 27,
      activityScore: 52
    },
    trendDirection: 'neutral'
  },
  {
    id: '11',
    name: 'ar-development-platform',
    fullName: 'apple/ar-development-platform',
    owner: {
      login: 'apple',
      type: 'Organization',
      location: 'Cupertino, CA',
      avatarUrl: 'https://github.com/apple.png'
    },
    description: 'Augmented reality development platform with spatial computing support',
    stars: 1876,
    forks: 267,
    language: 'Swift',
    topics: ['ar', 'augmented-reality', 'swift', 'ios'],
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    url: 'https://github.com/apple/ar-development-platform',
    inferredCountry: 'United States',
    momentum: 81,
    growthIndicators: {
      starsGrowth: 512,
      forksGrowth: 58,
      activityScore: 75
    },
    trendDirection: 'up'
  },
  {
    id: '12',
    name: 'data-analytics-engine',
    fullName: 'palantir/data-analytics-engine',
    owner: {
      login: 'palantir',
      type: 'Organization',
      location: 'Palo Alto, CA',
      avatarUrl: 'https://github.com/palantir.png'
    },
    description: 'High-performance data analytics engine for big data processing',
    stars: 645,
    forks: 89,
    language: 'Java',
    topics: ['data-analytics', 'big-data', 'java', 'performance'],
    createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    url: 'https://github.com/palantir/data-analytics-engine',
    inferredCountry: 'United States',
    momentum: 45,
    growthIndicators: {
      starsGrowth: 123,
      forksGrowth: 15,
      activityScore: 41
    },
    trendDirection: 'down'
  },
  {
    id: '13',
    name: 'microservices-framework',
    fullName: 'netflix/microservices-framework',
    owner: {
      login: 'netflix',
      type: 'Organization',
      location: 'Los Gatos, CA',
      avatarUrl: 'https://github.com/netflix.png'
    },
    description: 'Resilient microservices framework with circuit breakers and service discovery',
    stars: 1345,
    forks: 198,
    language: 'Java',
    topics: ['microservices', 'netflix', 'java', 'resilience'],
    createdAt: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    url: 'https://github.com/netflix/microservices-framework',
    inferredCountry: 'United States',
    momentum: 67,
    growthIndicators: {
      starsGrowth: 298,
      forksGrowth: 38,
      activityScore: 61
    },
    trendDirection: 'up'
  },
  {
    id: '14',
    name: 'ai-image-generator',
    fullName: 'stability-ai/ai-image-generator',
    owner: {
      login: 'stability-ai',
      type: 'Organization',
      location: 'London, UK',
      avatarUrl: 'https://github.com/stability-ai.png'
    },
    description: 'State-of-the-art AI image generation with diffusion models',
    stars: 3456,
    forks: 567,
    language: 'Python',
    topics: ['ai', 'image-generation', 'diffusion', 'machine-learning'],
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    url: 'https://github.com/stability-ai/ai-image-generator',
    inferredCountry: 'United Kingdom',
    momentum: 95,
    growthIndicators: {
      starsGrowth: 1234,
      forksGrowth: 156,
      activityScore: 91
    },
    trendDirection: 'up'
  },
  {
    id: '15',
    name: 'rust-async-runtime',
    fullName: 'tokio/rust-async-runtime',
    owner: {
      login: 'tokio',
      type: 'Organization',
      location: 'Tokyo, Japan',
      avatarUrl: 'https://github.com/tokio.png'
    },
    description: 'High-performance async runtime for Rust with advanced scheduling',
    stars: 823,
    forks: 134,
    language: 'Rust',
    topics: ['rust', 'async', 'runtime', 'performance'],
    createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    url: 'https://github.com/tokio/rust-async-runtime',
    inferredCountry: 'Japan',
    momentum: 48,
    growthIndicators: {
      starsGrowth: 167,
      forksGrowth: 22,
      activityScore: 44
    },
    trendDirection: 'neutral'
  }
];

const mockCountryStats: CountryStats[] = [
  {
    country: 'United States',
    countryCode: 'US',
    repositoryCount: 11,
    averageStars: 1654,
    totalStars: 18194,
    averageForks: 234,
    topLanguages: [
      { language: 'TypeScript', count: 3 },
      { language: 'Python', count: 2 },
      { language: 'Go', count: 2 },
      { language: 'JavaScript', count: 1 },
      { language: 'C#', count: 1 }
    ],
    momentum: 73
  },
  {
    country: 'Germany',
    countryCode: 'DE',
    repositoryCount: 1,
    averageStars: 1923,
    totalStars: 1923,
    averageForks: 156,
    topLanguages: [
      { language: 'Rust', count: 1 }
    ],
    momentum: 78
  },
  {
    country: 'United Kingdom',
    countryCode: 'GB',
    repositoryCount: 1,
    averageStars: 3456,
    totalStars: 3456,
    averageForks: 567,
    topLanguages: [
      { language: 'Python', count: 1 }
    ],
    momentum: 95
  },
  {
    country: 'Switzerland',
    countryCode: 'CH',
    repositoryCount: 1,
    averageStars: 892,
    totalStars: 892,
    averageForks: 167,
    topLanguages: [
      { language: 'Solidity', count: 1 }
    ],
    momentum: 71
  },
  {
    country: 'Japan',
    countryCode: 'JP',
    repositoryCount: 1,
    averageStars: 823,
    totalStars: 823,
    averageForks: 134,
    topLanguages: [
      { language: 'Rust', count: 1 }
    ],
    momentum: 48
  }
];

const mockRegionalMomentum: RegionalMomentum[] = [
  {
    country: 'United Kingdom',
    countryCode: 'GB',
    newRepositoriesCount: 1,
    averageStars: 3456,
    growthRate: 35.7,
    topLanguage: 'Python',
    flag: '🇬🇧'
  },
  {
    country: 'Germany',
    countryCode: 'DE',
    newRepositoriesCount: 1,
    averageStars: 1923,
    growthRate: 27.3,
    topLanguage: 'Rust',
    flag: '🇩🇪'
  },
  {
    country: 'United States',
    countryCode: 'US',
    newRepositoriesCount: 11,
    averageStars: 1654,
    growthRate: 18.9,
    topLanguage: 'TypeScript',
    flag: '🇺🇸'
  },
  {
    country: 'Switzerland',
    countryCode: 'CH',
    newRepositoriesCount: 1,
    averageStars: 892,
    growthRate: 26.2,
    topLanguage: 'Solidity',
    flag: '🇨🇭'
  },
  {
    country: 'Japan',
    countryCode: 'JP',
    newRepositoriesCount: 1,
    averageStars: 823,
    growthRate: 20.3,
    topLanguage: 'Rust',
    flag: '🇯🇵'
  }
];

const mockTechnologyDistribution: TechnologyDistribution[] = [
  {
    language: 'TypeScript',
    count: 3,
    countries: [
      { country: 'United States', count: 3 }
    ],
    percentage: 20.0
  },
  {
    language: 'Python',
    count: 3,
    countries: [
      { country: 'United States', count: 2 },
      { country: 'United Kingdom', count: 1 }
    ],
    percentage: 20.0
  },
  {
    language: 'Rust',
    count: 3,
    countries: [
      { country: 'Germany', count: 1 },
      { country: 'United States', count: 1 },
      { country: 'Japan', count: 1 }
    ],
    percentage: 20.0
  },
  {
    language: 'Go',
    count: 1,
    countries: [
      { country: 'United States', count: 1 }
    ],
    percentage: 6.7
  },
  {
    language: 'JavaScript',
    count: 1,
    countries: [
      { country: 'United States', count: 1 }
    ],
    percentage: 6.7
  },
  {
    language: 'C#',
    count: 1,
    countries: [
      { country: 'United States', count: 1 }
    ],
    percentage: 6.7
  },
  {
    language: 'Solidity',
    count: 1,
    countries: [
      { country: 'Switzerland', count: 1 }
    ],
    percentage: 6.7
  },
  {
    language: 'Swift',
    count: 1,
    countries: [
      { country: 'United States', count: 1 }
    ],
    percentage: 6.7
  },
  {
    language: 'Java',
    count: 1,
    countries: [
      { country: 'United States', count: 1 }
    ],
    percentage: 6.7
  }
];

const hiddenGems = mockRepositories
  .filter(repo => repo.stars < 1000 && repo.momentum > 60)
  .sort((a, b) => b.momentum - a.momentum)
  .slice(0, 5);

const breakoutWatchlist = mockRepositories
  .filter(repo => repo.growthIndicators.starsGrowth > 400)
  .sort((a, b) => b.growthIndicators.starsGrowth - a.growthIndicators.starsGrowth)
  .slice(0, 5);

export const mockGlobalDiscoveryData: GlobalDiscoveryData = {
  repositories: mockRepositories,
  countryStats: mockCountryStats,
  regionalMomentum: mockRegionalMomentum,
  technologyDistribution: mockTechnologyDistribution,
  hiddenGems,
  breakoutWatchlist,
  totalRepositories: mockRepositories.length,
  lastUpdated: new Date().toISOString()
};
