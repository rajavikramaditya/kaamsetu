import "server-only";

import type { CreateRequestBody, CreateRequestResponse } from "@/types/api.types";

/** Creates a customer job request. Implemented in Sprint 4. */
export async function createCustomerRequest(
  _input: CreateRequestBody,
): Promise<CreateRequestResponse> {
  throw new Error("createCustomerRequest is not implemented yet");
}
