import { z } from "zod";

export const erpDocCreateBodySchema = z.object({
  doctype: z.string().min(1, "doctype required").max(100),
}).passthrough();

export type ErpDocCreateBody = z.infer<typeof erpDocCreateBodySchema>;
