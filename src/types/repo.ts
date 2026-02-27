export interface Repo {
  name: string;
  description: string | null;
  stars: number;
  starDelta: number;
  contributorDelta: number;
  language: string | null;
  url: string;
}