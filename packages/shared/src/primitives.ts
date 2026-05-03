import { z } from "zod";

export const moneySchema = z.number().finite().min(0);
export const idSchema = z.string().min(1);
export const slugSchema = z
  .string()
  .min(2)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
