import { z } from "zod";
import { campaignLibrarySchema, campaignSchema, generatedPostSchema, scoreSchema } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const DEFAULT_TIMEOUT_MS = 120_000;

type ApiRequestInit = RequestInit & {
  timeoutMessage?: string;
  timeoutMs?: number;
};

async function request<T>(path: string, schema: z.ZodType<T>, init?: ApiRequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutMs = init?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeoutMessage = init?.timeoutMessage;
  const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const { timeoutMessage: _timeoutMessage, timeoutMs: _timeoutMs, ...requestInit } = init || {};
    const response = await fetch(`${API_URL}${path}`, {
      ...requestInit,
      signal: requestInit.signal || controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(requestInit.headers || {}),
      },
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    if (!response.ok) {
      const detail = data?.detail || response.statusText;
      throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
    }
    return schema.parse(data);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error(timeoutMessage || "Request timed out. Please try again.");
    }
    throw err;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

export function listCampaigns(ownerId?: string) {
  const query = ownerId ? `?owner_id=${encodeURIComponent(ownerId)}` : "";
  return request(`/campaigns${query}`, z.array(campaignSchema), { cache: "no-store" });
}

export function createCampaign(input: {
  name: string;
  voice: string;
  icp: string;
  rules: string;
  platform: string;
  owner_id: string;
}) {
  return request(
    "/campaign/create",
    z.object({ campaign_id: z.string(), name: z.string() }),
    { method: "POST", body: JSON.stringify(input) },
  );
}

export function scorePost(input: { campaign_id: string; owner_id: string; draft: string }) {
  return request("/score", scoreSchema, { method: "POST", body: JSON.stringify(input) });
}

export function generatePosts(input: { campaign_id: string; owner_id: string; brief: string }) {
  return request("/generate", z.array(generatedPostSchema), {
    method: "POST",
    body: JSON.stringify(input),
    timeoutMessage: "Generation timed out. OpenRouter is taking too long; try again or switch to a faster model.",
    timeoutMs: 120_000,
  });
}

export function getCampaignLibrary(input: { campaign_id: string; owner_id: string }) {
  const query = `?owner_id=${encodeURIComponent(input.owner_id)}`;
  return request(`/campaign/${encodeURIComponent(input.campaign_id)}/library${query}`, campaignLibrarySchema, { cache: "no-store" });
}

export function approvePost(input: { campaign_id: string; owner_id: string; content: string; brand_score: number }) {
  return request("/approve", z.object({ ok: z.boolean() }), {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function rejectPost(input: { campaign_id: string; owner_id: string; content: string; reason: string }) {
  return request("/reject", z.object({ ok: z.boolean() }), {
    method: "POST",
    body: JSON.stringify(input),
  });
}
