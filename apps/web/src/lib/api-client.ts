const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000";

export class ApiRequestError extends Error {
  constructor(
    public readonly path: string,
    public readonly status: number,
    public readonly responseBody: unknown,
  ) {
    super(`API request failed for ${path} with status ${status}`);
    this.name = "ApiRequestError";
  }
}

type ErrorResponseBody = {
  message?: unknown;
};

export function getApiErrorMessage(error: ApiRequestError) {
  const body = error.responseBody;

  if (body && typeof body === "object" && "message" in body) {
    const message = (body as ErrorResponseBody).message;

    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }

  return `La API respondio con estado ${error.status}. Intenta de nuevo.`;
}

async function readResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    throw new ApiRequestError(path, response.status, await readResponseBody(response));
  }

  return (await response.json()) as T;
}
