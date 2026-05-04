import type { AuthProvider } from "@refinedev/core";
import { apiRequest, appError, ApiClientError } from "./api-client";

export type AdminIdentity = {
  email: string;
  name: string;
  role: string;
  sub?: string;
};

function readCredentials(params: unknown) {
  if (!params || typeof params !== "object") {
    return { email: "", password: "" };
  }

  const record = params as Record<string, unknown>;

  return {
    email: typeof record.email === "string" ? record.email : "",
    password: typeof record.password === "string" ? record.password : "",
  };
}

export const authProvider: AuthProvider = {
  async login(params: unknown) {
    const credentials = readCredentials(params);

    try {
      await apiRequest<AdminIdentity>("/api/admin/auth/login", {
        body: JSON.stringify(credentials),
        method: "POST",
      });

      return { redirectTo: "/dashboard", success: true };
    } catch (error) {
      return { error: appError(error), success: false };
    }
  },

  async logout() {
    await apiRequest<void>("/api/admin/auth/logout", { method: "POST" }).catch(() => undefined);
    return { redirectTo: "/login", success: true };
  },

  async check() {
    try {
      await apiRequest<AdminIdentity>("/api/admin/auth/me");
      return { authenticated: true };
    } catch (error) {
      return {
        authenticated: false,
        error: appError(error),
        logout: true,
        redirectTo: "/login",
      };
    }
  },

  async getIdentity() {
    return apiRequest<AdminIdentity>("/api/admin/auth/me");
  },

  async onError(error: unknown) {
    if (error instanceof ApiClientError && error.status === 401) {
      return { logout: true, redirectTo: "/login" };
    }

    return {};
  },
};
