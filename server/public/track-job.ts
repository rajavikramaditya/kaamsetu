import "server-only";

import type { TrackJobRequest, TrackJobResponse } from "@/types/api.types";

/** Tracks a job by ref, phone, and tracking code. Implemented in Sprint 4. */
export async function trackJob(
  _input: TrackJobRequest,
): Promise<TrackJobResponse> {
  throw new Error("trackJob is not implemented yet");
}
