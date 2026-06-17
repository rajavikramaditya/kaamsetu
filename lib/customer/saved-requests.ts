export type SavedRequest = {
  job_ref: string;
  public_id: string;
  phone: string;
  track_code: string;
  category: string;
  locality: string;
  created_at: string;
};

const STORAGE_KEY = "kaamsetu_saved_requests";
const MAX_SAVED = 30;

export function readSavedRequests(): SavedRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedRequest[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSavedRequests(requests: SavedRequest[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export function saveRequestToDevice(request: SavedRequest) {
  const existing = readSavedRequests().filter((r) => r.job_ref !== request.job_ref);
  writeSavedRequests([request, ...existing].slice(0, MAX_SAVED));
}

export function removeSavedRequest(jobRef: string) {
  writeSavedRequests(readSavedRequests().filter((r) => r.job_ref !== jobRef));
}

export function findSavedRequest(jobRef: string): SavedRequest | undefined {
  return readSavedRequests().find((r) => r.job_ref === jobRef);
}
