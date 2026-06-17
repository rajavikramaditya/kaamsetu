export type CustomerRequestSession = {
  invite_code: string;
  job_ref?: string;
  public_id?: string;
  track_code?: string;
  phone?: string;
};

const STORAGE_KEY = "kaamsetu_customer_session";

export function readCustomerSession(): CustomerRequestSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CustomerRequestSession;
  } catch {
    return null;
  }
}

export function writeCustomerSession(session: CustomerRequestSession) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function patchCustomerSession(patch: Partial<CustomerRequestSession>) {
  const current = readCustomerSession() ?? { invite_code: "" };
  writeCustomerSession({ ...current, ...patch });
}

export function clearCustomerSession() {
  sessionStorage.removeItem(STORAGE_KEY);
}
