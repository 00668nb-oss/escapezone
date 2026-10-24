export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export const notFound = (what = 'המשאב', feminine = false) =>
  new HttpError(404, `${what} לא נמצא${feminine ? 'ה' : ''}`);

// פרמטר :id חייב להיות מספר שלם חיובי
export function parseId(value: unknown): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'מזהה לא תקין');
  return id;
}
