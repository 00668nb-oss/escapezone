import { fetchData } from "./client";
import type { Progress } from "../types";

export function getAllProgress(): Promise<Progress[]> {
  return fetchData(`/progress`, "GET");
}

export function getProgress(roomId: number): Promise<Progress> {
  return fetchData(`/progress/${roomId}`, "GET");
}

export function startRoom(roomId: number): Promise<Progress> {
  return fetchData(`/progress/${roomId}/start`, "POST");
}
