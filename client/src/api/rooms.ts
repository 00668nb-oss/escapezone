import { fetchData } from "./client";
import type { Room, RoomFilters, RoomInput, Story } from "../types";

export function getRoom(id: number): Promise<Room> {
  return fetchData(`/rooms/${id}`, "GET");
}

export function getRooms(filters?: RoomFilters): Promise<Room[]> {
  const urlSearch = new URLSearchParams();

  if (filters?.search) urlSearch.append("search", filters.search);
  if (filters?.difficulty) urlSearch.append("difficulty", filters.difficulty);
  if (filters?.category) urlSearch.append("category", filters.category);
  if (filters?.status) urlSearch.append("status", filters.status);
  if (filters?.sort) urlSearch.append("sort", filters.sort);
  if (filters?.order) urlSearch.append("order", filters.order);

  const path = urlSearch.toString()
    ? `/rooms?${urlSearch.toString()}`
    : "/rooms";
  return fetchData(path, "GET");
}

export function createRoom(input: RoomInput): Promise<Room> {
  return fetchData("/rooms", "POST", input);
}

export function updateRoom(
  id: number,
  input: Partial<RoomInput>,
): Promise<Room> {
  return fetchData(`/rooms/${id}`, "PUT", input);
}

export function getStory(id: number): Promise<Story> {
  return fetchData(`/rooms/${id}/story`, "GET");
}
