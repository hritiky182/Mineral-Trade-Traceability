/**
 * Deterministic cryptographic hashing utility for Simulated Ledger & Audit Evidence
 * Uses browser native Web Crypto API (SHA-256)
 */

export async function generateSha256(data: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback pseudo-hash for non-secure contexts if Web Crypto is unavailable
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return '0x' + Math.abs(hash).toString(16).padStart(16, '0') + 'f99c82a170';
  }
}

export function generateEventCanonicalPayload(event: {
  id: string;
  eventType: string;
  timestamp: string;
  location: string;
  description: string;
  actorName: string;
  previousEventHash?: string;
}): string {
  return JSON.stringify({
    id: event.id,
    type: event.eventType,
    time: event.timestamp,
    loc: event.location,
    desc: event.description,
    actor: event.actorName,
    prev: event.previousEventHash || '0x0000000000000000000000000000000000000000000000000000000000000000'
  });
}
