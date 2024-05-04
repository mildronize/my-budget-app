import { z } from 'zod';

export const schema = z.object({
  TARGET_URL: z.string(),
  PORT: z.string().default('7072'),
});
