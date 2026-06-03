export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

type ApiErrorBody = {
  code?: string;
  message?: string;
};

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code = "API_ERROR",
  ) {
    super(message);
  }
}

async function parseError(response: Response) {
  const body = (await response.json().catch(() => null)) as ApiErrorBody | null;

  return new ApiClientError(
    body?.message ?? "Error de comunicacion con la API",
    response.status,
    body?.code,
  );
}

export async function apiRequest<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    ...init,
    headers:
      init.body instanceof FormData
        ? init.headers
        : {
            "Content-Type": "application/json",
            ...init.headers,
          },
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function appError(error: unknown) {
  if (error instanceof ApiClientError) {
    return {
      message: error.message,
      name: error.code,
      statusCode: error.status,
    };
  }

  return {
    message: error instanceof Error ? error.message : "Error inesperado",
    name: "UNKNOWN_ERROR",
  };
}
