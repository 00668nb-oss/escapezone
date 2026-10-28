export type Role = "admin" | "player";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
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
  hint?: string | null;
  codeLength?: number | null;
  hotspotX?: number | null;
  hotspotY?: number | null;
};

export type ProgressStatus = "not_started" | "in_progress" | "completed";

export type Progress = {
  roomId: number;
  status: ProgressStatus;
  solvedPuzzleIds: number[];
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
  hint?: string | null;
  codeLength?: number | null;
  hotspotX?: number | null;
  hotspotY?: number | null;
};

export type RoomFilters = {
  search?: string;
  difficulty?: Difficulty;
  category?: string;
  status?: Status;
  sort?: "name" | "difficulty" | "category" | "createdAt" | "timeLimit";
  order?: "asc" | "desc";
};

export type FieldError = {
  field: string;
  message: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type StoryPuzzle = {
  id: number;
  title: string;
  storyText: string | null;
};

export type Story = {
  roomName: string;
  puzzles: StoryPuzzle[];
  finalText: string | null;
};

export type AnswerResult = {
  correct: boolean;
};

export type ContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (response: AuthResponse) => void;
  logout: () => void;
};
