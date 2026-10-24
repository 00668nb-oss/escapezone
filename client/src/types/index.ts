export type Role = "admin" | "player";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
};

export type Difficulty = "easy" | "medium" | "hard";
export type Status = "draft" | "published" | "archived";

export type Room = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  difficulty: Difficulty;
  category: string;
  timeLimit: number;
  status: Status;
  finalText: string | null;
  puzzleCount: number;
  createdAt: string;
  updatedAt: string;
};

export type Puzzle = {
  id: number;
  roomId: number;
  order: number;
  title: string;
  prompt: string;
  hotspotLabel: string;
  storyText: string | null;
  solved?: boolean;
};

export type ProgressStatus = "not_started" | "in_progress" | "completed";

export type Progress = {
  roomId: number;
  status: ProgressStatus;
  solvedPuzzleIDs: number[];
  startedAt: string | null;
  completedAt: string | null;
};

export type RoomInput = {
  name: string;
  description?: string;
  imageUrl: string;
  difficulty: Difficulty;
  category: string;
  timeLimit: number;
  status?: Status;
  finalText?: string | null;
};

export type PuzzleInput = {
  order: number;
  title: string;
  prompt: string;
  hotspotLabel: string;
  storyText?: string | null;
  answer: string;
};

export type RoomFilters = {
  search?: string;
  difficulty?: Difficulty;
  category?: string;
  status?: Status;
  sort?:
    | "name"
    | "difficulty"
    | "category"
    | "status"
    | "createdAt"
    | "updatedAt";
  order?: "asc" | "desc";
};
