import { z } from "zod";

export { AdminLoginSchema } from "@monceri/shared";

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8).max(72),
});
