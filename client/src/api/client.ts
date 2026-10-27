import type { FieldError } from "../types/index";

const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  status: number;
  details?: FieldError[];
  constructor(message: string, status: number, details?: FieldError[]) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function fetchData<T>(
  path: string,
  method: string,
  body?: unknown,
): Promise<T> {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let data;
    try {
      data = await response.json();
    } catch (error) {
      throw new ApiError(
        `Failed to parse error response: ${error}`,
        response.status,
      );
    }
    throw new ApiError(`${data.error}`, response.status, data.details);
  }
  return await response.json();
}
