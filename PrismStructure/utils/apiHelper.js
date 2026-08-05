export function assertStatus(response, expectedStatus) {
  if (response.status() !== expectedStatus) {
    throw new Error(`Expected status ${expectedStatus} but got ${response.status()}: ${response.statusText()}`);
  }
}

export async function parseJson(response) {
  return response.json();
}

export function redactToken(token) {
  if (!token) return '[no-token]';
  return `${token.slice(0, 6)}...redacted`;
}
