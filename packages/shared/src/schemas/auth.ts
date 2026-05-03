import { z } from "zod";
import { idSchema } from "../primitives";

export const AdminRoleSchema = z.enum(["ADMIN", "SUPERADMIN"]);
export type AdminRole = z.infer<typeof AdminRoleSchema>;

export const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type AdminLoginInput = z.infer<typeof AdminLoginSchema>;

export const AdminSessionSchema = z.object({
  id: idSchema,
  email: z.string().email(),
  name: z.string().min(1),
  role: AdminRoleSchema,
});
export type AdminSession = z.infer<typeof AdminSessionSchema>;
