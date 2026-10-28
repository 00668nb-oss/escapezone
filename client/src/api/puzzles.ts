import { fetchData } from "./client";
import type { AnswerResult, Puzzle, PuzzleInput } from "../types";

export function getRoomPuzzles(roomId: number): Promise<Puzzle[]> {
  return fetchData(`/rooms/${roomId}/puzzles`, "GET");
}

export function createPuzzle(
  roomId: number,
  input: PuzzleInput,
): Promise<Puzzle> {
  return fetchData(`/rooms/${roomId}/puzzles`, "POST", input);
}

export function updatePuzzle(
  id: number,
  input: Partial<PuzzleInput>,
): Promise<Puzzle> {
  return fetchData(`/puzzles/${id}`, "PUT", input);
}

export function deletePuzzle(id: number): Promise<{ ok: boolean }> {
  return fetchData(`/puzzles/${id}`, "DELETE");
}

export function submitAnswer(
  id: number,
  answer: string,
): Promise<AnswerResult> {
  return fetchData(`/puzzles/${id}/answer`, "POST", { answer });
}
