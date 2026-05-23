import { z } from "zod";

export const campaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  platform: z.string(),
  repo_path: z.string(),
  created_at: z.string(),
  owner_id: z.string().nullable().optional(),
});

export const xAlgorithmSignalSchema = z.object({
  metric: z.string(),
  characteristic: z.string(),
  value: z.number(),
  source: z.string(),
});

export const scoreSchema = z.object({
  like: z.number(),
  reply: z.number(),
  repost: z.number(),
  click: z.number(),
  block: z.number(),
  mute: z.number(),
  brand_score: z.number(),
  x_action_scores: z.record(z.number()).optional(),
  x_algorithm_signals: z.array(xAlgorithmSignalSchema).optional(),
  rewrites: z.array(z.string()).length(2),
});

export const generatedPostSchema = z.object({
  content: z.string(),
  scores: scoreSchema,
});

export const approvedPostSchema = z.object({
  id: z.string(),
  content: z.string(),
  created_at: z.string().nullable().optional(),
  brand_score: z.number(),
});

export const rejectedPostSchema = z.object({
  id: z.string(),
  content: z.string(),
  created_at: z.string().nullable().optional(),
  reason: z.string(),
});

export const campaignLibrarySchema = z.object({
  approved: z.array(approvedPostSchema),
  rejected: z.array(rejectedPostSchema),
});

export type Campaign = z.infer<typeof campaignSchema>;
export type Scores = z.infer<typeof scoreSchema>;
export type GeneratedPost = z.infer<typeof generatedPostSchema>;
export type ApprovedPost = z.infer<typeof approvedPostSchema>;
export type RejectedPost = z.infer<typeof rejectedPostSchema>;
export type CampaignLibrary = z.infer<typeof campaignLibrarySchema>;
