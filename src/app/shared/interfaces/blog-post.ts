export interface BlogPost {
  id: string;
  title: string;
  content: string;
  raceSessionKey: string;
  createdAt: Date;
  author: string;
  excerpt?: string;
}