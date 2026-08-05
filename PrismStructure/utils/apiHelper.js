export function assertStatus(response, expectedStatus) {
  if (response.status() !== expectedStatus) {
    throw new Error(`Expected status ${expectedStatus} but got ${response.status()}: ${response.statusText()}`);
  }
}

export function assertStatusIn(response, expectedStatuses) {
  const status = response.status();
  if (!expectedStatuses.includes(status)) {
    throw new Error(
      `Expected one of [${expectedStatuses.join(', ')}] but got ${status}: ${response.statusText()}`
    );
  }
}

export async function parseJson(response) {
  return response.json();
}

export function redactToken(token) {
  if (!token) return '[no-token]';
  return `${token.slice(0, 6)}...redacted`;
}

export function extractPaginatedData(body) {
  return Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];
}

export function propagateToken(token, ...clients) {
  clients.forEach((client) => {
    if (client?.setToken) {
      client.setToken(token);
    }
  });
}
