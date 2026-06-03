import type { NotificationInstance } from "antd/es/notification/interface";
import { ApiClientError } from "@/providers/api-client";

export function notifyApiError(notification: NotificationInstance, error: unknown) {
  if (error instanceof ApiClientError) {
    notification.error({
      description: error.message,
      duration: 8,
      message: error.status >= 500 ? "Error de conexion" : "No se pudo completar la accion",
    });
    return;
  }

  notification.error({
    description: error instanceof Error ? error.message : "Verifica tu internet e intenta de nuevo.",
    duration: 8,
    message: "Error de conexion",
  });
}
