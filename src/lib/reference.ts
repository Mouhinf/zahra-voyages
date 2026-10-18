/**
 * Générateur de référence unique et normalisée de dossier SLAAC Voyages.
 * Format standard : DV-AAAAMMJJ-XXXX
 */

export function generateReferenceNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DV-${y}${m}${d}-${rand}`;
}
