import { z } from "zod";

export const UploadMetadataSchema = z.object({
  url: z.string().url(),
});
