import { expect } from '@playwright/test';
import { assertStatusIn, parseJson } from './apiHelper.js';

const INVALID_ULID = '01INVALID000000000000000000';

/**
 * Asserts an error response status and optional message pattern in the JSON body.
 */
export async function assertErrorResponse(response, expectedStatuses, messagePattern) {
  assertStatusIn(response, expectedStatuses);
  const body = await parseJson(response);
  const bodyText = JSON.stringify(body);
  expect(bodyText.length).toBeGreaterThan(0);

  if (messagePattern) {
    expect(bodyText).toMatch(messagePattern);
  }

  return body;
}

/**
 * Asserts a 401 Unauthorized response per OpenAPI UnauthorizedResponse.
 */
export async function assertUnauthorized(response) {
  const body = await assertErrorResponse(response, [401], /unauthorized/i);
  if (body.message) {
    expect(body.message).toMatch(/unauthorized/i);
  }
  return body;
}

/**
 * Asserts a not-found response for invalid resource IDs.
 */
export async function assertNotFound(response) {
  return assertErrorResponse(response, [404], /not found|requested item/i);
}

/**
 * Asserts validation failure for malformed request payloads.
 */
export async function assertValidationError(response) {
  return assertErrorResponse(response, [400, 422]);
}

export function getInvalidResourceId() {
  return INVALID_ULID;
}
